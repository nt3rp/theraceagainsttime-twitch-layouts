import { replicate } from "./utils";

import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type { CampaignClient } from "./clients/tiltify-client";

export default (nodecg: NodeCG, client: CampaignClient) => {
  nodecg.log.info("⬆ Starting Campaign client...");
  const campaign: Replicant<object> = nodecg.Replicant("campaign", {
    defaultValue: {},
  });

  client.on("getCampaign", replicate(campaign));
};
