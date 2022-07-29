import { compare } from "./utils";

import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type { TwitchClient } from "./clients/twitch-client";

import * as secrets from "../../config/secrets.json";
const SECRETS = secrets.map((secret) => {
  if (secret.criteria.comparator !== "regexp") {
    return secret;
  }
  return {
    ...secret,
    criteria: {
      ...secret.criteria,
      value: new RegExp(secret.criteria.value as string, "i"),
    },
  };
});

/*
SECRETS

Chat
- 1st: 10 folks in chat
- 1st: 20 folks in chat
- 1st: 30 folks in chat
- 1st: 40 folks in chat
- 1st: Raid
- 1st: 10 person raid
- 1st: 20 person raid
- 1st: 42 bits
- 1st: 69 bits
- 1st: 420 bits
- (Prometheus Circuit / Robo related?)
- (Starfox reference)
- (Hifumi / Danganronpa / ZE)
- (BABY -> Jay)
- (Buns)
- (Robo is best boi)
- (Berzerkayla?)
- (Umaro)

Game (manual buttons)
- Beat Frog Spekkio
- Beat Dragon Tank 1st time
- Beat Golem
- Save Fritz
- Not Guilty
- Boss skip
- Ozzie no fall
- Boss overflow kill

... Look at some of the previous achievements

... then reveal secret in dashboard?

// Multiple secrets completed unlocks a secret?
Shenanigans: Someone mentioned shenanigans
Emulator: someone askes aboout how we're running
Beta: SOMEONE mentions Beta
Generous: Someone gifts a sub to one of the crew
Extra generous: Someone gifts a sub to robo.
*/
export interface Secret {
  name: string;
  description?: string;
  completedAt?: Date;
  subject: "donation" | "total-raised" | "chat" | "subscriptions";
  criteria: {
    comparator: "==" | ">=" | "regexp";
    value: any;
    response?: string;
  };
}

const maybeMeetCriteria = (
  subject: string,
  criteria: any,
  secrets: Replicant<Array<Secret>>,
  nodecg: NodeCG
) => {
  const unmetCriteria = secrets.value.filter(
    ({ completedAt, subject: s }) => !completedAt && s === subject
  );

  unmetCriteria.forEach((s) => {
    const { name, criteria: c } = s;
    const { comparator, value: threshold } = c;
    if (compare(comparator, criteria, threshold)) {
      secrets.value.find((secret) => {
        if (name !== secret.name) return false;
        secret.completedAt = new Date();
        nodecg.sendMessage("secret", secret);
        return true;
      });
    }
  });
};

// eslint-disable-next-line no-unused-vars
export default (nodecg: NodeCG, twitch: TwitchClient) => {
  nodecg.log.info("⬆ Starting Secrets extension...");
  const secrets: Replicant<Array<Secret>> = nodecg.Replicant("secrets", {
    defaultValue: SECRETS as Array<Secret>,
  });

  nodecg.listenFor("donation", (donation) =>
    maybeMeetCriteria("donation", donation.amount, secrets, nodecg)
  );

  nodecg.listenFor("campaign.total", (total) =>
    maybeMeetCriteria("donation", total, secrets, nodecg)
  );

  // eslint-disable-next-line no-unused-vars
  nodecg.listenFor("chat", ({ channel, user, message }) => {
    maybeMeetCriteria("chat", message, secrets, nodecg);
  });

  nodecg.listenFor(
    "subscription",
    // eslint-disable-next-line no-unused-vars
    ({ channel, gifter, recipient, subInfo, count }) => {
      maybeMeetCriteria("subscriptions", count, secrets, nodecg);
    }
  );

  // TODO: Listen for secret events so that you can post to chat about them
  // ...Either when a certain number of secrets is reached, or just to give hints
  // that something has happened!

  // TODO: Cheers / Bits (pubsub)
  // TODO: Raids / hosts (chat)
  // TODO: Follows (eventsub only)
  // TODO: Viewers (API: Stream)
};
