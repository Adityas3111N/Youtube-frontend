// Format seconds → hh:mm:ss
export const formatDuration = (totalSeconds) => {
  const sec = Math.floor(totalSeconds); // just in case it's not an integer
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;

  // padStart ensures two digits like 01, 09, etc.
  return [
    hours > 0 ? String(hours).padStart(2, "0") : null,
    String(minutes).padStart(2, "0"),
    String(seconds).padStart(2, "0"),
  ].filter(Boolean).join(":");
};


export const getRelativeTime = (date) => {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const now = new Date();
  const diff = (now - new Date(date)) / 1000; // in seconds

  const units = [
    { max: 60, value: 1, name: "second" },
    { max: 3600, value: 60, name: "minute" },
    { max: 86400, value: 3600, name: "hour" },
    { max: 2592000, value: 86400, name: "day" },
    { max: 31536000, value: 2592000, name: "month" },
    { max: Infinity, value: 31536000, name: "year" },
  ];

  for (const unit of units) {
    if (diff < unit.max) {
      const value = Math.floor(diff / unit.value) * -1;
      return rtf.format(value, unit.name);
    }
  }
};