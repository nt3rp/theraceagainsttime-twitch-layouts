"use strict";

const TiltifyClient = require("tiltify-api-client");
const { replicate, replicateWithProperties } = require("./utils.js");
const { accessToken, campaignId } = require("../config/tiltify.json");

const POLLING_FREQUENCY_IN_MS = 5_000;

// This entire method is unnecessary but I didn't want to change the API
// that was provided and I couldn't figure out a better way to curry
// the arguments.
const CampaignClient = ({ accessToken, campaignId }) => {
  const client = new TiltifyClient(accessToken);
  const newClient = [
    "get",
    "getChallenges",
    "getDonations",
    "getRecentDonations",
    "getPolls",
    "getRewards",
    "getSchedule",
    "getSupportingCampaigns",
  ].reduce(
    (obj, method) => ({
      ...obj,
      [method]: (func) => client.Campaigns[method](campaignId, func),
    }),
    {}
  );

  // This is not listed in the docs, but is available:
  // https://github.com/Tiltify/api/issues/20
  newClient.getMilestones = (func) =>
    client.Campaigns._sendRequest(`campaigns/${campaignId}/milestones`, func);

  return newClient;
};

module.exports = (nodecg) => {
  nodecg.log.info("Starting Tiltify client...");

  const pollsRep = nodecg.Replicant("polls", { defaultValue: [] });
  const milestonesRep = nodecg.Replicant("milestones", { defaultValue: [] });
  const campaignRep = nodecg.Replicant("campaign", { defaultValue: {} });
  const donationsRep = nodecg.Replicant("donations", { defaultValue: [] });
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
};
