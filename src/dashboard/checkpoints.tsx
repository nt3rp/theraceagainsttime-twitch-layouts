import { h, render, FunctionComponent } from "preact";
import { useReplicant } from "use-nodecg";
import classNames from "classnames";

import { copy, calculateSplits, toHms } from "../utils";

import type { Timer, Checkpoint } from "../types/events";

const DEFAULT_TIMER: Timer = {
  splits: [],
  checkpoint: undefined,
  state: "paused",
};

const CheckpointRow: FunctionComponent<Checkpoint> = ({
  id,
  title,
  completed,
  splits,
}: Checkpoint) => {
  const [timerReplicant, _setTimer] = useReplicant("timer", DEFAULT_TIMER);
  const timer = copy(timerReplicant);

  const active = id === timer.checkpoint;
  return (
    <tr className={classNames({ completed, active })}>
      {/* Icon */}
      {/* Section time vs overall vs max / min? */}
      <td className="title">{title}</td>
      <td className="time">
        {completed ? toHms(calculateSplits(splits)) : active ? "🔄" : "🚧"}
      </td>
    </tr>
  );
};

const CheckpointsPanel: FunctionComponent<any> = () => {
  const [checkpoints, _setCheckpoints]: [Array<Checkpoint>, any] = useReplicant(
    "checkpoints",
    []
  );

  return (
    <table className="checkpoints" style={{ width: "100%" }}>
      {checkpoints.map((c) => (
        <CheckpointRow key={c.id} {...c} />
      ))}
    </table>
  );
};

const root = document.getElementById("container")!;
render(<CheckpointsPanel />, root);
