export function rand(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function fmtTime(d) {
  return d.toLocaleTimeString("en-IN", { hour12: false });
}
