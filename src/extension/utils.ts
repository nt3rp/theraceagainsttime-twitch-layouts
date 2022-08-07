import * as os from "os";
import type { Replicant } from "nodecg-types/types/server";

// https://www.30secondsofcode.org/js/s/pick
/* eslint-disable no-sequences */
export const pick = (obj: any, arr: any) =>
  arr.reduce(
    (acc: any, curr: any) => (curr in obj && (acc[curr] = obj[curr]), acc),
    {}
  );
/* eslint-enable no-sequences */

// Only works for collections (i.e. `[{obj}]`)
export const replicateCollectionWithProperties = (
  replicant: Replicant<any>,
  propertiesList: Array<string>
) => {
  return (newValues: any) => {
    replicant.value = newValues.map((value: any) => {
      const found = replicant.value.find((e: any) => e.id === value.id);
      if (found === undefined) {
        return value;
      }
      return { ...found, ...pick(value, propertiesList) };
    });
  };
};

export const replicate = (replicant: Replicant<any>) => {
  return (newValue: any) => {
    if (JSON.stringify(replicant.value) !== JSON.stringify(newValue)) {
      replicant.value = newValue;
    }
  };
};

// eslint-disable-next-line no-unused-vars
export type EqualityComparator<T> = (a: T, b: T) => boolean;

// Not sure of performance implications of this.
export const diff = <T>(
  arr: Array<T>,
  old: Array<T> | undefined,
  compareFn: EqualityComparator<T> = (a, b) => a === b
): Array<T> => {
  if (!old) return arr;

  return arr.filter((newEl) => !old.some((oldEl) => compareFn(newEl, oldEl)));
};
const operators = {
  "==": (a: any, b: any) => a === b,
  ">=": (a: any, b: any) => a >= b,
  regexp: (a: string, b: RegExp) => b.test(a),
};
export const compare = (operator: string, a: any, b: any): boolean =>
  (operators as any)[operator](a, b);

// https://www.30secondsofcode.org/js/s/sample
export const sample = <T>(arr: Array<T>) =>
  arr[Math.floor(Math.random() * arr.length)];

// https://www.30secondsofcode.org/js/s/shuffle
export const shuffle = <T>([...arr]: Array<T>) => {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr;
};

export const toCsv = (...arr: Array<any>) =>
  arr.map((e) => `"${e}"`).join(",") + os.EOL;
