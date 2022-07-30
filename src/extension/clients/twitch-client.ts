import { promises as fs } from "fs";
import { ApiClient } from "@twurple/api";
import { RefreshingAuthProvider } from "@twurple/auth";
import { ChatClient } from "@twurple/chat";
import { EventSubListener } from "@twurple/eventsub";
import { NgrokAdapter } from "@twurple/eventsub-ngrok";

import type { NodeCG } from "nodecg-types/types/server";

/*
In the event of non-connection / needing to sign-in from scratch:
1. Visit https://id.twitch.tv/oauth2/authorize?client_id=CLIENT_ID&redirect_uri=http://localhost&response_type=code&scope=chat:read+chat:edit+whispers:edit+channel:read:subscriptions
2. From the Chrome developer console, execute the following:
  ```
  await fetch('https://id.twitch.tv/oauth2/token?client_id=CLIENT_ID&client_secret=CLIENT_SECRET&code=CODE_FROM_LAST_REQUEST&grant_type=authorization_code&redirect_uri=http://localhost', { method: 'POST' });
  ```
3. In the `Network` tab, retrieve the `access_token` and `refresh_token`
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
            JSON.stringify(
              { ...newTokenData, clientId, clientSecret, channels },
              null,
              2
            ),
            "utf8"
          ),
      },
      config
    );

    const chat = new ChatClient({ authProvider, channels });
    instance._chat = chat;
    await chat.connect();

    const api = new ApiClient({ authProvider });
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

/*
            Logged | Alert
            --------------
  Community    X   |       
  Gifted           |   X
  Regular      X   |   X
  */

const setupSubscriptions = (nodecg: NodeCG, twitch: TwitchClient) => {
  nodecg.log.info("⬆ Listening for subscriptions...");

  twitch.chat.onSub((channel, subscriber, info) => {
    const { isPrime, months, plan, streak } = info;
    nodecg.log.debug(
      `[Twitch] [Subscription]: #${channel} @${subscriber}: ${info}`
    );
    nodecg.sendMessage("subscription", {
      channel,
      subscriber,
      tier: parseInt(plan, 10) / 1000,
      isPrime,
      months,
      streak,
    });
  });

  twitch.chat.onResub((channel, subscriber, info) => {
    const { isPrime, months, plan, streak } = info;
    nodecg.log.debug(
      `[Twitch] [Re-Subscription]: #${channel} @${subscriber}: ${info}`
    );
    nodecg.sendMessage("subscription", {
      channel,
      subscriber,
      tier: parseInt(plan, 10) / 1000,
      isPrime,
      months,
      streak,
    });
  });

  twitch.chat.onSubExtend((channel, subscriber, info) => {
    const { endMonth, months } = info;
    nodecg.log.debug(
      `[Twitch] [Subscription Extend]: #${channel} @${subscriber}: ${info}`
    );
    nodecg.sendMessage("subscription", {
      channel,
      subscriber,
      months,
      extendedMonths: Math.abs(endMonth - (new Date().getMonth() + 1)),
    });
  });

  twitch.chat.onCommunitySub((channel, gifter, info) => {
    const { count, gifterGiftCount, plan } = info;
    nodecg.log.debug(
      `[Twitch] [Community Subscription]: #${channel} @${gifter}: ${info}`
    );
    nodecg.sendMessage("subscription.community", {
      channel,
      gifter,
      tier: parseInt(plan, 10) / 1000,
      count,
      totalGifts: gifterGiftCount,
    });
  });

  // Triggered by 'onCommunitySub'.
  twitch.chat.onSubGift((channel, recipient, info) => {
    const { giftDuration, gifter, isPrime, message, months, plan, streak } =
      info;
    nodecg.log.debug(
      `[Twitch] [Gifted Subscription]: #${channel} @${recipient}: ${info}`
    );
    nodecg.sendMessage("subscription.gift", {
      channel,
      subscriber: recipient,
      tier: parseInt(plan, 10) / 1000,
      isPrime,
      months,
      streak,
      gifter,
      message,
      giftedDuration: giftDuration,
    });
  });
};

const setupChat = (nodecg: NodeCG, twitch: TwitchClient) => {
  nodecg.log.info("⬆ Listening for chat messages...");
  twitch.chat.onMessage((channel, user, message, info) => {
    const { bits } = info;
    nodecg.log.debug(
      `[Twitch] [Chat]: #${channel} @${user}: ${message} (${info})`
    );
    if (user === twitch.name) {
      // Ignore message; it's from ourselves.
      return;
    }

    nodecg.sendMessage("chat", { channel, user, message, bits });
  });
};

const setupRaids = (nodecg: NodeCG, twitch: TwitchClient) => {
  nodecg.log.info("⬆ Listening for raids...");
  twitch.chat.onRaid((raided, raider, info) => {
    const { viewerCount } = info;
    nodecg.log.debug(`[Twitch] [Raid]: #${raided} @${raider}: ${info}`);
    if (!twitch.channels.includes(raided)) {
      // We only care about channels we're authorized to host.
      // At the moment, there's just one channel.
      return;
    }

    nodecg.sendMessage("raid", { raided, raider, count: viewerCount });
  });
};

const setupHosts = (nodecg: NodeCG, twitch: TwitchClient) => {
  nodecg.log.info("⬆ Listening for hosts...");
  twitch.chat.onHost((host, hosted, viewers) => {
    nodecg.log.debug(
      `[Twitch] [Host]: #${hosted} @${host}: ${viewers} viewers`
    );
    if (!twitch.channels.includes(hosted)) {
      // We only care about channels we're authorized to host.
      // At the moment, there's just one channel.
      return;
    }

    nodecg.sendMessage("host", { host, hosted, viewers });
  });
};

const setupViewers = async (nodecg: NodeCG, twitch: TwitchClient) => {
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

// TODO: This won't aggregate follows or hypetrains; will probably have to do a replicant.
const setupEvents = (nodecg: NodeCG, twitch: TwitchClient) => {
  nodecg.log.info("⬆ Listening for Twitch events...");
  twitch.channels.forEach(async (channel) => {
    const user = await twitch.api.users.getUserByName(channel);
    if (!user) {
      nodecg.log.debug(
        `[Twitch] [User]: #${channel}: Unable to fetch user info.`
      );
      return;
    }

    twitch.eventSub.subscribeToChannelFollowEvents(user, (event) => {
      const { userName } = event;
      nodecg.log.debug(`[Twitch] [Follow]: #${channel} @${userName} followed`);
      nodecg.sendMessage("follow", { channel, user: userName });
    });

    twitch.eventSub.subscribeToChannelHypeTrainBeginEvents(user, (event) => {
      const { startDate, lastContribution } = event;
      nodecg.log.debug(
        `[Twitch] [Hypetrain]: #${channel} @${lastContribution.userName} started the hypetrain: ${event}`
      );
      nodecg.sendMessage("hypetrain.start", {
        channel,
        startDate,
        conductor: lastContribution.userName,
      });
    });

    twitch.eventSub.subscribeToChannelHypeTrainEndEvents(user, (event) => {
      const { endDate, level } = event;
      nodecg.log.debug(`[Twitch] [Hypetrain]: #${channel} ended: ${event}`);
      nodecg.sendMessage("hypetrain.end", { channel, endDate, level });
    });
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
    setupRaids,
    setupHosts,
    setupEvents,
    setupViewers,
  ].forEach((method) => method(nodecg, client));
  return client;
};
