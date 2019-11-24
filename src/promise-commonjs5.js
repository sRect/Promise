// https://promisesaplus.com/
const status = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected"
};

// 解析x
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    // console.log('死循环');
    return reject(
      new TypeError(
        "TypeError: Chaining cycle detected for promise #<Promise> my"
      )
    );
  }
  // 判断x的类型
  // 怎么判断x是不是一个promise,看他有没有then方法
  let called; // 防止调用了成功同时又调用了失败
  if (typeof x === "function" || (typeof x === "object" && x != null)) {
    try {
      let then = x.then; // 尝试的取then，有可能报错
      if (typeof then === "function") {
        // 认为是一个promise
        // 不要使用x.then,否则再次取值
        then.call(
          x,
          y => {
            if (called) return; // 1)
            called = true;
            // y有可能也是一个promise
            // resolve(y);
            resolvePromise(promise2, y, resolve, reject);
          },
          err => {
            if (called) return; // 2)
            called = true;
            reject(err);
          }
        );
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return; // 3)  防止promise被调用多次
      called = true;
      reject(error);
    }
  } else {
    // x是个常量
    resolve(x);
  }
}

class MyPromise {
  constructor(executor) {
    this.status = status.PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = []; // 存放所有成功的回调，只有pendding时才存储，其它状态直接执行
    this.onRejectedCallbacks = []; // 存放所有失败的回调

    let resolve = value => {
      if (this.status === status.PENDING) {
        this.value = value;
        this.status = status.FULFILLED;

        this.onResolvedCallbacks.forEach(fn => fn());
      }
    };
    let reject = reason => {
      if (this.status === status.PENDING) {
        this.reason = reason;
        this.status = status.REJECTED;

        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    executor(resolve, reject);
  }

  then(onFulfilled, onRejected) {
    // typeof onFulfilled === 'function' ? onFulfilled : function(data) {return data};
    // 值得穿透解决
    typeof onFulfilled === "function" ? onFulfilled : val => val;
    typeof onRejected === "function"
      ? onRejected
      : err => {
          throw err;
        };

    let promise2 = null;
    // 可以不停的调用then方法
    promise2 = new MyPromise((resolve, reject) => {
      if (this.status === status.FULFILLED) {
        // 加setTimeout的原因，是因为要传入promise2实例，源码中不是用setTimeout来解决的
        setTimeout(() => {
          // 捕获执行时候的错误
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }

      if (this.status === status.REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }

      if (this.status === status.PENDING) {
        // console.log("pending")
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    });

    return promise2;
  }
}

module.exports = MyPromise;
