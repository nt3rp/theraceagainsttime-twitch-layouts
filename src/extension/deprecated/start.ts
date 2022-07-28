import type { NodeCG, Replicant } from "nodecg-types/types/server";

export default (nodecg: NodeCG) => {
  // eslint-disable-next-line no-unused-vars
  const start: Replicant<boolean> = nodecg.Replicant("start", {
    defaultValue: false,
  });
};
