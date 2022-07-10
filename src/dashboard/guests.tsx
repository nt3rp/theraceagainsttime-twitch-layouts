import { h, render, FunctionComponent } from "preact";
import { useCallback } from "preact/hooks";
import { useReplicant } from "use-nodecg";
import type { Guest, Camera } from "../../@types/guests";

const GuestsPanel: FunctionComponent<any> = () => {
  const [guests, setGuests]: [Array<Guest>, any] = useReplicant("guests", []);
  const [cameras, _setCameras]: [Array<Camera>, any] = useReplicant(
    "cameras",
    []
  );

  const selectCamera = useCallback(
    (guestId: string, e: any) => {
      const cameraId = e.target.value;
      // Update the relevant guest.
      const guest: Guest | any = guests.find(({ id }) => id === guestId);
      guest.camera = cameraId;
      // Clear the camera from others.
      if (cameraId !== "") {
        guests.forEach((c) => {
          if (c.camera === cameraId) {
            c.camera = "";
          }
        });
      }
      setGuests(guests);
    },
    [guests]
  );

  return (
    <table style={{ width: "100%" }}>
      <thead>
        <th>Camera</th>
        <th>Display Name</th>
      </thead>
      <tbody>
        {guests.map((guest: Guest) => (
          <tr key={guest.id}>
            <td>
              <select
                value={guest.camera}
                onChange={(e) => selectCamera(guest.id, e)}
              >
                <option value="">Off Camera</option>
                {cameras.map((camera: Camera) => (
                  <option key={camera.id} value={camera.id}>
                    {camera.name}
                  </option>
                ))}
              </select>
            </td>
            <td>{guest.displayName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const root = document.getElementById("container")!;
render(<GuestsPanel />, root);
