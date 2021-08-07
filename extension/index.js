"use strict";

const tiltify = require("./tiltify");
const achievements = require("./achievements");
const events = require("./events");

module.exports = (nodecg) => {
  tiltify(nodecg);
  achievements(nodecg);
  events(nodecg);
};
