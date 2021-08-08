import { h, render, FunctionComponent, Fragment } from "preact";
import { useReplicant } from "use-nodecg";
import { useCallback } from "preact/hooks";
import type { Achievement, Checkpoint } from "../../types/replicants";
import type { Changeable } from "../../types/events";

const copy = (obj: any) => JSON.parse(JSON.stringify(obj));

const CheckpointRow: FunctionComponent<Checkpoint & Changeable> = ({
  id,
  title,
  endingId,
  onChange,
}: Checkpoint & Changeable) => {
  const [achievements, _setAchievements]: [
    Array<Achievement>,
    any
  ] = useReplicant("achievements", []);

  // Pull the endings from the achievements.
  const endings = copy(achievements).filter((a) => a.tags.includes("ending"));
  const endingSelector = (
    <select value={endingId} onChange={(e) => onChange(id, e)}>
      {endings.map((e) => {
        return (
          <option key={e.id} value={e.id}>
            {e.title}
          </option>
        );
      })}
    </select>
  );

  return (
    <tr>
      {/* Icon */}
      {/* Title */}
      {/* Drop-down (endings only) */}
      {/* Current time / Not started / In progress */}
      {/* Section time vs overall vs max / min? */}
      <td className="title">{title}</td>
      <td className="ending">{endingId === undefined ? "" : endingSelector}</td>
      <td className="time">Current Time</td>
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
    <Fragment>
      <div className="time-control" />
      <table className="checkpoints">
        {checkpoints.map((c) => (
          <CheckpointRow key={c.id} {...c} onChange={onChange} />
        ))}
      </table>
    </Fragment>
  );
};

const root = document.getElementById("container");
render(<CheckpointsPanel />, root);
