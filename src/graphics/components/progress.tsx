import { h, FunctionComponent } from "preact";
import "./css/progress-bar.css";

export interface Marker {
  id: string;
  value: number;
}

export interface ProgressBarProps {
  mode: "full" | "current" | "next";
  markers: Array<number> | Array<Marker>;
  value?: number;
  /* Something about labels? */
}

/* For now assume all progress bars are horizontal */
/* Given an array of points, decide which progress to show */
export const ProgressBar: FunctionComponent<ProgressBarProps> = ({
  markers,
  value,
}: ProgressBarProps) => {
  return (
    <div className="progress-bar">
      <div className="bar">
        <div className="cap left" />
        <div className="progress">
          <span className="value" style={{ width: `${value}%` }} />
        </div>
        <div className="cap right" />
      </div>
    </div>
  );
};
