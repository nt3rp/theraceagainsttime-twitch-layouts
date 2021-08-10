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
  /* Something about labels? */
}

/* For now assume all progress bars are horizontal */
/* For now assume markers are sorted */
export const ProgressBar: FunctionComponent<ProgressBarProps> = ({
  mode,
  markers,
  value,
}: ProgressBarProps) => {
  const height = "20px";
  const width = "10px";

  if (!markers.find(({ value }) => value < 1))
    markers.unshift({ id: "minimum", value: 0 });

  switch (mode) {
    case "prev-next": {
      const nextIndex = Math.min(
        markers.findIndex((m) => m.value > value),
        markers.length - 1
      );
      const prevIndex = Math.max(nextIndex - 1, 0);
      markers = markers.slice(prevIndex, nextIndex + 1);
      console.log(markers);
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

  const min = markers[0];
  const [max] = markers.slice(-1);
  const scale = max.value - min.value;

  return (
    <div className="progress-bar">
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
                top: `calc(50% - (${height} / 2))`,
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
    </div>
  );
};
