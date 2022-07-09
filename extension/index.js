"use strict";

const achievements = require("./achievements");
const checkpoints = require("./checkpoints");
const events = require("./events");
const guests = require("./guests");
const tiltify = require("./tiltify");
const chatbot = require("./chatbot");

module.exports = (nodecg) => {
  achievements(nodecg);
  checkpoints(nodecg);
  events(nodecg);
  guests(nodecg);
  tiltify(nodecg);
  chatbot(nodecg);
};
