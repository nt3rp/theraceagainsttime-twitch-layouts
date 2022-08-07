import { promises as fs } from "fs";
import * as path from "path";
import { toCsv } from "./utils";

import type { NodeCG } from "nodecg-types/types/server";
import type { ChatMessageEvent } from "../types/events";
import type { TwitchClient } from "./clients/twitch-client";

const CLIP_REGEX = /clip[\W]*(this|that|it)/i;

export default (nodecg: NodeCG, twitch: TwitchClient) => {
  nodecg.log.info("⬆ Setting up 'clip' extension...");

  const clipLog = path.join(__dirname, `../../logs/clips.csv`);

  nodecg.listenFor(
    "chat",
    async ({ channel, message, user }: ChatMessageEvent) => {
      if (!CLIP_REGEX.test(message)) return;

      const absoluteNow = new Date();
      let marker;
      try {
        marker = await twitch.api.streams.createStreamMarker(channel);
      } catch (e) {
        nodecg.log.warn("Could not mark stream.");
      }

      fs.appendFile(
        clipLog,
        toCsv(
          absoluteNow,
          marker ? marker.positionInSeconds : 0,
          `${user}: ${message}`
        )
      );

      twitch.chat.say(
        channel,
        `A stream marker has been created and we've noted the timestamp. Thank you 🙇‍♂️`,
        { replyTo: user }
      );
    }
  );
};
