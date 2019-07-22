class IteratorTest {
  constructor(arr) {
    this.arr = arr || [];
  }

  createIterator() {
    return new Promise((resolve, reject) => {
      let iterator = this.arr[Symbol.iterator]();

      if (iterator) {
        resolve(iterator);
      } else {
        reject("ERROR");
      }
    });
  }

  async foo() {
    let [error, iterator] = await this.createIterator()
      .then(data => [null, data])
      .catch(error => [error, null]);

    if (iterator) {
      console.log(iterator.next());
      console.log(iterator.next());
      console.log(iterator.next());
      console.log(iterator.next());
    }
  }
}

const iteratorTest = new IteratorTest([1, 2, 3]);
iteratorTest.foo();

Function.prototype.before = function(beforeFn) {
  var _self = this; // 保存原函数的引用
  // 返回包含了原函数和新函数的"代理"函数
  return function(...args) {
    // 执行新函数，且保证 this 不被劫持，新函数接受的参数
    // 也会被原封不动地传入原函数，新函数在原函数之前执行
    beforeFn.apply(this, ...args);
    // 执行原函数并返回原函数的执行结果，
    // 并且保证 this 不被劫持
    return _self.apply(this, ...args);
  };
};

// after 的原理跟 before 一模一样,唯一不同的地方在于让新添加的函数在原函数执行之后再执行。
Function.prototype.after = function(afterfn) {
  var _self = this;
  return function() {
    var ret = _self.apply(this, arguments);
    afterfn.apply(this, arguments);
    return ret;
  };
};

var foo = function() {
  console.log(1);
};

foo = foo.after(function() {
  console.log(2);
});

foo = foo.before(function() {
  console.log(0);
});

foo();

// 上面的 AOP实现是在 Function.prototype 上添加 before 和 after 方法，但许
// 多人不喜欢这种污染原型的方式， 那么我们可以做一些变通， 把原函数和新函数都作为参数传入
// before 或者 after 方法：
var before = function(fn, beforefn) {
  return function() {
    beforefn.apply(this, arguments);
    return fn.apply(this, arguments);
  };
};
var a = before(
  function() {
    console.log(3);
  },
  function() {
    console.log(2);
  }
);
a = before(a, function() {
  console.log(1);
});
a = before(a, function() {
  console.log(0);
});
a();

// AOP应用实例
// 比如页面中有一个登录 button，点击这个 button会弹出登录浮层，与此同时要进行数据上报，
// 来统计有多少用户点击了这个登录 button：
var btn = document.getElementById("btn");
var showModal = function() {
  console.log("打开模态框");
};

var dispatchLog = function() {
  console.log("发送数据统计");
};

// var after = function(fn, afterfn) {
//   return function(...args) {
//     fn.apply(this, ...args);
//     afterfn.apply(this, ...args);
//   }
// };

// var handleClick = after(showModal, dispatchLog);
// handleClick();

Function.prototype.after_test = function(afterfn) {
  var _this = this;
  return function() {
    var fn = _this.apply(this, arguments);
    afterfn.apply(this, arguments);
    return fn;
  };
};

showModal = showModal.after_test(dispatchLog);
showModal();

// https://juejin.im/post/5d0f5dd551882532d72507f2
// AOP
function after(target, key, desc) {
  console.log(target, key, desc);
  const { value } = desc;
  console.log(value);
  desc.value = function(...args) {
    let res = value.apply(this, args);
    console.log("加滤镜");
    return res;
  };
  return desc;
}

class Test {
  @after
  takePhoto() {
    console.log("拍照");
  }
}

let t = new Test();
t.takePhoto();
