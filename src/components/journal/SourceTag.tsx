// where an imported event came from.
import { url } from "../../lib/path";

interface Props {
  source: "gcal" | "notion";
  name: string;
}

const logos = {
  gcal: "/assets/logos/gcal.svg",
  notion: "/assets/logos/notion.svg",
} as const;

export default function SourceTag({ source, name }: Props) {
  return (
    <span className="source-tag">
      <img className="source-logo" src={url(logos[source])} alt="" width={16} height={16} />
      <span>{name}</span>
    </span>
  );
}
