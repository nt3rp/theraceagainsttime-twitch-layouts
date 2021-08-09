export const copy = (obj: any) => JSON.parse(JSON.stringify(obj));

export const calculateSplits = (splits: Array<number>): number | undefined => {
  if (splits.length <= 0) return 0;
  if (splits.length % 2 !== 0) return undefined;
  return splits.reduce((sum, current, index, array) => {
    if (index % 2 === 1) {
      const start = array[index - 1];
      const end = array[index];
      return sum + (end - start);
    }
    return sum;
  }, 0);
};

// https://stackoverflow.com/a/1322771/165988
export const toHms = (timeInMs: number) =>
  new Date(timeInMs).toISOString().substr(11, 8);
