import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type {
  ChatMessageEvent,
  CommunitySubscriptionEvent,
  DonationEvent,
  FollowEvent,
  HostEvent,
  SubscriptionEvent,
} from "../types/events";
import type { TwitchClient } from "./clients/twitch-client";

export type CreditsType =
  | "chat"
  | "subscription.community"
  | "subscription"
  | "donation"
  | "host"
  | "follow";

export type Credit = Partial<Record<CreditsType, boolean>>;
export type Credits = Record<string, Credit>;

const trackEvents = (nodecg: NodeCG, credits: Replicant<Credits>) => {
  const addOrSet = (user: string, key: CreditsType) => {
    credits.value[user] = !credits.value[user]
      ? { [key]: true }
      : { ...credits.value[user], [key]: true };
  };

  // TODO: reduce all of these calls to a single forEach
  // If you had a base type or method to fetch the "name" field
  // Then you can reduce some of this mostly duplicate code.
  nodecg.listenFor("donation", ({ name }: DonationEvent) =>
    addOrSet(name, "donation")
  );

  nodecg.listenFor(
    "subscription.community",
    ({ gifter }: CommunitySubscriptionEvent) => {
      addOrSet(gifter ?? "Anonymous", "subscription.community");
    }
  );

  nodecg.listenFor("subscription", ({ subscriber }: SubscriptionEvent) => {
    addOrSet(subscriber, "subscription");
  });

  nodecg.listenFor("host", ({ host }: HostEvent) => {
    addOrSet(host, "host");
  });

  nodecg.listenFor("raid", ({ host }: HostEvent) => {
    addOrSet(host, "host");
  });

  nodecg.listenFor("follow", ({ user }: FollowEvent) => {
    addOrSet(user, "follow");
  });

  nodecg.listenFor("chat", ({ user }: ChatMessageEvent) => {
    addOrSet(user, "chat");
  });
};

// eslint-disable-next-line no-unused-vars
export default (nodecg: NodeCG, twitch: TwitchClient) => {
  nodecg.log.info("⬆ Setting up 'credits' extension...");

  const credits: Replicant<Credits> = nodecg.Replicant("credits", {
    defaultValue: {},
  });

  trackEvents(nodecg, credits);

  nodecg.listenFor(
    "chat",
    ({ channel, message, privileged }: ChatMessageEvent) => {
      if (!privileged || !message.startsWith("!credits")) return;

      const [_, cmd] = message.split(" ");

      switch (cmd) {
        case "reset":
          nodecg.sendMessage("credits.reset");
          break;
        default: {
          // Longest twitch name is 25 characters, message length is ~500 characters.
          // Send multiple messages assuming 25 character long names.
          // (There are likely better ways to do this, but for now, just keep it simple)
          const users = Object.keys(credits.value);
          for (let i = 0; i < users.length; i += 16) {
            const greeting =
              i === 0
                ? "The Race Against Time would like to thank the following people"
                : "...and ALSO";

            twitch.chat.say(
              channel,
              `${greeting}: ${users.slice(i, i + 16).join(", ")}`
            );
          }
          break;
        }
      }
    }
  );

  nodecg.listenFor("credits.reset", () => {
    credits.value = {};
  });
};
