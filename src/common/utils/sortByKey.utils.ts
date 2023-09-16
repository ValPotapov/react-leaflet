function sortByKey<T>(key: keyof T) {
  return function (a: T, b: T) {
    if (a[key] < b[key]) {
      return -1;
    }
    if (a[key] > b[key]) {
      return 1;
    }
    return 0;
  };
}

export { sortByKey };
