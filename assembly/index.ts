// The entry file of your WebAssembly module.

function shuffle (array: i32[]): i32[]{
  for(let i = 0 as i32; i < array.length; i++){
    let j = Math.floor(Math.random() * array.length) as i32;
    const tmp = array[i]
    array[i] = array[j]
    array[j] = tmp;
  }
  return array;
}

export function big_alloc(size: i32, shuffles: i32): i32[] {
  const xs: i32[] = new Array<i32>(size);

  for(let i = 0 as i32; i < size; i++){
    xs[i] = i;
  }

  for(let i = 0; i < shuffles; i++){
    shuffle(xs);
  }

  return xs;
}

export function fib(n: i32): i32{
  return (n <= 1) ? n : fib(n - 2) + fib(n - 1)
}