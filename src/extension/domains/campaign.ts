import { replicate } from "../utils";

import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type { CampaignClient } from "../clients/tiltify-client";

export default (nodecg: NodeCG, client: CampaignClient) => {
  nodecg.log.info("⬆ Starting Campaign client...");
  const campaign: Replicant<object> = nodecg.Replicant("campaign", {
    defaultValue: {},
  });

  client.on("getCampaign", replicate(campaign));

  campaign.on("change", (newValue, oldValue) => {
    // Don't fire an event when we're starting up or have no data.
    if (!oldValue || !newValue) return;
    nodecg.sendMessage("campaign.total", (newValue as any).totalAmountRaised);
  });
};
