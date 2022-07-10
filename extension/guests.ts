import { NodeCG, Replicant } from "nodecg-types/types/server"
const GUESTS = require("../config/guests.json").map((guest) => {
  if (!guest.displayName) guest.displayName = guest.id;
  guest.socialMedia.map((social) => ({ ...social, handle: guest.id }));
  guest.camera = "";
  return guest;
});

export interface SocialMedia {
  platform: string;
  handle: string;
}

export interface Guest {
  id: string;
  displayName?: string;
  socialMedia: Array<SocialMedia>;
  camera?: string;
}

export interface Camera {
  id: string;
  name: string;
}

export default (nodecg: NodeCG) => {
  nodecg.log.info("Starting guests client...");

  const guests: Replicant<Array<Guest>> = nodecg.Replicant("guests", {
    defaultValue: GUESTS,
  });

  const cameras: Replicant<Array<Camera>> = nodecg.Replicant("cameras", {
    defaultValue: [
      { id: "cam1", name: "Guest 1" },
      { id: "cam2", name: "Guest 2" },
    ],
  });
};
