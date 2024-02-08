type HighlightedProps = {
  text: string;
  highlight: string;
};

export default function Highlighted({
  text = "",
  highlight = "",
}: HighlightedProps) {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(
    `(${highlight
      .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
      .replaceAll("(", "\\(")
      .replaceAll(")", "\\)")
      .replace(/e/gi, "[eèéêë]")
      .replace(/c/gi, "[cç]")
      .replace(/i/gi, "[iîï]")
      .replace(/u/gi, "[uùûü]")
      .replace(/y/gi, "[yÿ]")
      .replace(/a/gi, "[aàâä]")
      .replace(/o/gi, "[oôö]")})`,
    "gi",
  );
  const parts = text.split(regex);

  return (
    <span>
      {parts.filter(String).map((part, i) => {
        return regex.test(part) ? (
          <b key={i}>{part}</b>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </span>
  );
}
