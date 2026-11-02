// time and the device icons. the screens sit underneath.
import { url } from "../../lib/path";
interface Props {
  time: string;
}

export default function StatusBar({ time }: Props) {
  return (
    <div className="status" aria-hidden="true">
      <span className="status-time">{time}</span>
      <span className="status-icons">
        <img src={url("/assets/signal.svg")} width={18.5} height={12.5} alt="" />
        <img src={url("/assets/wifi.svg")} width={18} height={14} alt="" />
        <img src={url("/assets/battery.svg")} width={27} height={14} alt="" />
      </span>
    </div>
  );
}
