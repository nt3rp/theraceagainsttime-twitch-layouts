const ACHIEVEMENTS = require("../config/achievements.json");

module.exports = (nodecg) => {
  // TODO: Assign to variable, etc.
  nodecg.log.info("Starting achievements client...");
  const achievements = nodecg.Replicant("achievements", {
    defaultValue: ACHIEVEMENTS,
  });

  nodecg.listenFor("checkpoint", ({ id, endingId }) => {
    // TODO: When checkpoints are reached, complete the associated achievement.
    // Look up the achievement by checkpoint.id;
    // if not found, use checkpoint.endingId

    // Note: `achievement` is a reference to the entry in the replicant.
    // Modifying it here modifies it in the replicant.
    const achievement = achievements.find(
      (a) => id === a.id || endingId === a.id
    );
    if (!achievement || achievement.achievedAt) return;
    achievement.achievedAt = Date.now();
    achievement.achieved = true;
    nodecg.sendMessage("event", achievement);
  });
};
