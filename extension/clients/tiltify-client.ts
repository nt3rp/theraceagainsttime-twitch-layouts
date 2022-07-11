import { TiltifyClient } from "tiltify-api-client";
import type { CampaignClass } from "tiltify-api-client";

export interface CampaignClientArgs {
  accessToken: string;
  campaignId: string;
  options?: {
    frequency: number;
  };
}

export class CampaignClient {
  private client: TiltifyClient;
  private frequency: number;
  private campaignId: string;

  constructor({ accessToken, campaignId, options }: CampaignClientArgs) {
    this.campaignId = campaignId;
    this.frequency = options?.frequency || 5_000;
    this.client = new TiltifyClient(accessToken);
  }

  public on(
    method: keyof CampaignClass,
    handler: Function,
    frequency?: number
  ): void {
    let func;
    switch (method) {
      case "getMilestones" as keyof CampaignClass:
        func = () =>
          this.client.Campaigns._sendRequest(
            `campaigns/${this.campaignId}/milestones`,
            handler
          );
        break;
      case "getCampaign" as keyof CampaignClass:
        func = () => this.client.Campaigns.get(this.campaignId, handler);
        break;
      default:
        func = () => this.client.Campaigns[method](this.campaignId, handler);
        break;
    }

    setInterval(func, frequency || this.frequency);
  }
}
