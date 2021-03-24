const {
    performance,
    PerformanceObserver
  } = require('perf_hooks');

const { Worker } = require('worker_threads');
const prettyBytes = require('pretty-bytes');
const { instantiate } = require("@assemblyscript/loader");
const fs = require('fs').promises;

const log = (...s) => console.log('MASTER |', ...s)

;(async () => {

    const snaps = [];

    const memory = new WebAssembly.Memory({
        initial: 1,
        maximum: 1000,
        shared: true
    })

    const printMem = () => log(memory.buffer.byteLength)

    await new Promise((res) => {
        const worker = new Worker('./worker-02.js');

        printMem();

        worker.postMessage({
            memory
        })
    
        worker.on('exit', () => {
            
            res();
    
            console.log('exit');
            printMem();
        })

        
    })

    return;

    gc()
    snaps.push(process.memoryUsage());

    // const rss = snaps.map(x => x.rss);

    // const lowest = rss.reduce((a, b) => Math.min(a, b), Infinity)

    // console.log('snaps:', snaps.map(x => prettyBytes(x.rss - lowest)));

    console.log(snaps[0])

    const f = prop => {
        console.log(prop)
        const vals = snaps.map(x => x[prop]);

        const lowest = vals.reduce((a, b) => Math.min(a, b), Infinity)

        console.log(vals.map(x => prettyBytes(x - lowest)));
        // console.log(vals.map(x => x - lowest));
        console.log('---')
    }

    f('rss')

    // var sab = new SharedArrayBuffer(1024);
    // worker.postMessage(sab);
})()
