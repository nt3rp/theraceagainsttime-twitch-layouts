import { diff } from "./utils";

import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type { TwitchClient } from "./clients/twitch-client";
import type { Checkpoint, Timer } from "../types/events";

import * as CHECKPOINTS from "../../config/checkpoints.json";

// eslint-disable-next-line no-unused-vars
export default (nodecg: NodeCG, twitchClient: TwitchClient) => {
  nodecg.log.info("⬆ Setting up 'checkpoints' extension...");

  const remappedCheckpoints = CHECKPOINTS.map((checkpoint: any) => ({
    ...checkpoint,
    splits: [],
    completed: false,
  }));

  const checkpoints: Replicant<Array<Checkpoint>> = nodecg.Replicant(
    "checkpoints",
    { defaultValue: remappedCheckpoints }
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
    if (oldCheckpoints === undefined || newCheckpoints === undefined) return;
    const newValues = diff(
      newCheckpoints,
      oldCheckpoints,
      (a: Checkpoint, b: Checkpoint) =>
        a.completed === b.completed && a.id === b.id
    );
    newValues.forEach((checkpoint) =>
      nodecg.sendMessage("checkpoint", checkpoint)
    );
  });
};
