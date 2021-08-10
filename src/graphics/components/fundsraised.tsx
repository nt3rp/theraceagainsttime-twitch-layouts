import { h, FunctionComponent } from "preact";
import { useReplicant } from "use-nodecg";
import { Panel } from "./panel";

export const FundsRaised: FunctionComponent<any> = () => {
  const [campaign, _setCampaign]: [any, any] = useReplicant("campaign", {});
  return (
    <Panel classNames="fundsraised">
      <span className="symbol">$</span>
      <span className="amount">{campaign.amountRaised}</span>
      <span className="divider">/</span>
      <span className="current-goal">{campaign.fundraiserGoalAmount}</span>
      <span className="currenct">USD</span>
    </Panel>
  );
};
