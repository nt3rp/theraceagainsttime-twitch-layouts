// https://www.30secondsofcode.org/js/s/pick
/* eslint-disable no-sequences */
const pick = (obj, arr) =>
  arr.reduce((acc, curr) => (curr in obj && (acc[curr] = obj[curr]), acc), {});
/* eslint-enable no-sequences */

// Only works for collections (i.e. `[{obj}}`)
const replicateWithProperties = (replicant, properties) => {
  return (newValues) => {
    replicant.value = newValues.map((value) => {
      const found = replicant.value.find((e) => e.id === value.id);
      if (found === undefined) {
        return value;
      }
      return { ...found, ...pick(value, properties) };
    });
  };
};

const replicate = (replicant) => {
  return (value) => {
    if (JSON.stringify(replicant.value) !== JSON.stringify(value)) {
      replicant.value = value;
    }
  };
};

export { pick, replicate, replicateWithProperties };
