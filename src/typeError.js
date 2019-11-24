const MyPromise = require("./promise-commonjs2");

let p = new MyPromise((resolve, reject) => {
  resolve(1);
});

let p2 = p.then(() => {
  return p2;
});

p2.then(
  data => {
    console.log(data);
  },
  err => {
    console.log(err); // TypeError: Chaining cycle detected for promise #<Promise>
  }
);
