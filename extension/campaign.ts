import { replicate } from "./utils";

import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type { CampaignClass, Campaign } from "tiltify-api-client";
import type { CampaignClient } from "./clients/tiltify-client";

export default (nodecg: NodeCG, client: CampaignClient) => {
  nodecg.log.info("⬆ Starting Campaign client...");
  const campaign: Replicant<Campaign | {}> = nodecg.Replicant("campaign", {
    defaultValue: {},
  });

  client.on("getCampaign" as keyof CampaignClass, replicate(campaign));
};
