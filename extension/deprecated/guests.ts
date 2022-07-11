import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type { Guest, Camera } from "../../types/guests";

import * as guests from "../../config/guests.json";
const GUESTS = guests.map((guest: Guest) => {
  if (!guest.displayName) guest.displayName = guest.id;
  guest.socialMedia.map((social) => ({ ...social, handle: guest.id }));
  guest.camera = "";
  return guest;
});

export default (nodecg: NodeCG) => {
  nodecg.log.info("Starting guests client...");

  // eslint-disable-next-line no-unused-vars
  const guests: Replicant<Array<Guest>> = nodecg.Replicant("guests", {
    defaultValue: GUESTS,
  });

  // eslint-disable-next-line no-unused-vars
  const cameras: Replicant<Array<Camera>> = nodecg.Replicant("cameras", {
    defaultValue: [
      { id: "cam1", name: "Guest 1" },
      { id: "cam2", name: "Guest 2" },
    ],
  });
};
