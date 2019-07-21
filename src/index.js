import Promise from "@/promise";

console.log(Promise);
let p = new Promise((resolve, reject) => {
  resolve("hello");
});

p.then(
  data => {
    console.log(data);
  },
  error => {
    console.error(error);
  }
);
