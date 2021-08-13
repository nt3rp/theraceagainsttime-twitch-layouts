import { h, FunctionComponent } from "preact";
import { percent } from "../../utils";
import "./css/progress-bar.css";

export interface Marker {
  id: string;
  value: number;
}

export interface ProgressBarProps {
  mode: "full" | "prev-next" | "to-next";
  markers: Array<Marker>;
  value?: number;
  labelFn?: (el, index, array) => string; // eslint-disable-line no-unused-vars
}

/* For now assume all progress bars are horizontal */
/* For now assume markers are sorted */
export const ProgressBar: FunctionComponent<any> = ({
  mode,
  markers,
  value,
  labelFn,
  className,
}: any) => {
  const labelWidth = "3em";
  const labelHeight = "1em";
  const height = "10px";
  const width = "10px";

  if (markers.length === 1 || !markers.find(({ value }) => value < 1))
    markers.unshift({ id: "minimum", value: 0 });

  if (markers.length > 2) {
    switch (mode) {
      case "prev-next": {
        const nextIndex = Math.min(
          markers.findIndex((m) => m.value > value),
          markers.length - 1
        );
        const prevIndex = Math.max(nextIndex - 1, 0);
        markers = markers.slice(prevIndex, nextIndex + 1);
        break;
      }
      case "to-next": {
        const nextIndex = Math.min(
          markers.findIndex((m) => m.value > value),
          markers.length - 1
        );
        markers = markers.slice(0, nextIndex + 1);
        break;
      }
    }
  }

  const min = markers[0];
  const [max] = markers.slice(-1);
  const scale = max.value - min.value;

  return (
    <div className={`progress-bar ${className}`}>
      <div className="bar">
        <div className="cap left" />
        <div className="progress">
          {markers.map((m) => (
            <span
              key={m.id}
              className="marker"
              style={{
                width,
                height,
                top: `calc(50% - (${height} / 2) - 1px)`,
                left: `calc(${percent(
                  m.value - min.value,
                  scale
                )}% - (${width} / 2))`,
              }}
            />
          ))}
          <span
            className="value"
            style={{ width: `${percent(value - min.value, scale)}%` }}
          />
        </div>
        <div className="cap right" />
      </div>
      <div className="labels" style={{ height: labelHeight }}>
        {markers.map((m, index, arr) => (
          <span
            key={m.id}
            className="label"
            style={{
              width: labelWidth,
              height: labelHeight,
              top: `calc(50% - (${labelHeight} / 2))`,
              left: `calc(${percent(
                m.value - min.value,
                scale
              )}% - ${labelWidth})`,
            }}
          >
            {labelFn !== undefined ? labelFn(m, index, arr) : m.value}
          </span>
        ))}
      </div>
    </div>
  );
};
