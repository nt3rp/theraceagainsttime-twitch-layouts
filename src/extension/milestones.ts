import { replicate } from "./utils";

import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type { CampaignClient } from "./clients/tiltify-client";

export default (nodecg: NodeCG, client: CampaignClient) => {
  nodecg.log.info("⬆ Starting Milestone client...");
  const milestones: Replicant<Array<object>> = nodecg.Replicant(
    "milestones",
    {
      defaultValue: [],
    }
  );

  client.on("getMilestones", replicate(milestones));
};
