"use strict";

const TiltifyClient = require("tiltify-api-client");
const { accessToken, campaignId } = require("../config/tiltify.json");

module.exports = (nodecg) => {
  nodecg.log.info("Starting Tiltify client...");

  const client = new TiltifyClient(accessToken);

  client.Campaigns.getRecentDonations(campaignId, (donations) => {
    nodecg.log.info(donations);
  });
};
