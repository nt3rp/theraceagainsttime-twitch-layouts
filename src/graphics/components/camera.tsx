import { h, FunctionComponent, ComponentChildren } from "preact";
import { useReplicant } from "use-nodecg";
import classNames from "classnames";
import type { Guest } from "../../../types/replicants";
import { copy } from "../../utils";
import "./css/camera.css";

export interface CameraProps {
  aspectRatio?: "fullscreen" | "widescreen" | "";
  children?: ComponentChildren;
}

export const Camera: FunctionComponent<CameraProps> = ({
  aspectRatio = "",
  children,
}: CameraProps) => {
  return <div className={classNames("camera", aspectRatio)}>{children}</div>;
};

export interface GuestCameraProps {
  id: string;
}

export const GuestCamera: FunctionComponent<GuestCameraProps & CameraProps> = ({
  id,
  aspectRatio,
}: GuestCameraProps & CameraProps) => {
  const [guestsReplicant, _setGuests]: [Array<Guest>, any] = useReplicant(
    "guests",
    []
  );
  const guests: Array<Guest> = copy(guestsReplicant);
  const guest: Guest | any = guests.find(({ camera }) => id === camera) || {};
  const url = `https://obs.ninja/?view=${guest.id}&scene&room=the_race_against_time_vii&noaudio`;
  // allow='autoplay' -> not valid?
  // allow="autoplay 'src'"
  // works in OBS?
  // properties need to be set on iframe itself?
  return (
    <Camera aspectRatio={aspectRatio}>
      <iframe src={url} />
      <div className="label">{guest.displayName}</div>
    </Camera>
  );
};
