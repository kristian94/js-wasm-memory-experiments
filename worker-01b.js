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

function shuffle (array){
  for(let i = 0; i < array.length; i++){
    let j = Math.floor(Math.random() * array.length);
    const tmp = array[i]
    array[i] = array[j]
    array[j] = tmp;
  }
  return array;
}

function big_alloc(size, shuffles) {
  const xs = [];

  for(let i = 0; i < size; i++){
    xs[i] = {a: i};
  }

  for(let i = 0; i < shuffles; i++){
    shuffle(xs);
  }

  return xs;
}

function fib(n){
  return (n <= 1) ? n : fib(n - 2) + fib(n - 1)
}

;(async () => {
    // const pathToWasm = __dirname + "/build/optimized.wasm";
    const pathToWasm = __dirname + "/build/untouched.wasm";

    const file = await fs.readFile(pathToWasm)

    const mod = await instantiate(file)

    const before = performance.now();

    // const a = fib(44);
    const a = big_alloc(5000000, 5);

    const after = performance.now();

    console.log('returned:', a)
    console.log('elapsed (ms):', after - before)

})();
