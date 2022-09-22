import { compare, diff } from "./utils";

import type { HelixCustomReward } from "@twurple/api/lib";
import type { NodeCG } from "nodecg-types/types/server";
import type { TwitchClient } from "./clients/twitch-client";

// TODO: In the future, pull these from elsewhere
const MUTEX_SETS = [
  {
    name: "Limit voice redemptions",
    criteria: {
      subject: "title",
      comparator: "regexp",
      _value: "^Voice:",
    },
  },
];

export default async (nodecg: NodeCG, twitch: TwitchClient) => {
  nodecg.log.info("⬆ Setting up 'guests' extension...");

  const BROADCASTER = twitch.channels[0];

  const changePausedStatus = async (
    rewards: HelixCustomReward[],
    isPaused: boolean
  ) => {
    return rewards.map((reward) =>
      twitch.api.channelPoints.updateCustomReward(BROADCASTER, reward.id, {
        ...reward,
        isPaused,
      })
    );
  };

  // Hydrate the mutex sets.
  // Note: In the current implementation we don't need to do this as
  // all the code is stored as code, but the pattern is useful if this
  // data will eventually be store in replicants (which can only hold JSON).
  const hydratedSets = MUTEX_SETS.map((set) => {
    return {
      ...set,
      criteria: {
        ...set.criteria,
        value:
          set.criteria.comparator === "regexp"
            ? new RegExp(set.criteria._value, "i")
            : set.criteria._value,
      },
    };
  });

  // NOTE: Can only update rewards managed by this bot.
  const rewards = await twitch.api.channelPoints.getCustomRewards(BROADCASTER);
  nodecg.log.debug("[ChannelPoints]: Rewards");
  nodecg.log.debug(rewards);

  const mutexRewardSets = hydratedSets.map(({ name, criteria }) => {
    const { subject, comparator, value } = criteria;
    return rewards.filter((reward: any) => {
      if (reward.isEnabled && compare(comparator, reward[subject], value)) {
        nodecg.log.debug(
          `[ChannelPoints]: Rule matched: ${name} (${reward[subject]})`
        );
        return true;
      }
      return false;
    });
  });

  // Reset any matching rewards
  await mutexRewardSets.map((set) => changePausedStatus(set, false));

  const pointsRedemptionSubscription =
    await twitch.eventSub.subscribeToChannelRedemptionAddEvents(
      BROADCASTER,
      (rewardEvent) => {
        mutexRewardSets.forEach(async (set) => {
          const remainingElements = diff<any>(
            set,
            [rewardEvent],
            (a, b) => a.id === b.rewardId
          );
          if (
            remainingElements.length > 0 &&
            remainingElements.length < set.length
          ) {
            return;
          }

          const reward = await rewardEvent.getReward();
          const remainingDuration = reward.cooldownExpiryDate
            ? reward.cooldownExpiryDate.getTime() - new Date().getTime()
            : 1000;

          // Pause the other rewards;
          await changePausedStatus(remainingElements, true);
          // Unpause them when this reward has completed.
          setTimeout(async () => {
            await changePausedStatus(remainingElements, false);
          }, remainingDuration);
        });
      }
    );

  nodecg.log.debug(
    `[ChannelPoints] Debug command: ${await pointsRedemptionSubscription.getCliTestCommand()}`
  );
};
