import { promises as fs } from "fs";
import * as path from "path";
import { toCsv } from "./utils";

import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type { TwitchClient } from "./clients/twitch-client";
import type {
  CommunitySubscriptionEvent,
  DonationEvent,
  FollowEvent,
  HostEvent,
  HypetrainEndEvent,
  HypetrainStartEvent,
  StreamEvent,
  SubscriptionEvent,
  SubscriptionExtendedEvent,
} from "../types/events";

// TODO: Secret
// TODO: Checkpoint
type ToEventStreamArgs =
  | { type: "checkpoint"; event: unknown }
  | { type: "donation"; event: DonationEvent }
  | { type: "follow"; event: FollowEvent }
  | { type: "guest.change"; event: [string | undefined, string?] }
  | { type: "host"; event: HostEvent }
  | { type: "hypetrain.end"; event: HypetrainEndEvent }
  | { type: "hypetrain.start"; event: HypetrainStartEvent }
  | { type: "secret"; event: unknown }
  | {
      type: "subscription";
      event: SubscriptionEvent | SubscriptionExtendedEvent;
    }
  | { type: "subscription.gift"; event: SubscriptionEvent }
  | { type: "subscription.community"; event: CommunitySubscriptionEvent };

const toStreamEvent = ({
  type,
  event,
}: ToEventStreamArgs): StreamEvent | undefined => {
  let when: Date = new Date();
  let description = "";
  let title: string;
  switch (type) {
    case "checkpoint":
      title = "???";
      break;
    case "donation":
      when = new Date(event.completedAt);
      title = `${event.name} donated ${event.amount}`;
      description = event.comment ?? "No comment";
      break;
    case "follow":
      title = `${event.user} followed ${event.channel}`;
      break;
    case "guest.change": {
      const [current, old] = event;
      title = `${old || current} ${old ? "left" : "joined"} the stream`;
      break;
    }
    case "host":
      title = `${event.host} ${event.isRaid ? "raid" : "host"}ed ${
        event.channel
      }`;
      description = `${event.viewers} viewers`;
      break;
    case "hypetrain.start":
      title = `Hypetrain started by ${event.conductor}`;
      break;
    case "hypetrain.end":
      title = `Level ${event.level} Hypetrain Ended`;
      break;
    case "secret":
      title = `Secret revealed!`;
      description = `???`;
      break;
    case "subscription":
      title = `${event.subscriber} subscribed to ${event.channel}`;
      description = `${event.months} month subscription`;
      break;
    case "subscription.gift":
      title = `${event.subscriber} was gifted a subscription to ${event.channel}`;
      description = `${event.months} month subscription`;
      break;
    case "subscription.community":
      title = `${event.gifter} gifted ${event.count} subscriptions to ${event.channel}`;
      description = `Total gift subscriptions: ${event.totalGifts}`;
      break;
    default:
      return undefined;
  }
  return {
    when,
    type,
    title,
    description,
    icon: type,
  };
};

// eslint-disable-next-line no-unused-vars
export default (nodecg: NodeCG, twitch: TwitchClient) => {
  nodecg.log.info("⬆ Setting up 'clerks' extension...");

  const events: Replicant<Array<StreamEvent>> = nodecg.Replicant("events", {
    defaultValue: [],
  });

  const eventLog = path.join(__dirname, `../../logs/events.csv`);

  [
    "checkpoint",
    "donation",
    "follow",
    "guest.change",
    "host",
    "hypetrain.end",
    "hypetrain.start",
    "secret",
    "subscription",
    "subscription.gift",
    "subscription.community",
  ].forEach((type) =>
    nodecg.listenFor(type, (event) => {
      const streamEvent = toStreamEvent({
        type: type as ToEventStreamArgs["type"],
        event,
      });
      nodecg.sendMessage("stream-event", streamEvent);
    })
  );

  nodecg.listenFor(
    "stream-event",
    ({ when, type, title, description }: StreamEvent) => {
      fs.appendFile(eventLog, toCsv(when, type, title, description));
      events.value.push({ when, type, title, description });
    }
  );
};
