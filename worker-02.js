const {
    performance,
    PerformanceObserver
} = require('perf_hooks');
const fs = require('fs').promises;
const { parentPort } = require('worker_threads');
const { instantiate } = require("@assemblyscript/loader");

const wait = dur => new Promise(r => setTimeout(r, dur))

const log = (...s) => console.log('WORKER |', ...s)

log('worker running')

parentPort.on('message', async (data) => {
    const {memory} = data;

    const printMem = () => log(memory.buffer.byteLength)

    const pathToWasm = __dirname + "/build/optimized.wasm";

    const file = await fs.readFile(pathToWasm)

    // console.log(memory)

    const mod = await instantiate(file, {
        env: {
            memory
        }
    })

    printMem()

    const start = performance.now();
    mod.exports.big_alloc(100000, 5)
    const end = performance.now();

    printMem()

    parentPort.close();
})