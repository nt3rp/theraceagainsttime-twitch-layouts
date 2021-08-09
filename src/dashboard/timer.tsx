import { h, render, Fragment } from "preact";
import { useReplicant } from "use-nodecg";
import { useCallback } from "preact/hooks";
import classNames from "classnames";
import { copy } from "../utils";
import type { Checkpoint, Timer } from "../../types/replicants";

const DEFAULT_TIMER: Timer = {
  splits: [],
  checkpoint: undefined,
  state: "paused",
};

const TimerPanel = () => {
  const [timerReplicant, setTimer] = useReplicant("timer", DEFAULT_TIMER);
  const [checkpointsReplicant, setCheckpoints] = useReplicant(
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

  // TODO: Find a way to clean up these methods.
  const onPlayPause = useCallback(() => {
    const now = Date.now();
    setTimer({
      ...timer,
      splits: [...timer.splits, now],
      state: timer.state === "paused" ? "playing" : "paused",
    });
    checkpoints[currentIndex].splits.push(now);
    setCheckpoints(checkpoints);
  }, [currentIndex, timer, checkpoints]);

  const onAdvance = useCallback(() => {
    const now = Date.now();
    const splits = currentIndex === -1 ? [now] : [now, now];
    setTimer({
      ...timer,
      splits: [...timer.splits, ...splits],
      state: "playing",
      checkpoint: nextCheckpoint.id,
    });
    if (currentIndex <= -1) {
      checkpoints[0].splits.push(now);
    } else {
      checkpoints[currentIndex].splits.push(now);
      if (nextCheckpoint !== undefined)
        checkpoints[currentIndex + 1].splits.push(now);
      checkpoints[currentIndex].completed = true;
    }
    setCheckpoints(checkpoints);
  }, [currentIndex, nextCheckpoint, timer, checkpoints]);

  // TODO: Tick the timer.

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
          <span className="time">00:00:00</span>
        </div>
        <span
          className={classNames({ button: true, disabled: !canPlayPause })}
          onClick={canPlayPause && onPlayPause}
        >
          {timer.state === "paused" ? "▶️" : "⏸"}
        </span>
        <span
          className={classNames({ button: true, disabled: !canAdvance })}
          onClick={canAdvance && onAdvance}
        >
          ⏭
        </span>
      </div>
    </Fragment>
  );
};

const root = document.getElementById("container");
render(<TimerPanel />, root);
