const wrkPkg = require('wrk');
const { spawn } = require('child_process');
const { join } = require('path');
const { table } = require('console');

module.default = async function checkBenchmarks() {
  await getBenchmarks();
}

const wrk = (options) =>
  new Promise((resolve, reject) =>
    wrkPkg(options, (err, result) =>
      err ? reject(err) : resolve(result),
    ),
  );

const sleep = (time) =>
  new Promise(resolve => setTimeout(resolve, time));

const BENCHMARK_PATH = join(process.cwd(), 'benchmarks');

const LIBS = [
	'cmmv-simple:5001', 'http:5002', 'express-simple:5003',
	'fastify:5004', 'hapi:5005', 'koa:5006', 'resfity:5007'
];

async function runBenchmarkOfLib(lib) {
	let cmd = "node";
	let script = null;
	let process = null;
	let port = 0;

	if (typeof lib === "object") {
		cmd = lib.cmd;
		script = lib.name;
		port = lib.port;
		console.log(`Running: ${cmd} ${lib.args.join(' ')}: ${lib.port}`);
		process = spawn(cmd, lib.args, { shell: true });
	} else {
		const [file, portStr] = lib.split(":");
		script = `${file}.js`;
		port = portStr;
		const libPath = join(BENCHMARK_PATH, script);
		console.log(`Running: ${cmd} ${libPath}: ${port}`);
		process = spawn(cmd, [libPath], { shell: true });
	}

	process.stderr.on('data', data => {
		console.log(`stderr: ${data}`);
	});

  	process.unref();

  	await sleep(10000);

	const result = await wrk({
		threads: 8,
		duration: '10s',
		connections: 1024,
		url: `http://localhost:${port}`,
	});

	process.kill('SIGKILL');
	process.unref();
	
	return result;
}

async function getBenchmarks() {
	const results = {};

	for (let lib of LIBS) {
		console.log(`Running benchmark for ${(typeof lib === "object") ? lib.name : lib}`);

		try {
			const result = await runBenchmarkOfLib(lib);
			results[(typeof lib === "object") ? lib.name : lib] = result;
		} catch (error) {
			console.error(`Error during benchmark for ${(typeof lib === "object") ? lib.name : lib}:`, error);
		}
	}

  	return results;
}

async function run() {
  	const results = await getBenchmarks();

	const tableData = Object.entries(results).map(([lib, result]) => ({
		Framework: lib.replace("-simple", ""),
		'Reqs/sec': result.requestsPerSec,
		'Transfer/sec': result.transferPerSec,
		Latency: result.latencyAvg,
		'Total Reqs': result.requestsTotal,
		'Transfer Total': result.transferTotal,
		'Latency Stdev': result.latencyStdev,
		'Latency Max': result.latencyMax,
	}));

  	tableData.sort((a, b) => b['Reqs/sec'] - a['Reqs/sec']);

  	console.table(tableData);
}

run();
