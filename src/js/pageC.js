import foo1 from "./utils1";
import foo3 from "./utils3";

const c = "c";

const fnC = arg => {
  return `pageC:${arg}`;
};

let result1 = foo1(fnC(c));
let result2 = foo3(result1);
console.log(result2);
