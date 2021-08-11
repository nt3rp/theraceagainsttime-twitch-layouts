import { h, FunctionComponent } from "preact";
import { useReplicant } from "use-nodecg";
import classNames from "classnames";
import type { Guest } from "../../../types/replicants";
import { copy } from "../../utils";
import "./css/camera.css";

export const Camera: FunctionComponent<any> = (props: any) => {
  return (
    <div {...props} className={classNames("camera", props.aspectRatio)}>
      {props.children}
    </div>
  );
};

export const GuestCamera: FunctionComponent<any> = (props: any) => {
  const [guestsReplicant, _setGuests]: [Array<Guest>, any] = useReplicant(
    "guests",
    []
  );
  const guests: Array<Guest> = copy(guestsReplicant);
  const guest: Guest | any =
    guests.find(({ camera }) => props.cameraId === camera) || {};
  const url = `https://obs.ninja/?view=${guest.id}&scene&room=the_race_against_time_vii&noaudio`;
  // allow='autoplay' -> not valid?
  // allow="autoplay 'src'"
  // works in OBS?
  // properties need to be set on iframe itself?
  return (
    <Camera {...props} aspectRatio={props.aspectRatio}>
      <iframe src={url} />
      <div className="label">{guest.displayName}</div>
    </Camera>
  );
};
