import { NodeCG } from "nodecg-types/types/server"
const { promises: fs } = require('fs');
const path = require('path');
const { RefreshingAuthProvider } = require('@twurple/auth');
const { ChatClient } = require('@twurple/chat');

/*
In the event of non-connection / needing to sign-in from scratch:
1. Visit https://id.twitch.tv/oauth2/authorize?client_id=CLIENT_ID&redirect_uri=http://localhost&response_type=code&scope=chat:read+chat:edit+whispers:edit+channel:read:subscriptions
2. From the Chrome developer console, execute the following:
  ```
  await fetch('https://id.twitch.tv/oauth2/token?client_id=CLIENT_ID&client_secret=CLIENT_SECRET&code=CODE_FROM_LAST_REQUEST&grant_type=authorization_code&redirect_uri=http://localhost', { method: 'POST' });
  ```
3. In the `Network` tab, retrieve the `access_token` and `refresh_token`
*/
const setup = async() => {
  const TOKEN_FILE = path.join(__dirname, '../config/twitch.json');
  const tokenData = JSON.parse(await fs.readFile(TOKEN_FILE, 'UTF-8'));
  const { clientId, clientSecret, channels } = tokenData;
  const authProvider = new RefreshingAuthProvider(
    {
      clientId,
      clientSecret,
      onRefresh: async (newTokenData) =>
        await fs.writeFile(
          TOKEN_FILE,
          JSON.stringify(
            {...newTokenData, clientId, clientSecret, channels},
            null,
            2
          ),
          'UTF-8'
      )
    },
    tokenData
  );

  const client = new ChatClient({ authProvider, channels});
  await client.connect()
  return client;
}

export default async (nodecg: NodeCG) => {
  const client = await setup();
  client.onMessage((channel, user, message) => {
    console.log(`${user}: ${message}`);
  });
}