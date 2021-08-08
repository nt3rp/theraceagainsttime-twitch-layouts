"use strict";

const tiltify = require("./tiltify");
const achievements = require("./achievements");
const checkpoints = require("./checkpoints");
const events = require("./events");

module.exports = (nodecg) => {
  tiltify(nodecg);
  achievements(nodecg);
  checkpoints(nodecg);
  events(nodecg);
};
