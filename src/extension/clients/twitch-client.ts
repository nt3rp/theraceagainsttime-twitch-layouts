import { promises as fs } from "fs";
import { ApiClient } from "@twurple/api";
import {
  RefreshingAuthProvider,
  ClientCredentialsAuthProvider,
} from "@twurple/auth";
import { ChatClient } from "@twurple/chat";
import { EventSubListener } from "@twurple/eventsub";
import { NgrokAdapter } from "@twurple/eventsub-ngrok";
import { diff } from "../utils";

import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type {
  HostEvent,
  FollowEvent,
  SubscriptionEvent,
  SubscriptionExtendedEvent,
} from "../../types/events";

/*
In the event of non-connection / needing to sign-in from scratch.
You'll need to complete step 1 for the account that you want to grant access to, since it will give the necessary permissions.
1. Visit https://id.twitch.tv/oauth2/authorize?client_id=CLIENT_ID&redirect_uri=http://localhost&response_type=code&scope=bits:read+channel:manage:broadcast+channel:read:hype_train+channel:read:subscriptions+chat:edit+chat:read+moderator:manage:announcements+user:read:follows+user:read:subscriptions
2. From the Chrome developer console, execute the following:
  ```
  await fetch('https://id.twitch.tv/oauth2/token?client_id=CLIENT_ID&client_secret=CLIENT_SECRET&code=CODE_FROM_LAST_REQUEST&grant_type=authorization_code&redirect_uri=http://localhost', { method: 'POST' });
  ```
3. In the `Network` tab, retrieve the `access_token` and `refresh_token`

To get the EventSub permissions working, refer to:
- https://twurple.js.org/docs/faq/
- https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#authorization-code-grant-flow
*/

/*
https://twurple.js.org/docs/getting-data/eventsub/ngrok.html
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list && sudo apt update && sudo apt install ngrok
*/
export class TwitchClient {
  private _name!: string;
  private _channels!: Array<string>;

  private _api!: ApiClient;
  private _chat!: ChatClient;
  private _eventSub!: EventSubListener;

