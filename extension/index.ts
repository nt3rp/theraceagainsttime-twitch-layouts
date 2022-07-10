import { NodeCG } from "nodecg-types/types/server";

export default (nodecg: NodeCG) => {
  [
    "achievements",
    "checkpoints",
    "events",
    "guests",
    "tiltify",
    "chatbot",
  ].forEach((module) => require(`./${module}`)(nodecg));
};
