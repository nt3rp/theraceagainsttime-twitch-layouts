import { NodeCG, Replicant } from "nodecg-types/types/server";
const ACHIEVEMENTS = require("../config/achievements.json");

export interface Achievement {
  id: string;
  title: string;
  description: string;
  tags: Array<string>;
  secretDescription?: string;
  achieved?: boolean;
  achievedAt?: Date;
}

export default (nodecg: NodeCG) => {
  // TODO: Assign to variable, etc.
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
    // TODO: add 'type'
    nodecg.sendMessage("event", achievement);
  });
};
