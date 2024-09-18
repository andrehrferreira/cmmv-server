const { getBenchmarks } = require('./get-benchmarks');

module.default = async function checkBenchmarks() {
  const currentBenchmarks = await getBenchmarks();
}