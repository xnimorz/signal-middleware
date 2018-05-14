export const wrapPromise = signalObject => {
  let _resolve;
  let _reject;
  const promise = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });
  return {
    ...signalObject,
    promise,
    signalResolver: { resolve: _resolve, reject: _reject }
  };
};
