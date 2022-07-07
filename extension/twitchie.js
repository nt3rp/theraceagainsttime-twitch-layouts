module.exports = (nodecg) => {
  const alertEvents = [
    "user.subscription",
    "user.subsciption.gift",
    "user.subscription.community",
    "user.hosted",
    "user.follower",
    "user.raid",
    "user.chat",
    "chat.message",
  ];

  const processEvent = (msgType, event) => {
    switch (msgType) {
      case "user.subscription":
        nodecg.sendMessage("event", {
          title: event.name || "(UNKNOWN)",
          description: `subscribed for ${event?.months} months`,
        });
        break;
      case "user.subsciption.gift":
        nodecg.sendMessage("event", {
          title: event?.gifterDisplayName || "(UNKNOWN)",
          description: `gifted a ${event?.months} subscription to ${event?.name}`,
        });
        break;
      case "user.subscription.community":
        nodecg.sendMessage("event", {
          title: event?.gifterDisplayName || "(UNKNOWN)",
          description: `gifted ${event?.count} subscriptions!`,
        });
        break;
      case "user.hosted":
        nodecg.sendMessage("event", {
          title: event?.byChannel || "(UNKNOWN)",
          description: `is saving the world!`,
          icon: "host",
          sound: "host",
        });
        break;
      case "user.follower":
        nodecg.sendMessage("event", {
          title: event?.from_name || "(UNKNOWN)",
          description: `joined the party!`,
          icon: "full-house",
          sound: "follow",
        });
        break;
      case "user.raid":
        nodecg.sendMessage("event", {
          title: event?.byChannel || "(UNKNOWN)",
          description: `is fighting Lavos with ${event?.viewers} allies`,
          icon: "full-house",
          sound: "raid",
        });
        break;
      case "chat.message":
        if (!event.message || !event.message.totalBits) return;
        nodecg.sendMessage("event", {
          title: event?.message?.user?.username || "(UNKNOWN)",
          description: `gave ${event?.message?.totalBits} bits`,
        });
        break;
    }
  };

  const createListener = (msgType) => {
    nodecg.listenFor(msgType, "nodecg-twitchie", (event) => {
      processEvent(msgType, event);
    });
  };

  alertEvents.forEach(createListener); // eslint-disable-line
};
