// https://promisesaplus.com/
import * as status from "@/promiseStatus";
class MyPromise {
  constructor(executor) {
    this.status = status.PENDING;
    this.value = undefined;
    this.reason = undefined;

    let resolve = value => {
      if (this.status === status.PENDING) {
        this.value = value;
        this.status = status.FULFILLED;
      }
    };
    let reject = reason => {
      if (this.status === status.PENDING) {
        this.reason = reason;
        this.status = status.REJECTED;
      }
    };

    executor(resolve, reject);
  }

  then(onFulfilled, onRejected) {
    if (this.status === status.FULFILLED) {
      onFulfilled(this.value);
    }

    if (this.status === status.REJECTED) {
      onRejected(this.reason);
    }
  }
}

export default MyPromise;
