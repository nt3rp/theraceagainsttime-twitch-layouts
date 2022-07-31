import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type { TwitchClient } from "./clients/twitch-client";

import * as LADDER_CANDIDATES from "../../config/ladder.json";
import { shuffle } from "./utils";
import { ChatMessageEvent } from "../types/events";

export type LadderCandidate = {
  id: string;
  votes: Record<string, boolean>;
  total: number;
};
export type LadderRound = Array<LadderCandidate>;

const initialSeed = (candidates: Array<string>): LadderRound => {
  const seeds = shuffle(candidates);
  return seeds.map((seed) => ({ id: seed, votes: {}, total: 0 }));
};

const vote = (
  round: LadderRound | undefined,
  candidate: string,
  voter: string
) => {
  if (!round) return;
  const index = round.findIndex(
    ({ id }) => id.toLowerCase() === candidate.toLowerCase()
  );
  if (index === -1) {
    // TODO: Twitch
    return;
  }

  const pairIndex = index % 2 === 0 ? index + 1 : index - 1;
  round[index].votes[voter] = true;
  delete round[pairIndex].votes[voter];
};

const nextRound = (round: LadderRound | undefined): LadderRound | undefined => {
  if (!round || round.length === 1) return undefined;

  return round.reduce<LadderRound>((acc, candidate, i, arr) => {
    if (i % 2 === 0) return acc;
    const currVotes = Object.keys(arr[i].votes).length;
    const prevVotes = Object.keys(arr[i - 1].votes).length;

    if (currVotes > prevVotes) {
      acc.push({ ...arr[i], votes: {}, total: arr[i].total + currVotes });
    } else if (currVotes < prevVotes) {
      acc.push({
        ...arr[i - 1],
        votes: {},
        total: arr[i - 1].total + prevVotes,
      });
    } else {
      if (arr[i].total > arr[i - 1].total) {
        acc.push({ ...arr[i], votes: {}, total: arr[i].total + currVotes });
      } else {
        acc.push({
          ...arr[i - 1],
          votes: {},
          total: arr[i - 1].total + prevVotes,
        });
      }
    }
    return acc;
  }, []);
};

export default (nodecg: NodeCG, twitch: TwitchClient) => {
  nodecg.log.info("⬆ Setting up 'ladder' extension...");

  const initialRound = initialSeed(LADDER_CANDIDATES);

  const ladder: Replicant<Array<LadderRound>> = nodecg.Replicant("ladder", {
    defaultValue: [initialRound],
  });

  nodecg.listenFor(
    "chat",
    ({ message, channel, user, isMod }: ChatMessageEvent) => {
      if (!message.startsWith("!ladder")) return;

      const [_, arg] = message.split(" ");
      const round = ladder.value.at(-1);

      switch (arg) {
        case "":
        case undefined: {
          if (round?.length === 1) {
            twitch.chat.say(channel, `Winner: ${round[0].id}`);
            return;
          }

          const pairs = round
            ?.map((c, i, arr) =>
              i % 2 === 0
                ? undefined
                : `${arr[i].id} (${Object.keys(arr[i].votes).length}) vs
                 ${arr[i - 1].id} (${Object.keys(arr[i - 1].votes).length})`
            )
            .filter((e) => !!e);
          twitch.chat.say(channel, `Current matches: ${pairs?.join(", ")}`);
          break;
        }
        case "next": {
          if (!isMod) return;
          const next = nextRound(round);
          if (!next) {
            // TODO: Say something;
            return;
          }
          ladder.value.push(next);
          break;
        }
        default: {
          vote(round, arg, user);
          break;
        }
      }
    }
  );
};
