import { h, FunctionComponent } from "preact";
import { useReplicant } from "use-nodecg";
import { Panel } from "./panel";
import { ProgressBar } from "./progress";
import { percent, copy } from "../../utils";
import type { Poll } from "../../../types/replicants";

export const PollComponent: FunctionComponent<any> = () => {
  const [pollsRep, _setPolls]: [Array<Poll>, any] = useReplicant("polls", []);
  const polls = copy(pollsRep);
  const activePoll = polls[0]; // .find(({ visible }) => visible === true);

  // create markers from activePoll
  let title, pollOptions;
  if (activePoll !== undefined) {
    title = activePoll.name;
    const total = activePoll.options.reduce(
      (acc, { totalAmountRaised }) => acc + totalAmountRaised,
      0
    );
    pollOptions = activePoll.options.map(({ id, name, totalAmountRaised }) => {
      return (
        <ProgressBar
          key={id}
          markers={[{ id: `${id}`, value: total }]}
          mode="prev-next"
          value={totalAmountRaised}
          labelFn={(el, index, arr) => {
            if (index === 0)
              return `${percent(totalAmountRaised, total).toFixed(1)}%`;
            if (index === arr.length - 1) return name;
            return undefined;
          }}
        />
      );
    });
  }

  return (
    <Panel classNames="distributed vertically">
      {[<div key="title">{title}</div>, pollOptions]}
    </Panel>
  );
};
