declare module "tiltify-api-client" {
  // TODO: Somehow get these types onto the appropriate functions below.
  export interface Campaign {
    name: string;
    slug: string;
    url: string;
    description: string;
    avatar: {
      src: string;
      width: number;
      height: number;
    };
    fundraiserGoalAmount: number;
    originalGoalAmount: number;
    amountRaised: number;
    supportingAmountRaised: number;
    totalAmountRaised: number;
    [otherKey: string]: any;
  }

  export interface Donation {
    id: number;
    amount: number;
    name: string;
    comment: string;
    completedAt: number;
    rewardId: number;
  }

  export interface Milestone {
    id: number;
    name: string;
    amount: number;
    campaignId: number;
    createdAt: number;
  }

  export class CampaignClass {
    get: Function;
    getChallenges: Function;
    getDonations: Function;
    getRecentDonations: Function;
    getPolls: Function;
    getRewards: Function;
    getSchedule: Function;
    getSupportingCampaigns: Function;
    _sendRequest: Function;
  }

  export class TiltifyClient {
    // eslint-disable-next-line no-unused-vars
    constructor(accessToken: string);
    Campaigns: CampaignClass;
  }
}
