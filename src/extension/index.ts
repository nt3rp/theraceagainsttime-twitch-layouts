import * as path from "path";
import { promises as fs } from "fs";
// import setupTiltify from "./clients/tiltify-client";
// import setupTwitch from "./clients/twitch-client";
// import secrets from "./secrets";
// import credits from "./credits";
// import giveaways from "./giveaways";
// import ladder from "./ladder";
// import guests from "./guests";
// import eventstream from "./eventstream";
// import donations from "./donations";
// import clip from "./clip";
// import checkpoints from "./checkpoints";
// import menu from "./menu";
// import web from "./web";
// import channelPoints from "./channelPoints";

import type { NodeCG } from "nodecg-types/types/server";
import {
  ClientCredentialsAuthProvider,
  RefreshingAuthProvider,
} from "@twurple/auth";
import { ApiClient } from "@twurple/api";
import { NgrokAdapter } from "@twurple/eventsub-ngrok";
import { EventSubListener } from "@twurple/eventsub";

// import * as TILTIFY_CONFIG from "../../config/tiltify.json";

// Inject any dependencies manually.

// https://id.twitch.tv/oauth2/authorize?client_id=CLIEND_ID&redirect_uri=http://localhost&response_type=code&scope=channel:read:redemptions+channel:manage:redemptions

// eslint-disable-next-line no-unused-vars
export default async (nodecg: NodeCG) => {
  const credentialsPath = path.join(__dirname, "../../config/twitch.json");
  const config = JSON.parse(
    await fs.readFile(credentialsPath, { encoding: "utf8" })
  );
  // eslint-disable-next-line no-unused-vars
  const { clientId, clientSecret, channels, botName, eventSubSecret } = config;

  // eslint-disable-next-line no-unused-vars
  const refreshingAuthProvider = new RefreshingAuthProvider(
    {
      clientId,
      clientSecret,
      onRefresh: async (newTokenData) =>
        await fs.writeFile(
          credentialsPath,
          JSON.stringify({ ...config, ...newTokenData }, null, 2),
          "utf8"
        ),
    },
    config
  );

  /*
  OH, OK.

I feel silly now.

After rereading what you've said, experimenting, and peering back through some previous threads, this was the piece I was missing:

> You then create a new AuthProvider and ApiClient instance for each user so you can actually use the appropriate token

- One for User-scoped data access
- One for App-scoped things (like EventSubs)
  */

  // From this thread: https://discord.com/channels/325552783787032576/350012219003764748/1007391144247820464
  /*
  You then create a new AuthProvider and ApiClient instance for each user so you can actually use the appropriate token
  */

  const appTokenAuthProvider = new ClientCredentialsAuthProvider(
    clientId,
    clientSecret
    // config.scope
  );

  const userScopedApi = new ApiClient({ authProvider: refreshingAuthProvider });
  const eventSubApi = new ApiClient({ authProvider: appTokenAuthProvider });

  await eventSubApi.eventSub.deleteAllSubscriptions();

  const listener = new EventSubListener({
    apiClient: eventSubApi,
    adapter: new NgrokAdapter(),
    secret: eventSubSecret,
    strictHostCheck: true,
  });
  await listener.listen();
  const eventSub = listener;

  const channel = "theraceagainsttime";

  const userId = await eventSubApi.users.getUserByName(channel);

  const rewards = await userScopedApi.channelPoints.getCustomRewards(userId!);
  nodecg.log.debug("[ChannelPoints]: Rewards");
  nodecg.log.debug(rewards);

  // NOTE: Test redemptions don't appear in thing...
  const pointsRedemptionSubscription =
    await eventSub.subscribeToChannelRedemptionAddEvents(
      userId!,
      async (rewardEvent) => {
        nodecg.log.debug(rewardEvent);
        const reward = await rewardEvent.getReward();
        await userScopedApi.channelPoints.updateCustomReward(
          userId!,
          reward.id,
          {
            ...reward,
            isPaused: true,
          }
        );
      }
    );

  nodecg.log.debug(
    `[ChannelPoints] Debug command: ${await pointsRedemptionSubscription.getCliTestCommand()}`
  );

  if (!rewards.find(({ title }) => title.startsWith("banana"))) {
    await userScopedApi.channelPoints.createCustomReward(userId!, {
      title: "Banana: Test",
      cost: 100,
      globalCooldown: 60,
    });
  }

  // Set up dependencies
  // setupTiltify(nodecg, TILTIFY_CONFIG);
  // const twitchClient = await setupTwitch(
  //   nodecg,
  //   path.join(__dirname, "../../config/twitch.json")
  // );
  // channelPoints(nodecg, twitchClient);
  // checkpoints(nodecg, twitchClient);
  // secrets(nodecg, twitchClient);
  // credits(nodecg, twitchClient);
  // eventstream(nodecg, twitchClient);
  // giveaways(nodecg, twitchClient);
  // ladder(nodecg, twitchClient);
  // guests(nodecg, twitchClient);
  // donations(nodecg, twitchClient);
  // clip(nodecg, twitchClient);
  // menu(nodecg, twitchClient);
  // web(nodecg);
};
