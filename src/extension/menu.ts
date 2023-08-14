import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type { TwitchClient } from "./clients/twitch-client";

// eslint-disable-next-line no-unused-vars
export default (nodecg: NodeCG, twitch: TwitchClient) => {
  nodecg.log.info("⬆ Setting up 'menu' extension...");

  const menuSelection: Replicant<string | undefined> = nodecg.Replicant(
    "menu.selection",
    { defaultValue: undefined }
  );

  nodecg.listenFor("menu.selection", (selection: string | undefined) => {
    menuSelection.value = selection;
  });
};
