import { promises as fs } from "fs";
import { RefreshingAuthProvider } from "@twurple/auth";
import { ChatClient } from "@twurple/chat";

/*
In the event of non-connection / needing to sign-in from scratch:
1. Visit https://id.twitch.tv/oauth2/authorize?client_id=CLIENT_ID&redirect_uri=http://localhost&response_type=code&scope=chat:read+chat:edit+whispers:edit+channel:read:subscriptions
2. From the Chrome developer console, execute the following:
  ```
  await fetch('https://id.twitch.tv/oauth2/token?client_id=CLIENT_ID&client_secret=CLIENT_SECRET&code=CODE_FROM_LAST_REQUEST&grant_type=authorization_code&redirect_uri=http://localhost', { method: 'POST' });
  ```
3. In the `Network` tab, retrieve the `access_token` and `refresh_token`
*/

export class TwitchClient {
  private chat: any;

  public static create = async (
    credentialsPath: string
  ): Promise<TwitchClient> => {
    const instance = new TwitchClient();

    const tokenData = JSON.parse(
      await fs.readFile(credentialsPath, { encoding: "utf8" })
    );
    const { clientId, clientSecret, channels } = tokenData;
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
      tokenData
    );

    const chat = new ChatClient({ authProvider, channels });
    await chat.connect();

    instance.chat = chat;
    return instance;
  };
}

// export default async (nodecg: NodeCG) => {
//   nodecg.log.info("⬆ Starting Twitch client");
//   const TOKEN_FILE = path.join(__dirname, "../config/twitch.json");
//   const client = await setup(TOKEN_FILE);

//   // Events that we need to tell other replicants about.
//   client.onMessage((channel, user, message) => {
//     console.log(`${user}: ${message}`);
//   });

//   // Events that we need to respond to Twitch with.
//   // eslint-disable-next-line no-unused-vars
//   nodecg.listenFor("topic", (event: any) => {});
// };
