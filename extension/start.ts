import { NodeCG, Replicant } from "nodecg-types/types/server";

export default (nodecg: NodeCG) => {
  const start: Replicant<boolean> = nodecg.Replicant("start", {
    defaultValue: false,
  });
};
