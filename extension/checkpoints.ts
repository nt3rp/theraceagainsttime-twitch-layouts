import { NodeCG, Replicant } from "nodecg-types/types/server";

export interface Completeable {
  onComplete: (id: string, event: any) => void;
}

export interface Changeable {
  onChange: (id: string, event: any) => void;
}

export interface Checkpoint {
  id: string;
  title: string;
  splits: Array<number>;
  completed: boolean;
  endingId?: string;
  previousYear: number;
  previousBest: number;
  thisYear?: number;
}

export interface Timer {
  splits: Array<number>;
  checkpoint: string | undefined;
  state: "paused" | "playing"; // TODO: Change to boolean 'paused'
}

const CHECKPOINTS = require("../config/checkpoints.json").map((checkpoint) => ({
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
