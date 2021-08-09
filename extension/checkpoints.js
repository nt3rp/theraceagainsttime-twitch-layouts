const CHECKPOINTS = require("../config/checkpoints.json").map((checkpoint) => ({
  ...checkpoint,
  splits: [],
  completed: false,
}));

module.exports = (nodecg) => {
  nodecg.log.info("Starting checkpoints client...");

  const checkpoints = nodecg.Replicant("checkpoints", {
    defaultValue: CHECKPOINTS,
  });

  nodecg.Replicant("timer", {
    defaultValue: {
      state: "paused",
      splits: [],
      checkpoint: undefined,
    },
  });

  checkpoints.on("change", (newCheckpoints, oldCheckpoints) => {
    if (oldCheckpoints === undefined) return;

    // Assumption: Both checkpoints are the same length.
    for (const [index, checkpoint] of Object.entries(newCheckpoints)) {
      const oldCheckpoint = oldCheckpoints[index];
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