  public static create = async (
    credentialsPath: string
  ): Promise<TwitchClient> => {
    const instance = new TwitchClient();

    const config = JSON.parse(
      await fs.readFile(credentialsPath, { encoding: "utf8" })
    );
    const { clientId, clientSecret, channels, botName, eventSubSecret } =
      config;
    instance._name = botName;
    instance._channels = channels;

    const authProvider = new RefreshingAuthProvider(
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

    const chat = new ChatClient({ authProvider, channels });
    instance._chat = chat;
    await chat.connect();

    // We don't need user-specific data for API / EventSub
    // so use a ClientCredentialsAuthProvider.
    // https://twurple.js.org/docs/auth/
    const appTokenAuthProvider = new ClientCredentialsAuthProvider(
      clientId,
      clientSecret
    );
    const api = new ApiClient({ authProvider: appTokenAuthProvider });
    instance._api = api;

    // This is necessary to prevent conflict errors resulting from ngrok assigning a new host name every time
    await api.eventSub.deleteAllSubscriptions();

    const listener = new EventSubListener({
      apiClient: api,
      adapter: new NgrokAdapter(),
      secret: eventSubSecret,
    });
    await listener.listen();
    instance._eventSub = listener;

    return instance;
  };

  public get name(): string {
    return this._name;
  }

  public get channels(): Array<string> {
    return this._channels;
  }

  public get api(): ApiClient {
    return this._api;
  }

  public get chat(): ChatClient {
    return this._chat;
  }

  public get eventSub(): EventSubListener {
    return this._eventSub;
  }
}

const setupSubscriptions = (nodecg: NodeCG, twitch: TwitchClient) => {
  nodecg.log.info("⬆ Listening for subscriptions...");

  const subscriptions: Replicant<
    Array<SubscriptionEvent | SubscriptionExtendedEvent>
  > = nodecg.Replicant("subscriptions", {
    defaultValue: [],
  });

  subscriptions.on("change", (newValue, oldValue) => {
    nodecg.sendMessage("subscription.total", newValue.length);

    const newValues = diff(newValue, oldValue);
    newValues.forEach((sub) =>
      nodecg.sendMessage(
        (sub as any).isGifted ? "subscription.gift" : "subscription",
        sub
      )
    );
  });

  twitch.chat.onSub((channel, subscriber, info) => {
    const { displayName, isPrime, months, plan, streak } = info;
    nodecg.log.debug(
      `[Twitch] [Subscription]: #${channel} @${displayName}: ${info}`
    );
    subscriptions.value.push({
      channel,
      subscriber: displayName,
      tier: parseInt(plan, 10) / 1000,
      isPrime,
      isGifted: false,
      months,
      streak,
    });
  });

  twitch.chat.onResub((channel, subscriber, info) => {
    const { displayName, isPrime, months, plan, streak } = info;
    nodecg.log.debug(
      `[Twitch] [Re-Subscription]: #${channel} @${displayName}: ${info}`
    );
    subscriptions.value.push({
      channel,
      subscriber: displayName,
      tier: parseInt(plan, 10) / 1000,
      isPrime,
      isGifted: false,
      months,
      streak,
    });
  });

  twitch.chat.onSubExtend((channel, subscriber, info) => {
    const { displayName, endMonth, months } = info;
    nodecg.log.debug(
      `[Twitch] [Subscription Extend]: #${channel} @${displayName}: ${info}`
    );
    subscriptions.value.push({
      channel,
      subscriber: displayName,
      months,
      extendedMonths: Math.abs(endMonth - (new Date().getMonth() + 1)),
    });
  });

  // Triggered by 'onCommunitySub'.
  twitch.chat.onSubGift((channel, recipient, info) => {
    const {
      giftDuration,
      gifterDisplayName,
      isPrime,
      message,
      months,
      plan,
      streak,
    } = info;
    nodecg.log.debug(
      `[Twitch] [Gifted Subscription]: #${channel} @${recipient}: ${info}`
    );
    subscriptions.push({
      channel,
      subscriber: recipient,
      tier: parseInt(plan, 10) / 1000,
      isPrime,
      isGifted: true,
      months,
      streak,
      gifter: gifterDisplayName,
      message,
      giftedDuration: giftDuration,
    });
  });

  twitch.chat.onCommunitySub((channel, gifter, info) => {
    const { count, gifterDisplayName, gifterGiftCount, plan } = info;
    nodecg.log.debug(
      `[Twitch] [Community Subscription]: #${channel} @${gifterDisplayName}: ${info}`
    );

    // Note: We don't include sub gifts in the list of subscriptions.
    nodecg.sendMessage("subscription.community", {
      channel,
      gifter: gifterDisplayName,
      tier: parseInt(plan, 10) / 1000,
      count,
      totalGifts: gifterGiftCount,
    });
  });
};

const setupChat = (nodecg: NodeCG, twitch: TwitchClient) => {
  nodecg.log.info("⬆ Listening for chat messages...");
  twitch.chat.onMessage(async (channel, user, message, info) => {
    const { bits, userInfo, id } = info;
    nodecg.log.debug(
      `[Twitch] [Chat]: #${channel} @${userInfo.displayName}: ${message} (${info})`
    );
    if (user === twitch.name) {
      // Ignore message; it's from ourselves.
      return;
    }

    nodecg.sendMessage("chat", {
      channel,
      user: userInfo.displayName,
      message,
      bits,
      id,
      isMod: userInfo.isMod,
    });
  });
};

// We do not really care about the distinction between hosts and raids
// other than for messaging purposes.
const setupHostsAndRaids = (nodecg: NodeCG, twitch: TwitchClient) => {
  nodecg.log.info("⬆ Listening for hosts and raids...");

  // We don't really care about the distinction between these two things,
  // so just call them all 'hosts'.
  const hosts: Replicant<Array<HostEvent>> = nodecg.Replicant("hosts", {
    defaultValue: [],
  });

  hosts.on("change", (newValue, oldValue) => {
    nodecg.sendMessage("host.total", newValue.length);
    const newValues = diff(newValue, oldValue);
    newValues.forEach((host) => nodecg.sendMessage("host", host));
  });

  twitch.chat.onHost((host, channel, viewers) => {
    nodecg.log.debug(
      `[Twitch] [Host]: #${channel} @${host}: ${viewers} viewers`
    );
    if (!twitch.channels.includes(channel)) {
      // We only care about channels we're authorized to host.
      // At the moment, there's just one channel.
      return;
    }

    hosts.value.push({ channel, host, viewers: viewers ?? 0, isRaid: false });
  });

  twitch.chat.onRaid((channel, host, info) => {
    const { viewerCount, displayName } = info;
    nodecg.log.debug(`[Twitch] [Raid]: #${channel} @${displayName}: ${info}`);
    if (!twitch.channels.includes(channel)) {
      // We only care about channels we're authorized to host.
      // At the moment, there's just one channel.
      return;
    }

    hosts.value.push({
      channel,
      host: displayName,
      viewers: viewerCount,
      isRaid: true,
    });
  });
};

const setupViewers = (nodecg: NodeCG, twitch: TwitchClient) => {
  nodecg.log.info("⬆ Monitoring viewer count...");
  setTimeout(() => {
    twitch.channels.forEach(async (channel) => {
      const stream = await twitch.api.streams.getStreamByUserName(channel);
      if (!stream) {
        nodecg.log.debug(
          `[Twitch] [Stream]: #${channel}: Unable to fetch stream info.`
        );
        return;
      }
      nodecg.log.debug(
        `[Twitch] [Stream]: #${channel}: ${stream.viewers} viewers (${stream})`
      );
      nodecg.sendMessage("viewers", { channel, count: stream.viewers });
    });
  }, 60_000);
};

const setupEvents = (nodecg: NodeCG, twitch: TwitchClient) => {
  nodecg.log.info("⬆ Listening for Twitch events...");

  const follows: Replicant<Array<FollowEvent>> = nodecg.Replicant("follows", {
    defaultValue: [],
  });

  follows.on("change", (newValue, oldValue) => {
    nodecg.sendMessage("follow.total", newValue.length);
    const newValues = diff(newValue, oldValue);
    newValues.forEach((follow) => nodecg.sendMessage("follow", follow));
  });

  twitch.channels.forEach(async (channel) => {
    const user = await twitch.api.users.getUserByName(channel);
    if (!user) {
      nodecg.log.debug(
        `[Twitch] [User]: #${channel}: Unable to fetch user info.`
      );
      return;
    }

    await twitch.eventSub.subscribeToChannelFollowEvents(user, (event) => {
      const { userDisplayName } = event;
      nodecg.log.debug(
        `[Twitch] [Follow]: #${channel} @${userDisplayName} followed`
      );
      follows.value.push({ channel, user: userDisplayName });
    });

    await twitch.eventSub.subscribeToChannelHypeTrainBeginEvents(
      user,
      (event) => {
        const { startDate, lastContribution } = event;
        nodecg.log.debug(
          `[Twitch] [Hypetrain]: #${channel} @${lastContribution.userDisplayName} started the hypetrain: ${event}`
        );
        nodecg.sendMessage("hypetrain.start", {
          channel,
          startDate,
          conductor: lastContribution.userDisplayName,
        });
      }
    );

    await twitch.eventSub.subscribeToChannelHypeTrainEndEvents(
      user,
      (event) => {
        const { endDate, level } = event;
        nodecg.log.debug(`[Twitch] [Hypetrain]: #${channel} ended: ${event}`);
        nodecg.sendMessage("hypetrain.end", { channel, endDate, level });
      }
    );
  });
};

// Setup Twitch.
// We *could* just listen for events on the twitch instance, but firing NodeCG
// events means we have a consistent interface to use for everything.
export default async (nodecg: NodeCG, configPath: string) => {
  nodecg.log.info("⬆ Setting up Twitch client...");
  const client = await TwitchClient.create(configPath);
  [
    setupChat,
    setupSubscriptions,
    setupHostsAndRaids,
    setupEvents,
    setupViewers,
  ].forEach((method) => method(nodecg, client));
  return client;
};
