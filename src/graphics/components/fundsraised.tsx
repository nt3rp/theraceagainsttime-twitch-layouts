import { h, FunctionComponent } from "preact";
import { useReplicant } from "use-nodecg";
import { Panel } from "./panel";
import "./css/fundsraised.css";

// TODO: Properties should be in layout, not here.
export const FundsRaised: FunctionComponent<any> = (props: any) => {
  const [campaign, _setCampaign]: [any, any] = useReplicant("campaign", {});
  return (
    <Panel {...props}>
      <span className="numerator">
        <span className="symbol">$</span>
        <span className="amount">
          {(campaign.amountRaised || 0).toFixed(2)}
        </span>
      </span>
      <span className="denominator">
        <span className="divider">/</span>
        <span className="current-goal">{campaign.fundraiserGoalAmount}</span>
        <span className="currenct">USD</span>
      </span>
    </Panel>
  );
};
