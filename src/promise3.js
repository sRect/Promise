// promise 的链式调用
// 可以返回一个普通值，也可以返回一个promise
// 如果then方法中的成功或者失败在执行的时候发生错误 会走下一个then的失败的回调
// 如果then方法返回了一个失败的promise，他会走外层then的失败回调
// 如果都执行结束了，此时返回一个普通值，继续往下then，不管上一次的then是成功或者失败，走下一个then的成功

const fs = require("fs");
const path = require("path");
const MyPromise = require("./promise-commonjs.js");

function read(filePath) {
  return new MyPromise((resolve, reject) => {
    // resolve(1);
    reject(1);
  });
}

let promise2 = read(path.resolve(__dirname, "./js/fs/1.txt")).then(
  data => {
    console.log(data);
    return 100;
  },
  error => {
    console.log(error);
    return -100;
  }
);

let promise3 = promise2.then(data => {
  console.log(data);
  throw new Error("err");
});

promise3.then(
  data => {
    console.log(data);
  },
  err => {
    console.log("err", err);
  }
);
