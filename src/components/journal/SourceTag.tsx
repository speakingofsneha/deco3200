// where an imported event came from.
interface Props {
  source: "gcal" | "notion";
  name: string;
}

export default function SourceTag({ source, name }: Props) {
  return (
    <span className="source-tag">
      {source === "gcal" ? (
        <span className="gcal-logo" aria-hidden="true">
          <span className="gcal-edge gcal-edge--blue" />
          <span className="gcal-edge gcal-edge--red" />
          <span className="gcal-edge gcal-edge--green" />
          <span className="gcal-edge gcal-edge--yellow" />
          <span className="gcal-num">31</span>
        </span>
      ) : (
        <span className="notion-logo" aria-hidden="true">
          N
        </span>
      )}
      <span>{name}</span>
    </span>
  );
}
