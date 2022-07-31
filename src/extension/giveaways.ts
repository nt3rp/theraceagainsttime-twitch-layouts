import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type { TwitchClient } from "./clients/twitch-client";

import * as GIVEAWAYS from "../../config/giveaways.json";
import { ChatMessageEvent } from "../types/events";
import { sample } from "./utils";

export interface Giveaway {
  id: string;
  active?: boolean;
  unlocked?: boolean;
  prizes?: Array<string>;
  winner?: string;
  entrants?: Array<string>;
  criteria?: {
    comparator: string;
    value: number;
  };
}

// TODO: Generalize some of these replicant searching methods.
// eslint-disable-next-line no-unused-vars
export default (nodecg: NodeCG, twitch: TwitchClient) => {
  nodecg.log.info("⬆ Setting up 'giveaways' extension...");

  // TODO: Make an announcement when milestone surpased; might need to emit from tiltify
  const giveaways: Replicant<Array<Giveaway>> = nodecg.Replicant("giveaways", {
    defaultValue: GIVEAWAYS,
  });

  const currentGiveaway: Replicant<string | undefined> = nodecg.Replicant(
    "giveaways.current",
    {
      defaultValue: undefined,
    }
  );

  currentGiveaway.on("change", (newValue, oldValue) => {
    if (newValue && !oldValue) {
      // Starting a new giveaway.
      const giveaway = giveaways.value.find(
        ({ id }: Giveaway) => id === newValue
      );
      if (!giveaway) return;

      giveaway.entrants = [];
      giveaway.unlocked = true; // Regardless of previous status, now unlocked.
      giveaway.active = true;
    }

    if (!newValue && oldValue) {
      // Ending a giveaway.
      const giveaway = giveaways.value.find(
        ({ id }: Giveaway) => id === oldValue
      );
      if (!giveaway) return;
      giveaway!.active = false;
    }
  });

  nodecg.listenFor(
    "chat",
    ({ id, channel, user, message, isMod }: ChatMessageEvent) => {
      if (!message.startsWith("!giveaway")) return;

      const [_, cmd, arg] = message.split(" ");
      const giveaway = giveaways.value.find(
        ({ id }: Giveaway) => id === currentGiveaway.value
      );

      switch (cmd) {
        case "list": {
          if (!isMod) return;
          const ids = giveaways.value
            .filter(({ unlocked, winner }) => !!unlocked && !winner)
            .map(({ id }) => id)
            .join(", ");
          twitch.chat.say(channel, `Unlocked giveaways: ${ids}`);
          break;
        }
        case "start": {
          if (!arg || !isMod) return;
          const giveaway = giveaways.value.find(
            ({ id }: Giveaway) => id === arg
          );
          if (!giveaway) return;

          currentGiveaway.value = arg;
          twitch.chat.say(channel, "Starting a giveaway!");
          break;
        }
        case "end": {
          if (!isMod || !giveaway) return;
          const winner = sample(giveaway.entrants ?? []);
          twitch.chat.say(
            channel,
            `Congratulations @${winner}, you won the giveaway!`
          );
          giveaway.winner = winner;
          giveaway.active = false;
          currentGiveaway.value = undefined;
          break;
        }
        default:
          if (!giveaway || !giveaway.active) return;
          if (!giveaway.entrants) giveaway.entrants = [];
          if (giveaway.entrants.includes(user)) {
            twitch.chat.say(channel, "You've already entered the giveaway", {
              replyTo: id,
            });
          } else {
            giveaway.entrants.push(user);
          }
          break;
      }
    }
  );
};
