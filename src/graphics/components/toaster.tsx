/* Could not figure out how to do this in the hooks way.
Copied from last year. */
import { h, Component, Fragment } from "preact";
import { Panel } from "./panel";

import "./css/toaster.css";
import "./css/events.css";

export class Toaster extends Component<any> {
  toasts = (window as any).nodecg.Replicant("events");

  state = {
    toast: undefined,
    toasts: [],
    visible: false,
    sound: undefined,
  };

  componentDidMount() {
    this.toasts.on("change", this.onToastsChange);
  }

  onToastsChange = (newToasts: any) => {
    if (newToasts === undefined) return;
    this.setState({ toasts: newToasts });
  };

  componentDidUpdate(prevProps: any, prevState: any, snapshot: any) {
    if (
      !this.state.toast &&
      this.state.toasts.filter((t: any) => !t.shown).length > 0
    ) {
      this.toast();
    }
  }

  toast = () => {
    // get the latest oldest untoaste
    const toast: any = this.state.toasts.find((t: any) => !t.shown);
    if (!toast) return;
    let sound;
    const sfx = toast.sound || "generic";
    if (sfx && (window as any).nodecg.findCue(sfx)) {
      sound = (window as any).nodecg.playSound(sfx);
    }
    this.setState({ visible: true, toast, sound });
    toast.shown = true;
    this.toasts.value = this.state.toasts;
  };

  renderToast = ({ id, title, description }: any) => {
    return (
      <Fragment>
        <div className={`icon ${id}`} />
        <div className="text">
          <div className="title">{title}</div>
          <div className="description">{description}</div>
        </div>
      </Fragment>
    );
  };

  onTransitionEnd = () => {
    if (this.state.visible) {
      setTimeout(() => {
        this.setState({ visible: false });
      }, this.props.duration);
    } else {
      // TODO: Define fadeout / fancier change instead of hard stop.
      this.state.sound && (this.state.sound as any).stop();
      this.setState({ toast: undefined, sound: undefined });
    }
  };

  render() {
    return (
      <Panel
        className={`toaster event ${this.state.visible ? "show" : "hide"}`}
        onTransitionEnd={this.onTransitionEnd}
        style={this.props.style}
      >
        {this.state.toast ? this.renderToast(this.state.toast) : ""}
      </Panel>
    );
  }
}

export default Toaster;
