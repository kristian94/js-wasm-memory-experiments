const {
    performance,
    PerformanceObserver
  } = require('perf_hooks');
const fs = require('fs').promises;
const { workerData, parentPort } = require('worker_threads');
const { instantiate } = require("@assemblyscript/loader");

const wait = dur => new Promise(r => setTimeout(r, dur))

const log = (...s) => console.log('WORKER |', ...s)

log('worker running')

;(async () => {
    // const pathToWasm = __dirname + "/build/optimized.wasm";
    const pathToWasm = __dirname + "/build/untouched.wasm";

    const file = await fs.readFile(pathToWasm)

    const mod = await instantiate(file)

    const before = performance.now();

    // const a = mod.exports.fib(44);
    const a = mod.exports.big_alloc(100000, 5);

    const after = performance.now();

    console.log('elapsed (ms):', after - before)

    console.log('returned:', a)


})();
