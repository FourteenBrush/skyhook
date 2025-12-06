/** Returns a duration string in `<hh>h <mm>m` format */
export const formatDurationToReadable = (d: Date) => {
  // because DateTimeFormat is broken with respect to ignoring leading zeroes
  return `${d.getUTCHours()}h ${d.getUTCMinutes()}m`
}

export const formatTime = (time: Date) => time.toLocaleTimeString(undefined, { timeStyle: "short" })

export const formatDuration = (dur: Date) => dur.toLocaleTimeString(undefined, { timeStyle: "short", timeZone: "UTC" })
