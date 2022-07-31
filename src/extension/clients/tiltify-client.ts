import { diff, replicate } from "../utils";

import type { NodeCG, Replicant } from "nodecg-types/types/server";
import { DonationEvent } from "../../types/events";

const TiltifyClient = require("tiltify-api-client");

export interface CampaignClientArgs {
  accessToken: string;
  campaignId: string;
  options?: {
    frequency: number;
  };
}

export class CampaignClient {
  private client: any;
  private frequency: number;
  private campaignId: string;

  constructor({ accessToken, campaignId, options }: CampaignClientArgs) {
    this.campaignId = campaignId;
    this.frequency = options?.frequency || 5_000;
    this.client = new TiltifyClient(accessToken);
  }

  public on(method: string, handler: Function, frequency?: number): void {
    let func;
    switch (method) {
      case "getMilestones":
        func = () =>
          this.client.Campaigns._sendRequest(
            `campaigns/${this.campaignId}/milestones`,
            handler
          );
        break;
      case "getCampaign":
        func = () => this.client.Campaigns.get(this.campaignId, handler);
        break;
      default:
        func = () => this.client.Campaigns[method](this.campaignId, handler);
        break;
    }

    setInterval(func, frequency || this.frequency);
  }
}

const setupDonations = (nodecg: NodeCG, client: CampaignClient) => {
  nodecg.log.info("⬆ Listening for donations...");

  const donations: Replicant<Array<DonationEvent>> = nodecg.Replicant(
    "donations",
    {
      defaultValue: [],
    }
  );

  client.on("getDonations", replicate(donations));

  donations.on("change", (newValue, oldValue) => {
    // Not sure of performance implications of this.
    // What do we want to use as the diff function here?
    const newValues = diff(
      newValue,
      oldValue,
      (a: DonationEvent, b: DonationEvent) => a.id === b.id
    );
    newValues.forEach((donation) => nodecg.sendMessage("donation", donation));
  });
};

const setupCampaign = (nodecg: NodeCG, client: CampaignClient) => {
  nodecg.log.info("⬆ Listening for campaign changes...");
  const campaign: Replicant<object> = nodecg.Replicant("campaign", {
    defaultValue: {},
  });

  client.on("getCampaign", replicate(campaign));

  campaign.on("change", (newValue, oldValue) => {
    // Don't fire an event when we're starting up or have no data.
    if (!oldValue || !newValue) return;
    nodecg.sendMessage("donation.total", (newValue as any).totalAmountRaised);
  });
};

const setupMilestones = (nodecg: NodeCG, client: CampaignClient) => {
  nodecg.log.info("⬆ Listening for milestone changes...");
  const milestones: Replicant<Array<object>> = nodecg.Replicant("milestones", {
    defaultValue: [],
  });

  client.on("getMilestones", replicate(milestones));

  // TODO: Are there events we need to set up here?
};

// Setup Tiltify.
export default (nodecg: NodeCG, config: CampaignClientArgs) => {
  nodecg.log.info("⬆ Setting up Tiltify client...");
  const client = new CampaignClient(config);
  [setupDonations, setupCampaign, setupMilestones].forEach((method) =>
    method(nodecg, client)
  );

  return client;
};
