"use strict";

const tiltify = require("./tiltify");
const achievements = require("./achievements");

module.exports = (nodecg) => {
  tiltify(nodecg);
  achievements(nodecg);
};
