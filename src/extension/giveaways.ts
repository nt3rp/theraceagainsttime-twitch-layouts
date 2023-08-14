import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type { TwitchClient } from "./clients/twitch-client";

import * as UNLOCKS from "../../config/unlocks.json";
import { ChatMessageEvent } from "../types/events";
import { compare, sample, slugify } from "./utils";

const GIVEAWAYS = UNLOCKS.filter(({ type }) => type === "giveaway");

export interface Giveaway {
  id: string;
  type: "giveaway";
  title: string;
  active?: boolean;
  unlocked?: boolean;
  url?: string;
  winner?: string;
  entrants?: Array<string>;
  subject: "donation.total";
  criteria: {
    comparator: string;
    value: number;
  };
}

// interface Unlock {
//   name: string;
//   visible?: boolean;
//   giveaway?: boolean;
//   resolved?: boolean;
// }

// TODO: Consider making this even more generic
// Could dig / pluck the subject from the criteria.
// Might need to do something about filtering, if so.
// Copied and modified from secrets.ts
const maybeMeetCriteria = (
  subject: Giveaway["subject"],
  criteria: any,
  giveaways: Replicant<Array<Giveaway>>,
  nodecg: NodeCG
) => {
  const unmetCriteria = giveaways.value.filter(
    ({ unlocked, subject: s }) => !unlocked && s === subject
  );

  unmetCriteria.forEach((g) => {
    const { id, criteria: c } = g;
    const { comparator, value: threshold } = c;
    if (compare(comparator, criteria, threshold)) {
      giveaways.value.find((giveaway) => {
        if (id !== giveaway.id) return false;
        giveaway.unlocked = true;
        nodecg.log.debug(`[Giveaway] ${giveaway.title} unlocked`);
        nodecg.sendMessage("giveaway.unlocked", giveaway);
        return true;
      });
    }
  });
};

// TODO: Generalize some of these replicant searching methods.
// eslint-disable-next-line no-unused-vars
export default (nodecg: NodeCG, twitch: TwitchClient) => {
  nodecg.log.info("⬆ Setting up 'giveaways' extension...");

  // TODO: Make an announcement when milestone surpased; might need to emit from tiltify
  const giveaways: Replicant<Array<Giveaway>> = nodecg.Replicant("giveaways", {
    defaultValue: GIVEAWAYS as Array<Giveaway>,
  });

  const unlocks: Replicant<any> = nodecg.Replicant("unlocks", {
    defaultValue: {},
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
    ({ id, channel, user, message, privileged }: ChatMessageEvent) => {
      if (!message.startsWith("!giveaway")) return;

      const [_, cmd, arg] = message.split(" ");
      const giveaway = giveaways.value.find(
        ({ id }: Giveaway) => id === currentGiveaway.value
      );

      switch (cmd) {
        case "list": {
          if (!privileged) return;
          const ids = giveaways.value
            .filter(({ unlocked, winner }) => !!unlocked && !winner)
            .map(({ id }) => id)
            .join(", ");
          twitch.chat.say(
            channel,
            `Unlocked giveaways: ${ids || "No giveaways unlocked"}`
          );
          break;
        }
        case "start": {
          if (!arg || !privileged) return;
          const giveaway = giveaways.value.find(
            ({ id }: Giveaway) => id === arg
          );
          if (!giveaway) return;
          if (giveaway.active) {
            twitch.chat.say(
              channel,
              `Already a giveaway in progress: ${giveaway.title}`
            );
            return;
          }

          currentGiveaway.value = arg;
          twitch.chat.say(
            channel,
            `Starting giveaway: ${giveaway.title}! More details at ${giveaway.url}. You can enter the giveaway by typing !giveaway in the chat`
          );
          break;
        }
        case "end": {
          if (!privileged || !giveaway) return;
          const winner = sample(giveaway.entrants ?? []);
          twitch.chat.say(
            channel,
            `Congratulations @${winner}, you won the giveaway!`
          );
          giveaway.winner = winner;
          giveaway.active = false;
          currentGiveaway.value = undefined;
          nodecg.sendMessage("giveaway.completed", giveaway);
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

  nodecg.listenFor("donation.total", (total: number) => {
    maybeMeetCriteria("donation.total", total, giveaways, nodecg);
  });

  unlocks.on("change", (newObj) => {
    if (!newObj) return;

    Object.entries(newObj).forEach(([key, value]) => {
      const { name, giveaway, resolved }: any = value;
      if (!giveaway || resolved) return;

      const slug = slugify(key);
      const found = giveaways.value.find(({ id }) => id === slug);
      if (found) return;

      giveaways.value.push({
        id: slug,
        type: "giveaway",
        title: name,
        unlocked: true,
        subject: "donation.total",
        criteria: {
          comparator: ">",
          value: 0,
        },
      });
    });
  });
};
