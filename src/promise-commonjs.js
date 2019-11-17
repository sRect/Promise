// https://promisesaplus.com/
const status = {
  PENDING: "pending",
  FULFILLED: "fulfilled",
  REJECTED: "rejected"
};

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
        // 捕获执行时候的错误
        try {
          let val = onFulfilled(this.value);
          resolve(val);
        } catch (error) {
          reject(error);
        }
      }

      if (this.status === status.REJECTED) {
        try {
          let val = onRejected(this.reason);
          resolve(val);
        } catch (error) {
          reject(error);
        }
      }

      if (this.status === status.PENDING) {
        // console.log("pending")
        this.onResolvedCallbacks.push(() => {
          try {
            let val = onFulfilled(this.value);
            resolve(val);
          } catch (error) {
            reject(error);
          }
        });
        this.onRejectedCallbacks.push(() => {
          try {
            let val = onRejected(this.reason);
            resolve(val);
          } catch (error) {
            reject(error);
          }
        });
      }
    });

    return promise2;
  }
}

module.exports = MyPromise;
