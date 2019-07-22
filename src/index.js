import MyPromise from "@/promise";
require("./AOP");

console.log(MyPromise);
let p = new MyPromise((resolve, reject) => {
  resolve("success");
  reject("failer");
});

p.then(
  data => {
    console.log(data);
  },
  error => {
    console.error(error);
  }
);
