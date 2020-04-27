export const eventLoopQueue = () => {
  return new Promise(resolve =>
    setImmediate(() => {
      resolve();
    })
  );
};
