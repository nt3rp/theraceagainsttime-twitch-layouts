import { copy } from "../utils";

import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type { TwitchClient } from "./clients/twitch-client";
import type { Guest, ChatMessageEvent } from "../types/events";

import * as GUESTS from "../../config/guests.json";

const PLATFORM_URLS: Record<string, string> = {
  twitch: "https://twitch.tv/",
  facebook: "https://facebook.com/",
  twitter: "https://twitter.com/",
  instagram: "https://instagram.com/",
  web: "",
};

export default (nodecg: NodeCG, twitch: TwitchClient) => {
  nodecg.log.info("⬆ Setting up 'guests' extension...");

  const guest: Replicant<Guest | undefined> = nodecg.Replicant(
    "guests.current",
    {
      defaultValue: undefined,
    }
  );
  const guests: Replicant<Array<Guest>> = nodecg.Replicant("guests", {
    defaultValue: GUESTS,
  });

  guest.on("change", (newGuest) => {
    if (!guests.value || guests.value.length === 0) return;
    guests.value.forEach((g) => {
      g.live = false;
    });
    if (!newGuest) return;

    const liveGuest = guests.value.find(
      ({ id }) => id.toLowerCase() === newGuest.id.toLowerCase()
    );
    // This should be impossible since we only trigger changes via an event
    // (where we explicitly check) but just in case.
    if (!liveGuest) return;
    liveGuest.live = true;

    // Technically, we should use a channel provided by Twitch.
    // BUT realistically, we're only operating on one channel 🤷‍♂️
    twitch.channels.forEach((channel) =>
      twitch.chat.say(
        channel,
        `Can we get some HYPE for our guest, ${
          liveGuest.display ?? liveGuest.id
        }???`
      )
    );
  });

  nodecg.listenFor(
    "chat",
    ({ message, channel, privileged, id }: ChatMessageEvent) => {
      if (!message.startsWith("!guest")) return;

      const [_, arg] = message.split(" ");
      const currentGuest = guest.value;

      switch (arg) {
        case "":
        case undefined: {
          if (!currentGuest) {
            twitch.chat.say(channel, "There is no guest at the moment 🤷‍♂️", {
              replyTo: id,
            });
            return;
          }

          const { id: guestId, display, socials } = currentGuest;
          const urls = Object.entries(socials)
            .map(
              ([platform, handle]) =>
                `${platform}: ${PLATFORM_URLS[platform]}${
                  handle === true ? guestId : handle
                }`
            )
            .join(", ");
          twitch.chat.say(
            channel,
            `The current guest is ${display ?? guestId} 🎉 ${urls}`,
            { replyTo: id }
          );
          break;
        }
        case "offline": {
          if (!privileged || !currentGuest) return;
          const { id: guestId, display } = currentGuest;

          nodecg.sendMessage("guest.change", [undefined, display ?? guestId]);
          break;
        }
        default: {
          if (!privileged) return;
          nodecg.sendMessage("guest.change", [arg]);
          break;
        }
      }
    }
  );

  nodecg.listenFor(
    "guest.change",
    ([guestId]: [string, undefined] | [undefined, string]) => {
      const availableGuest = guests.value.find(
        ({ id }) => id.toLowerCase() === guestId?.toLowerCase()
      );

      guest.value = availableGuest ? copy(availableGuest) : undefined;
    }
  );
};
