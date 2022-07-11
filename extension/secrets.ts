import { diff, compare } from "./utils";

import type { NodeCG, Replicant } from "nodecg-types/types/server";
import type { Donation, Campaign } from "tiltify-api-client";

/*
SECRETS

Chat
- bew bew bewbewbew (basically, 5x tada or bew)
- Genesis, Phil Collins, Peter Gabriel
- Treatza pizza
- 1st: 10 folks in chat
- 1st: 20 folks in chat
- 1st: 30 folks in chat
- 1st: 40 folks in chat
- 1st: 5x Gift sub
- 1st: 10x Gift sub
- 1st: 20x Gift sub
- 1st: Raid
- 1st: 10 person raid
- 1st: 20 person raid
- 1st: 42 bits
- 1st: 69 bits
- 1st: 420 bits
- (Prometheus Circuit / Robo related?)
- (Starfox reference)
- (Hifumi / Danganronpa / ZE)
- (BABY -> Jay)
- (Buns)
- (Robo is best boi)
- (Berzerkayla?)
- (Umaro)

Game (manual buttons)
- Beat Frog Spekkio
- Beat Dragon Tank 1st time
- Beat Golem
- Save Fritz
- Not Guilty
- Boss skip
- Ozzie no fall
- Boss overflow kill

... Look at some of the previous achievements

... then reveal secret in dashboard?

*/
export interface Secret {
  name: string;
  description?: string;
  completedAt?: Date;
  subject: "donations" | "campaign";
  criteria: {
    comparator: "==" | ">=";
    value: any;
  };
}

export default (nodecg: NodeCG) => {
  const secrets: Replicant<Array<Secret>> = nodecg.Replicant("secrets", {
    defaultValue: [],
  });

  const donations: Replicant<Array<Donation>> = nodecg.Replicant("donations", {
    defaultValue: [],
  });

  const campaign: Replicant<Campaign | {}> = nodecg.Replicant("campaign", {
    defaultValue: {},
  });

  const maybeMeetCriteria = (value: any, secret: Secret): void => {
    const { name, criteria } = secret;
    const { comparator, value: threshold } = criteria;
    if (compare(comparator, value, threshold)) {
      secrets.value.find((secret) => {
        if (name !== secret.name) return false;
        secret.completedAt = new Date();
        // TODO: Fire event for front-end.
        return true;
      });
    }
  };

  donations.on("change", (newValue, oldValue) => {
    // Not sure of performance implications of this.
    const newValues = diff(newValue, oldValue);
    const unmetCriteria = secrets.value.filter(
      ({ completedAt, subject }) => !completedAt && subject === "donations"
    );

    newValues.forEach((donation) => {
      unmetCriteria.forEach((secret) => {
        maybeMeetCriteria(donation.amount, secret);
      });
    });
  });

  campaign.on("change", (newValue) => {
    const unmetCriteria = secrets.value.filter(
      ({ completedAt, subject }) => !completedAt && subject === "campaign"
    );

    unmetCriteria.forEach((secret) => {
      maybeMeetCriteria((newValue as Campaign).totalAmountRaised, secret);
    });
  });
};
