const AutoCannon = require('autocannon');
const { spawn } = require('child_process');
const { join } = require('path');

module.default = async function checkBenchmarks() {
  await getBenchmarks();
}

const autocannon = (options) =>
  new Promise((resolve, reject) =>
  	AutoCannon(options, (err, result) =>
      err ? reject(err) : resolve(result),
    ),
  );

const sleep = (time) =>
  new Promise(resolve => setTimeout(resolve, time));

const BENCHMARK_PATH = join(process.cwd(), 'benchmarks');

const LIBS = [
	'cmmv-middlewares:6001', 'express-middlewares:6003',
	'fastify-middlewares:6004'
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

	const result = await autocannon({
		duration: 40,
		connections: 100,
		pipelining: 10,
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

function formatBytes(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatLatency(latency) {
    return latency.toFixed(0) + ' ms';
}

async function run() {
  	const results = await getBenchmarks();

	const tableData = Object.entries(results).map(([lib, result]) => ({
		Framework: lib.replace("-middlewares", "").split(":")[0],
		'Reqs/s': Number(result.requests.average.toFixed(0)),
		'Total Reqs': result.requests.total,
		'Transfer/s': formatBytes(result.throughput.average),
		'Transfer Total': formatBytes(result.throughput.total),
		Latency: formatLatency(result.latency.average),
	}));

  	tableData.sort((a, b) => b['Reqs/s'] - a['Reqs/s']);

  	console.table(tableData);
}

run();
