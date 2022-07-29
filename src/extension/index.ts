import * as path from "path";
import setupTiltify from "./clients/tiltify-client";
import { TwitchClient } from "./clients/twitch-client";
import bot from "./bot";
// import secrets from "./secrets";

import type { NodeCG } from "nodecg-types/types/server";

import * as TILTIFY_CONFIG from "../../config/tiltify.json";

// Inject any dependencies manually.
export default async (nodecg: NodeCG) => {
  // Set up dependencies
  const twitchClient = await TwitchClient.create(
    path.join(__dirname, "../../config/twitch.json")
  );

  setupTiltify(nodecg, TILTIFY_CONFIG);

  bot(nodecg, twitchClient);
  // secrets(nodecg, twitchClient);
};
