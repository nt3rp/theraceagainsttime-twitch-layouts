import * as path from "path";
import setupTiltify from "./clients/tiltify-client";
import setupTwitch from "./clients/twitch-client";
import secrets from "./secrets";
import credits from "./credits";
import giveaways from "./giveaways";
import ladder from "./ladder";
import guests from "./guests";
import eventstream from "./eventstream";
import donations from "./donations";
import clip from "./clip";
import checkpoints from "./checkpoints";
import menu from "./menu";
import web from "./web";

import type { NodeCG } from "nodecg-types/types/server";

import * as TILTIFY_CONFIG from "../../config/tiltify.json";

// Inject any dependencies manually.
export default async (nodecg: NodeCG) => {
  // Set up dependencies
  setupTiltify(nodecg, TILTIFY_CONFIG);
  const twitchClient = await setupTwitch(
    nodecg,
    path.join(__dirname, "../../config/twitch.json")
  );

  checkpoints(nodecg, twitchClient);
  secrets(nodecg, twitchClient);
  credits(nodecg, twitchClient);
  eventstream(nodecg, twitchClient);
  giveaways(nodecg, twitchClient);
  ladder(nodecg, twitchClient);
  guests(nodecg, twitchClient);
  donations(nodecg, twitchClient);
  clip(nodecg, twitchClient);
  menu(nodecg, twitchClient);
  web(nodecg);
};
