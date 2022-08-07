import { promises as fs } from "fs";
import * as path from "path";
import { toCsv } from "./utils";

import type { NodeCG } from "nodecg-types/types/server";
import type { DonationEvent } from "../types/events";
import type { TwitchClient } from "./clients/twitch-client";

// eslint-disable-next-line no-unused-vars
export default (nodecg: NodeCG, twitch: TwitchClient) => {
  nodecg.log.info("⬆ Setting up 'donations' extension...");

  const donationLog = path.join(__dirname, `../../logs/donations.csv`);

  nodecg.listenFor(
    "donation",
    ({ name, amount, comment, completedAt }: DonationEvent) => {
      fs.appendFile(donationLog, toCsv(completedAt, amount, name, comment));
      nodecg.sendMessage("stream-event", {
        when: completedAt,
        type: "donation",
        title: `${name} donated ${amount}`,
        description: `${comment || "No message"}`,
      });
    }
  );
};
