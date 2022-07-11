import { replicateCollectionWithProperties } from "./utils";

import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type { Donation } from "tiltify-api-client";
import type { CampaignClient } from "./clients/tiltify-client";

export default (nodecg: NodeCG, client: CampaignClient) => {
  const donations: Replicant<Array<Donation>> = nodecg.Replicant("donations", {
    defaultValue: [],
  });

  client.on(
    "getDonations",
    replicateCollectionWithProperties(donations, ["shown", "read"])
  );
};
