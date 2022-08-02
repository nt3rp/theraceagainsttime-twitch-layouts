import { h, FunctionComponent } from "preact";
import { useReplicant } from "use-nodecg";
import classNames from "classnames";
import { copy } from "../../utils";

import type { Guest } from "../../types/events";

import "./css/camera.css";

export const Camera: FunctionComponent<any> = (props: any) => {
  return (
    <div {...props} className={classNames("camera", props.aspectRatio)}>
      {props.children}
    </div>
  );
};

export const GuestCamera: FunctionComponent<any> = (props: any) => {
  const [guests, _setGuests]: [Array<Guest>, any] = useReplicant("guests", []);
  const guest = guests.find(({ live }) => live);

  if (guest === undefined) return <div />;

  const { id, display } = guest;
  const url = `https://vdo.ninja/?view=${id}&scene&room=the_race_against_time_viii&noaudio`;
  return (
    <Camera {...props} aspectRatio={props.aspectRatio}>
      <iframe src={url} />
      <div className="label">{display ?? id}</div>
    </Camera>
  );
};
