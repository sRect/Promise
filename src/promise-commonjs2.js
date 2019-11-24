// https://promisesaplus.com/
const status = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected"
};

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    throw new TypeError(
      "TypeError: Chaining cycle detected for promise #<Promise> my"
    );
    // console.log('死循环');
  }
  // console.log(promise2, x);
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
