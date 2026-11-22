// Sample data and small helpers. Replace this with real data (an API) later.
export const LABS = ["Computer Lab 1", "Computer Lab 2", "Computer Lab 3"];

const H = 36e5;
export const DAY = 864e5;

const NAMES = [
  ["Nicole Garcia", "BSIT"], ["Charles Flores", "BSIT"], ["Angela M. Santos", "BSCS"],
  ["Joshua Villanueva", "BSCS"], ["Mika Reyes", "BSIT"], ["Paolo Cruz", "BSIS"],
  ["Lea Mendoza", "BSCS"], ["Daniel Ramos", "BSIS"], ["Sofia Navarro", "BSIT"],
  ["Ethan Bautista", "BSCS"], ["Hannah Lim", "BSIT"], ["Marco Dizon", "BSIS"],
];

export const STUDENTS = NAMES.map(([name, course], i) => ({
  id: i + 1,
  name,
  course,
  year: (i % 4) + 1,
  email: name.split(" ")[0].toLowerCase() + "@school.edu",
}));

// A few days of past attendance, plus some students still inside a lab today.
export function makeRecords() {
  const now = Date.now();
  const startOfToday = new Date().setHours(0, 0, 0, 0);
  const records = [];
  let id = 1;
  for (let d = 5; d >= 0; d--) {
    STUDENTS.forEach((s, i) => {
      if ((i * 7 + d * 3) % 5 === 0) return; // this student was absent
      let timeIn = startOfToday - d * DAY + (8 + ((i + d) % 6)) * H + i * 6e5;
      let timeOut = timeIn + (1 + ((i + d) % 3)) * H;
      if (d === 0) {
        timeIn = now - (i + 1) * 17 * 6e4;
        timeOut = i % 3 === 0 ? null : Math.min(now, timeIn + 40 * 6e4);
      }
      records.push({ id: id++, studentId: s.id, lab: (i + d) % 3, timeIn, timeOut });
    });
  }
  return records;
}

export const initials = (name) =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("");

export const fmtTime = (t) =>
  t ? new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "–";

export const fmtDate = (t) =>
  new Date(t).toLocaleDateString([], { month: "short", day: "numeric" });

export const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();

export function duration(from, to) {
  const m = Math.max(0, Math.round(((to || Date.now()) - from) / 6e4));
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
}

export function timeAgo(t) {
  const m = Math.round((Date.now() - t) / 6e4);
  if (m < 1) return "just now";
  return m < 60 ? `${m} min ago` : `${Math.round(m / 60)} h ago`;
}

// Per-day totals for the last n days (students = unique students, sessions = scans in).
export function lastDays(records, n) {
  return Array.from({ length: n }, (_, i) => {
    const t = Date.now() - (n - 1 - i) * DAY;
    const day = records.filter((r) => sameDay(r.timeIn, t));
    return {
      label: new Date(t).toLocaleDateString("en-US", { weekday: "short" }),
      students: new Set(day.map((r) => r.studentId)).size,
      sessions: day.length,
    };
  });
}
