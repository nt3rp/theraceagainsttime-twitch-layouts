import { CampaignClient } from "./clients/tiltify-client";
import milestones from "./milestones";
import donations from "./donations";
import campaign from "./campaign";

import type { NodeCG } from "nodecg-types/types/server";
import type { CampaignClientArgs } from "./clients/tiltify-client";

import * as TILTIFY_CONFIG from "../config/tiltify.json";
import secrets from "./secrets";

// Inject any dependencies manually.
export default async (nodecg: NodeCG) => {
  // Set up dependencies
  // TODO: How to avoid casting here?
  const campaignClient = new CampaignClient(
    TILTIFY_CONFIG as CampaignClientArgs
  );

  milestones(nodecg, campaignClient);
  donations(nodecg, campaignClient);
  campaign(nodecg, campaignClient);
  secrets(nodecg);
};
