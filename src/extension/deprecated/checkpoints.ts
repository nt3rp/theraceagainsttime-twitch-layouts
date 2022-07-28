import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type { Timer, Checkpoint } from "../../types/events";

import * as checkpoints from "../../../config/checkpoints.json";

const CHECKPOINTS = checkpoints.map((checkpoint: Checkpoint) => ({
  ...checkpoint,
  splits: [],
  completed: false,
}));

export default (nodecg: NodeCG) => {
  nodecg.log.info("Starting checkpoints client...");

  const checkpoints: Replicant<Array<Checkpoint>> = nodecg.Replicant(
    "checkpoints",
    {
      defaultValue: CHECKPOINTS,
    }
  );

  // eslint-disable-next-line no-unused-vars
  const timer: Replicant<Timer> = nodecg.Replicant("timer", {
    defaultValue: {
      state: "paused",
      splits: [],
      checkpoint: undefined,
    },
  });

  checkpoints.on("change", (newCheckpoints, oldCheckpoints) => {
    if (oldCheckpoints === undefined) return;

    // Assumption: Both checkpoints are the same length.
    for (const entries of Object.entries(newCheckpoints)) {
      const [index, checkpoint]: [string, any] = entries;
      const oldCheckpoint = oldCheckpoints[parseInt(index)];
      // TODO: Remove this check; might not be necessary.
      if (checkpoint.index !== oldCheckpoint.index) {
        nodecg.log.info("values don't match!");
        continue;
      } else if (!checkpoint.completed || oldCheckpoint.completed) {
        continue;
      }
      nodecg.sendMessage("checkpoint", checkpoint);
    }
  });
};
