import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type { Achievement } from "../@types/replicants";

import * as ACHIEVEMENTS from "../config/achievements.json";

export default (nodecg: NodeCG) => {
  nodecg.log.info("Starting achievements client...");
  const achievements: Replicant<Array<Achievement>> = nodecg.Replicant(
    "achievements",
    {
      defaultValue: ACHIEVEMENTS,
    }
  );

  nodecg.listenFor("checkpoint", ({ id, endingId }) => {
    // Note: `achievement` is a reference to the entry in the replicant.
    // Modifying it here modifies it in the replicant.
    const achievement = achievements.value.find(
      (a) => id === a.id || endingId === a.id
    );
    if (!achievement || achievement.achievedAt) return;
    achievement.achievedAt = new Date();
    achievement.achieved = true;
    nodecg.sendMessage("event", achievement);
  });
};
