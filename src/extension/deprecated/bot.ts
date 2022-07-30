import type { NodeCG } from "nodecg-types/types/server";
import type { TwitchClient } from "../clients/twitch-client";

const CREDITS: any = {};

export default (nodecg: NodeCG, twitch: TwitchClient) => {
  twitch.chat.onMessage((channel, user, message) => {
    if (!CREDITS[user]) {
      CREDITS[user] = true;
    }

    if (message.includes("@prometheus_circuit")) {
      twitch.chat.say(
        channel,
        "Hello! You can call me Robo. I'm a bit of a mess right now 🛠"
      );
    }

    if (message.startsWith("!credits")) {
      twitch.chat.say(channel, `Thanks to ${Object.keys(CREDITS).join(", ")}`);
    }
  });
};
