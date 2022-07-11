declare module "tiltify-api-client" {
  export class Campaign {
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
    Campaigns: Campaign;
  }
}
