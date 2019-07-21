import MyPromise from "@/promise";

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
