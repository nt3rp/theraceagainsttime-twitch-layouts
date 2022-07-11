import { replicateWithProperties } from "./utils";

import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type { CampaignClient } from "./clients/tiltify-client";

export default (nodecg: NodeCG, client: CampaignClient) => {
  const donations: Replicant<any> = nodecg.Replicant("donations", {
    defaultValue: [],
  });

  client.on(
    "getDonations",
    replicateWithProperties(donations, ["shown", "read"])
  );
};
