import { diff } from "./utils";

import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type { TwitchClient } from "./clients/twitch-client";
import type { Checkpoint, Timer } from "../types/events";

import * as CHECKPOINTS from "../../config/checkpoints.json";
import { copy } from "../utils";

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

  nodecg.listenFor("timer.pause", () => {
    const now = Date.now();
    const currentIndex = checkpoints.value.findIndex(
      (c: Checkpoint) => c.id === timer.value.checkpoint
    );
    const localTimer = copy(timer.value);

    timer.value = {
      ...localTimer,
      splits: [...localTimer.splits, now],
      state: localTimer.state === "paused" ? "playing" : "paused",
    };

    checkpoints.value[currentIndex].splits.push(now);
  });

  nodecg.listenFor("timer.advance", () => {
    const now = Date.now();
    const currentIndex = checkpoints.value.findIndex(
      (c: Checkpoint) => c.id === timer.value.checkpoint
    );
    const nextCheckpoint =
      currentIndex + 1 <= checkpoints.value.length - 1
        ? checkpoints.value[currentIndex + 1]
        : undefined;
    const splits = currentIndex === -1 ? [now] : [now, now];
    const localTimer = copy(timer.value);

    timer.value = {
      ...localTimer,
      splits: [...localTimer.splits, ...splits],
      state: "playing",
      checkpoint: nextCheckpoint?.id,
    };

    if (currentIndex <= -1) {
      checkpoints.value[0].splits.push(now);
    } else {
      checkpoints.value[currentIndex].splits.push(now);
      if (nextCheckpoint !== undefined)
        checkpoints.value[currentIndex + 1].splits.push(now);
      checkpoints.value[currentIndex].completed = true;
    }
  });
};
