// time and the device icons. the screens sit underneath.
interface Props {
  time: string;
}

export default function StatusBar({ time }: Props) {
  return (
    <div className="status" aria-hidden="true">
      <span className="status-time">{time}</span>
      <span className="status-icons">
        <img src="/assets/signal.svg" width={18.5} height={12.5} alt="" />
        <img src="/assets/wifi.svg" width={18} height={14} alt="" />
        <img src="/assets/battery.svg" width={27} height={14} alt="" />
      </span>
    </div>
  );
}
