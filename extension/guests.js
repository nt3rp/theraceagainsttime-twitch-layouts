const GUESTS = require("../config/guests.json").map((guest) => {
  if (!guest.displayName) guest.displayName = guest.id;
  guest.socialMedia.map((social) => ({ ...social, handle: guest.id }));
  guest.camera = "";
  return guest;
});

module.exports = (nodecg) => {
  nodecg.log.info("Starting guests client...");

  nodecg.Replicant("guests", {
    defaultValue: GUESTS,
  });

  nodecg.Replicant("cameras", {
    defaultValue: [
      { id: "cam1", name: "Guest 1" },
      { id: "cam2", name: "Guest 2" },
    ],
  });
};
