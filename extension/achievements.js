const ACHIEVEMENTS = require("../config/achievements.json");

module.exports = (nodecg) => {
  // TODO: Assign to variable, etc.
  nodecg.log.info("Starting achievements client...");
  nodecg.Replicant("achievements", {
    defaultValue: ACHIEVEMENTS,
  });

  nodecg.listenFor("checkpoint", () => {
    nodecg.info("Achievements: Checkpoint reached");
  });
};
