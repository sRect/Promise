import axios from "axios";
import MyPromise from "@/promise";
// require("./tween_test");
// import "@/css/main.css";

let p = new MyPromise((resolve, reject) => {
  // https://www.cnblogs.com/liujiuzhou/p/11547156.html
  axios
    .get(`http://wthrcdn.etouch.cn/weather_mini?city=上海`)
    .then(res => {
      // {city, ganmao, wendu, forecast}
      resolve(res.data);
    })
    .catch(error => {
      console.log(error);
      reject(error);
    });
});

// promise 有多个状态，如果成功会让成功的函数 依次执行
// 如果失败 让失败的函数依次执行
// 这是典型的发布订阅
p.then(
  data => {
    console.log(data);
  },
  error => {
    console.error(error);
  }
);

p.then(
  data => {
    console.log(data);
  },
  error => {
    console.error(error);
  }
);
