function reverseObjectKeys<T>(obj: Record<string, T>): Record<string, T> {
  const reversedKeys = Object.keys(obj).reverse();

  const result: Record<string, T> = {};

  reversedKeys.forEach((key) => {
    result[key] = obj[key];
  });

  return result;
}
export { reverseObjectKeys };
