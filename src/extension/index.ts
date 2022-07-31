import * as path from "path";
import setupTiltify from "./clients/tiltify-client";
import setupTwitch from "./clients/twitch-client";
import secrets from "./secrets";
import credits from "./credits";
import giveaways from "./giveaways";
import ladder from "./ladder";

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

  secrets(nodecg, twitchClient);
  credits(nodecg, twitchClient);
  giveaways(nodecg, twitchClient);
  ladder(nodecg, twitchClient);
};
