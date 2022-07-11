import { Replicant } from "nodecg-types/types/server";

// https://www.30secondsofcode.org/js/s/pick
/* eslint-disable no-sequences */
export const pick = (obj: any, arr: any) =>
  arr.reduce(
    (acc: any, curr: any) => (curr in obj && (acc[curr] = obj[curr]), acc),
    {}
  );
/* eslint-enable no-sequences */

// Only works for collections (i.e. `[{obj}}`)
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

export const diff = (a: Array<any>, b: Array<any> | undefined) =>
  !b ? a : a.filter((x) => !b.includes(x));

const operators = {
  "==": (a: any, b: any) => a === b,
  ">=": (a: any, b: any) => a >= b,
};
export const compare = (operator: string, a: any, b: any): boolean =>
  (operators as any)[operator](a, b);
