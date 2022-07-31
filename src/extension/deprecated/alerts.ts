/*

  // Group similar functions together
  const onSubscribe = (
    channel: string,
    recipient: string,
    info:
      | ChatCommunitySubInfo
      | ChatPrimeCommunityGiftInfo
      | ChatSubExtendInfo
      | ChatSubInfo
      | ChatSubGiftInfo
      | ChatSubGiftUpgradeInfo
      | ChatSubUpgradeInfo
  ) => {
    console.dir(info);
    console.log(`#${channel} ${recipient}`);
    // const unmetCriteria = secrets.value.filter(
    //   ({ completedAt, subject }) => !completedAt && subject === "subscription"
    // );

    if (isChatCommunitySubInfo(info)) {
    } else if (isChatSubExtendInfo(info)) {
    } else if (isChatSubInfo(info)) {
    } else if (isChatSubGiftInfo(info)) {
    } else if (isChatSubGiftUpgradeInfo(info)) {
    } else if (isChatSubUpgradeInfo(info)) {
    } else {
      // ChatPrimeCommunityGiftInfo
    }

    // unmetCriteria.forEach((secret) => maybeMeetCriteria(message, secret));
  };

  twitch.chat.onSub(onSubscribe);
  twitch.chat.onResub(onSubscribe);
  twitch.chat.onSubExtend(onSubscribe);
  twitch.chat.onSubGift(onSubscribe);
  twitch.chat.onCommunitySub(onSubscribe);
  twitch.chat.onGiftPaidUpgrade(onSubscribe);
*/
