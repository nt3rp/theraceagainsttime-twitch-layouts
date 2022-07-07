import { h, render, FunctionComponent } from "preact";
import { useReplicant } from "use-nodecg";
import { useCallback } from "preact/hooks";
import classNames from "classnames";
import { copy, calculateSplits, toHms } from "../utils";
import type { Achievement, Checkpoint, Timer } from "../../types/replicants";
import type { Changeable } from "../../types/events";

const DEFAULT_TIMER: Timer = {
  splits: [],
  checkpoint: undefined,
  state: "paused",
};

const CheckpointRow: FunctionComponent<Checkpoint & Changeable> = ({
  id,
  title,
  endingId,
  completed,
  splits,
  onChange,
}: Checkpoint & Changeable) => {
  const [timerReplicant, _setTimer] = useReplicant("timer", DEFAULT_TIMER);
  const [achievements, _setAchievements] = useReplicant("achievements", []);
  const timer = copy(timerReplicant);

  // Pull the endings from the achievements.
  const endings = copy(achievements).filter((a: Achievement) =>
    a.tags.includes("ending")
  );
  const endingSelector = (
    <select value={endingId} onChange={(e) => onChange(id, e)}>
      {endings.map((e: Achievement) => {
        return (
          <option key={e.id} value={e.id}>
            {e.title}
          </option>
        );
      })}
    </select>
  );

  const active = id === timer.checkpoint;
  return (
    <tr className={classNames({ completed, active })}>
      {/* Icon */}
      {/* Section time vs overall vs max / min? */}
      <td className="title">{title}</td>
      <td className="ending">{endingId === undefined ? "" : endingSelector}</td>
      <td className="time">
        {completed ? toHms(calculateSplits(splits)) : active ? "🔄" : "🚧"}
      </td>
    </tr>
  );
};

const CheckpointsPanel: FunctionComponent<any> = () => {
  const [checkpoints, setCheckpoints]: [Array<Checkpoint>, any] = useReplicant(
    "checkpoints",
    []
  );

  const onChange = useCallback(
    (id: string, event: any) => {
      const endingId = event.target.value;
      const title = event.target[event.target.selectedIndex].text;
      const copied: Array<Checkpoint> = copy(checkpoints);
      // NOTE: This modifies the array in place.
      copied.find((checkpoint) => {
        if (checkpoint.id !== id) return false;
        checkpoint.endingId = endingId;
        checkpoint.title = title;
        return true;
      });
      setCheckpoints(copied);
    },
    [checkpoints]
  );

  return (
    <table className="checkpoints" style={{ width: "100%" }}>
      {checkpoints.map((c) => (
        <CheckpointRow key={c.id} {...c} onChange={onChange} />
      ))}
    </table>
  );
};

const root = document.getElementById("container");
render(<CheckpointsPanel />, root);
