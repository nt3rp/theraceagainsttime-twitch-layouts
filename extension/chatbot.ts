import { promises as fs } from "fs";
import * as path from "path";
import { RefreshingAuthProvider } from "@twurple/auth";
import { ChatClient } from "@twurple/chat";

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
const setup = async (filePath) => {
  const tokenData = JSON.parse(
    await fs.readFile(filePath, { encoding: "utf8" })
  );
  const { clientId, clientSecret, channels } = tokenData;
  const authProvider = new RefreshingAuthProvider(
    {
      clientId,
      clientSecret,
      onRefresh: async (newTokenData) =>
        await fs.writeFile(
          filePath,
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

  const client = new ChatClient({ authProvider, channels });
  await client.connect();
  return client;
};

// eslint-disable-next-line no-unused-vars
export default async (nodecg: NodeCG) => {
  const TOKEN_FILE = path.join(__dirname, "../config/twitch.json");
  const client = await setup(TOKEN_FILE);
  client.onMessage((channel, user, message) => {
    console.log(`${user}: ${message}`);
  });
};
