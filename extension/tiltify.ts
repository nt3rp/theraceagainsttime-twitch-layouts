import * as TiltifyClient from "tiltify-api-client";

import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type { Poll } from "../@types/tiltify";

import { replicate, replicateWithProperties } from "./utils.js";
import * as tiltifyData from "../config/tiltify.json";
const { accessToken, campaignId }: any = tiltifyData;

const POLLING_FREQUENCY_IN_MS = 5_000;

// This entire method is unnecessary but I didn't want to change the API
// that was provided and I couldn't figure out a better way to curry
// the arguments.
const CampaignClient = ({
  accessToken,
  campaignId,
}: {
  accessToken: string;
  campaignId: string;
}) => {
  const client: any = new TiltifyClient(accessToken);
  const newClient: any = [
    "get",
    "getChallenges",
    "getDonations",
    "getRecentDonations",
    "getPolls",
    "getRewards",
    "getSchedule",
    "getSupportingCampaigns",
  ].reduce(
    (acc, method) => ({
      ...acc,
      [method]: (func: any) => client.Campaigns[method](campaignId, func),
    }),
    {}
  );

  // This is not listed in the docs, but is available:
  // https://github.com/Tiltify/api/issues/20
  newClient.getMilestones = (func: any) =>
    client.Campaigns._sendRequest(`campaigns/${campaignId}/milestones`, func);

  return newClient;
};

export default (nodecg: NodeCG) => {
  nodecg.log.info("Starting Tiltify client...");

  const pollsRep: Replicant<Array<Poll>> = nodecg.Replicant("polls", {
    defaultValue: [],
  });
  const milestonesRep = nodecg.Replicant("milestones", { defaultValue: [] });
  const campaignRep = nodecg.Replicant("campaign", { defaultValue: {} });
  const donationsRep: Replicant<any> = nodecg.Replicant("donations", {
    defaultValue: [],
  });
  const targetsRep = nodecg.Replicant("targets", { defaultValue: [] });

  // TODO: Make the events that you want to listen to configurable.
  const campaign = CampaignClient({ accessToken, campaignId });

  const fetchMilestones = async () =>
    campaign.getMilestones(replicate(milestonesRep));
  const fetchPolls = async () =>
    campaign.getPolls(replicateWithProperties(pollsRep, ["visible"]));
  const fetchDonations = async () =>
    campaign.getDonations(
      replicateWithProperties(donationsRep, ["shown", "read"])
    );
  const fetchTargets = async () =>
    campaign.getChallenges(replicateWithProperties(targetsRep, ["completed"]));
  // Has original goal, funds raised, and current goal.
  const fetchCampaign = async () => campaign.get(replicate(campaignRep));

  const fetchData = () => {
    fetchDonations();
    fetchPolls();
    fetchCampaign();
    fetchMilestones();
    fetchTargets();
  };

  // TODO: Make polling frequency configurable by method.
  setInterval(fetchData, POLLING_FREQUENCY_IN_MS);
  fetchData();

  const toastDonation = (donation: any) => {
    const { amount, name, comment } = donation;
    const message = {
      title: `${name} donated $${amount}!`,
      description: comment ? `\u201c${comment}\u201d` : "",
      sound: "donation",
    };
    nodecg.sendMessage("event", message);
    donation.shown = true;
  };

  // Toast anything that was missed.
  donationsRep.value
    .filter((d: any) => d.shown !== true)
    .forEach(toastDonation);

  // Toast new changes.
  donationsRep.on("change", (donations) => {
    donations.filter((d: any) => d.shown !== true).forEach(toastDonation);
  });
};
