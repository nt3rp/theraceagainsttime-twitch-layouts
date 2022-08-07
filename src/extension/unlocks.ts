import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type { TwitchClient } from "./clients/twitch-client";
import type { Unlockable } from "../types/events";
import { compare } from "./utils";

import * as UNLOCKS from "../../config/unlocks.json";

const maybeMeetCriteria = (
  subject: Unlockable["subject"],
  criteria: any,
  unlocks: Replicant<Array<Unlockable>>,
  nodecg: NodeCG
) => {
  const unmetCriteria = unlocks.value.filter(
    ({ unlocked, subject: s }) => !unlocked && s === subject
  );

  unmetCriteria.forEach((s) => {
    const { title, criteria: c } = s;
    const { comparator, value: threshold } = c;
    if (compare(comparator, criteria, threshold)) {
      unlocks.value.find((unlock) => {
        if (title !== unlock.title) return false;
        unlock.unlocked = true;
        nodecg.log.debug(`[Unlock] ${unlock.title} completed`);
        nodecg.sendMessage("unlock", unlock);
        return true;
      });
    }
  });
};

// TODO: Generalize some of these replicant searching methods.
// eslint-disable-next-line no-unused-vars
export default (nodecg: NodeCG, twitch: TwitchClient) => {
  nodecg.log.info("⬆ Setting up 'unlocks' extension...");

  const unlocks: Replicant<Array<Unlockable>> = nodecg.Replicant("unlocks", {
    defaultValue: UNLOCKS as Array<Unlockable>,
  });

  // TODO: Unite with secrets. VERY similar.
  nodecg.listenFor("donation.total", (total: number) =>
    maybeMeetCriteria("donation.total", total, unlocks, nodecg)
  );

  nodecg.listenFor("unlock", (event: Unlockable) => {
    if (event.type === "giveaway") {
      nodecg.sendMessage("giveaway.new", {
        ...event,
        active: false,
        winner: undefined,
        entrants: [],
      });
    }
  });

  // TODO: Other giveaways
};
