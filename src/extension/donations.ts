import { diff, replicateCollectionWithProperties } from "./utils";

import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type { CampaignClient } from "./clients/tiltify-client";

export default (nodecg: NodeCG, client: CampaignClient) => {
  nodecg.log.info("⬆ Starting Donation client...");

  const donations: Replicant<Array<object>> = nodecg.Replicant("donations", {
    defaultValue: [],
  });

  client.on(
    "getDonations",
    replicateCollectionWithProperties(donations, ["shown", "read"])
  );

  donations.on("change", (newValue, oldValue) => {
    // Not sure of performance implications of this.
    const newValues = diff(newValue, oldValue);
    newValues.forEach((donation) => nodecg.sendMessage("donation", donation));
  });
};
