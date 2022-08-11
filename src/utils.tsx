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
export const toHms = (timeInMs: number | undefined) =>
  timeInMs ? new Date(timeInMs).toISOString().substr(11, 8) : undefined;

export const percent = (numerator: number, denominator: number): number => {
  if (denominator === 0) return 0;
  return Math.max(Math.min((numerator * 100) / denominator, 100), 0);
};

export const clamp = (num: number, min: number, max: number) => {
  return Math.min(Math.max(num, min), max);
};
