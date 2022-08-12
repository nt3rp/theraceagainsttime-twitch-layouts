import { h, render, Fragment } from "preact";
import { useReplicant } from "use-nodecg";
import { useCallback, useState } from "preact/hooks";
import classNames from "classnames";
import { copy, toHms, calculateSplits } from "../utils";
import { useInterval } from "../hooks";
import { Checkpoint, Timer } from "../types/events";

const DEFAULT_TIMER: Timer = {
  splits: [],
  checkpoint: undefined,
  state: "paused",
};

// Can we move the timer logic into extension?
const TimerPanel = () => {
  const [duration, setDuration] = useState(0);
  const [timerReplicant, _setTimer] = useReplicant("timer", DEFAULT_TIMER);
  const [checkpointsReplicant, _setCheckpoints] = useReplicant(
    "checkpoints",
    []
  );

  // TODO: Remove these when replicant returns immutable copy.
  const timer: Timer = copy(timerReplicant);
  const checkpoints: Array<Checkpoint> = copy(checkpointsReplicant);

  const current: any =
    checkpoints.find((c: Checkpoint) => c.id === timer.checkpoint) || {};
  const currentIndex = checkpoints.findIndex(
    (c: Checkpoint) => c.id === timer.checkpoint
  );
  const nextCheckpoint =
    currentIndex + 1 <= checkpoints.length - 1
      ? checkpoints[currentIndex + 1]
      : undefined;

  // Is this overkill to calculate the time? Yes, but it works...
  // TODO: Make this into a function.
  useInterval(
    () => {
      const length = (current.splits || []).length;
      if (length === 0) return;
      const limit = length % 2 === 0 ? length : length - 1;
      const previousSplits = current.splits.slice(0, limit);
      const newDuration = calculateSplits(previousSplits);
      const [start] = current.splits.slice(-1);
      setDuration((newDuration || 0) + (Date.now() - start));
    },
    timer.state !== "paused" ? 1000 : null
  );

  const canPlayPause = currentIndex !== -1;
  const canAdvance =
    currentIndex === -1 ||
    (timer.state !== "paused" && nextCheckpoint !== undefined);

  return (
    <Fragment>
      <div className="controls distributed">
        {/* Show global time, currentIndex time, currentIndex checkpoint with icon */}
        <div className="distributed vertically">
          <span className="title">{current.title}</span>
          <span
            className={classNames({
              time: true,
              paused: timer.state === "paused",
            })}
          >
            {toHms(duration)}
          </span>
        </div>
        <span
          className={classNames({ button: true, disabled: !canPlayPause })}
          onClick={() => {
            canPlayPause && nodecg.sendMessage("timer.pause");
          }}
        >
          {timer.state === "paused" ? "▶️" : "⏸"}
        </span>
        <span
          className={classNames({ button: true, disabled: !canAdvance })}
          onClick={() => {
            canAdvance && nodecg.sendMessage("timer.advance");
          }}
        >
          ⏭
        </span>
      </div>
    </Fragment>
  );
};

const root = document.getElementById("container")!;
render(<TimerPanel />, root);
