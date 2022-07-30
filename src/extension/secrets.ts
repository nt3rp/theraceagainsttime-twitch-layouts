import { compare } from "./utils";

import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type {
  ChatMessageEvent,
  CommunitySubscriptionEvent,
  HostEvent,
} from "../types/events";
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

export interface Secret {
  name: string;
  description?: string;
  completedAt?: Date;
  subject:
    | "donation"
    | "donation.total"
    | "chat"
    | "subscription.community"
    | "bits"
    | "viewers"
    | "host.total"
    | "follow.total";
  criteria: {
    comparator: "==" | ">=" | "regexp";
    value: any;
    response?: string;
  };
}

// TODO: Consider making this even more generic
// Could dig / pluck the subject from the criteria.
// Might need to do something about filtering, if so.
const maybeMeetCriteria = (
  subject: Secret["subject"],
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

  nodecg.listenFor("donation.total", (total: number) =>
    maybeMeetCriteria("donation.total", total, secrets, nodecg)
  );

  nodecg.listenFor("chat", (event: ChatMessageEvent) => {
    maybeMeetCriteria("chat", event.message, secrets, nodecg);
    if (event.bits) {
      maybeMeetCriteria("bits", event.bits, secrets, nodecg);
    }
  });

  nodecg.listenFor(
    "subscription.community",
    (event: CommunitySubscriptionEvent) => {
      maybeMeetCriteria("subscription.community", event.count, secrets, nodecg);
    }
  );

  nodecg.listenFor("host.total", (count: number) => {
    maybeMeetCriteria("host.total", count, secrets, nodecg);
  });

  nodecg.listenFor("viewers", (event: HostEvent) => {
    maybeMeetCriteria("viewers", event.viewers, secrets, nodecg);
  });

  nodecg.listenFor("follow.total", (count: number) => {
    maybeMeetCriteria("follow.total", count, secrets, nodecg);
  });
};
