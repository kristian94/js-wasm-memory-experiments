const {
    performance,
    PerformanceObserver
  } = require('perf_hooks');

const { Worker } = require('worker_threads');
const prettyBytes = require('pretty-bytes');


;(async () => {

    const snaps = [];

    const intervalId = setInterval(() => {
        snaps.push(process.memoryUsage());
    }, 200)

    gc()
    snaps.push(process.memoryUsage());

    await new Promise((res) => {
        const worker = new Worker('./worker-01b.js');
    
        worker.on('exit', () => {
            clearInterval(intervalId);
            
            res();
    
            console.log('exit');
        })

        
    })

    gc()
    snaps.push(process.memoryUsage());

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
    f('heapTotal')
    f('heapUsed')
    f('external')
    f('arrayBuffers')




    // var sab = new SharedArrayBuffer(1024);
    // worker.postMessage(sab);
})()
