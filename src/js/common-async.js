import(/* webpackChunkName: "f.js" */ "./f").then(f => {
  console.log(f);
});

const p = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(f());
    });
  });
};

export default p;
