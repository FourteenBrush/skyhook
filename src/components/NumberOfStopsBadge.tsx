import Badge from "@/components/Badge"

export default function NumberOfStopsBadge({ stops }: { stops: number }) {
  const isDirect = stops === 0

  return (
    <Badge kind={isDirect ? "dark" : "light"} accessibilityLabel="number of stops">{
      isDirect ? "Direct" : `${stops} ${stops === 1 ? "stop" : "stops"}`
    }</Badge>
  )
}
