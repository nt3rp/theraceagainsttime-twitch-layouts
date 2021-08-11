import { h, FunctionComponent } from "preact";
import { useReplicant } from "use-nodecg";
import { Panel } from "./panel";
import "./css/fundsraised.css";

// TODO: Properties should be in layout, not here.
export const FundsRaised: FunctionComponent<any> = () => {
  const [campaign, _setCampaign]: [any, any] = useReplicant("campaign", {});
  return (
    <Panel
      properties={{
        classes: "fundsraised",
        props: {
          style: {
            position: "absolute",
            bottom: "0px",
            right: "0px",
            height: "114px",
            width: "250px",
          },
        },
      }}
    >
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
