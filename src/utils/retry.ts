export function retryPromise<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
  onRetry: (count: number) => void,
): Promise<T> {
  return new Promise((resolve, reject) => {
    let count = 0;

    function attempt(remainingRetries: number) {
      fn()
        .then(resolve) // If the promise is successful, resolve it
        .catch((error) => {
          count++;
          if (remainingRetries > 0) {
            retries--;
            console.log(`Retrying... attempts left: ${remainingRetries}`);
            setTimeout(() => attempt(remainingRetries - 1), delay); // Retry after the specified delay
            onRetry(count);
          } else {
            reject(error); // If no retries left, reject the promise
          }
        });
    }

    attempt(retries); // Start the first attempt
  });
}
