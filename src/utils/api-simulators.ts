export const ApiSimulator = (value: boolean, delay = 1500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value) {
        resolve(value);
      } else {
        reject(new Error("Simulated error: value is false"));
      }
    }, delay);
  });
};
