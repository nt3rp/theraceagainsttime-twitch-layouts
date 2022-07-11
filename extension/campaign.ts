import { replicate } from "./utils";

import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type { Campaign } from "tiltify-api-client";
import type { CampaignClient } from "./clients/tiltify-client";

export default (nodecg: NodeCG, client: CampaignClient) => {
  nodecg.log.info("⬆ Starting Campaign client...");
  const campaign: Replicant<any> = nodecg.Replicant("campaign", {
    defaultValue: [],
  });

  client.on("getCampaign" as keyof Campaign, replicate(campaign));
};
