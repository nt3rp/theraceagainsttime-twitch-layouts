// Move this into src, then have parcel generate extensions. MUCH easier, can also moves types

import * as path from "path";
import { CampaignClient } from "./clients/tiltify-client";
import { TwitchClient } from "./clients/twitch-client";
import milestones from "./milestones";
import donations from "./donations";
import campaign from "./campaign";
import bot from "./bot";
// import secrets from "./secrets";

import type { NodeCG } from "nodecg-types/types/server";
import type { CampaignClientArgs } from "./clients/tiltify-client";

import * as TILTIFY_CONFIG from "../../config/tiltify.json";

// Inject any dependencies manually.
export default async (nodecg: NodeCG) => {
  // Set up dependencies
  const campaignClient = new CampaignClient(
    TILTIFY_CONFIG as CampaignClientArgs
  );
  const twitchClient = await TwitchClient.create(
    path.join(__dirname, "../../config/twitch.json")
  );

  milestones(nodecg, campaignClient);
  donations(nodecg, campaignClient);
  campaign(nodecg, campaignClient);
  bot(nodecg, twitchClient);
  // secrets(nodecg, twitchClient);
};
