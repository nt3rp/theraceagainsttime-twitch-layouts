import { h, FunctionComponent } from "preact";
import { useReplicant } from "use-nodecg";
import classNames from "classnames";
import { copy } from "../../utils";
import "./css/camera.css";
import { Guest } from "../../../extension/guests"

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
    guests.find(({ camera }) => props.cameraId === camera) || undefined;

  if (guest === undefined) return <div />;

  const url = `https://obs.ninja/?view=${guest.id}&scene&room=the_race_against_time_vii&noaudio`;
  return (
    <Camera {...props} aspectRatio={props.aspectRatio}>
      <iframe src={url} />
      <div className="label">{guest.displayName}</div>
    </Camera>
  );
};
