import foo1 from "./utils1";
import foo2 from "./utils2";
import moment from "moment";

const b = "b";

const fnB = arg => {
  return `pageB:${arg}`;
};

let result1 = foo1(fnB(b));
let result2 = foo2(result1);
console.log(result2);
console.log(moment().format());
