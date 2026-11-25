import { useOutletContext, Link } from "react-router-dom";
import { Users, Check, FileText, Clock, TrendingUp, Calendar } from "lucide-react";
import { Card, PageHeader, Avatar, WeekChart } from "../ui";
import { LABS, sameDay, timeAgo, lastDays } from "../data";

export default function Dashboard() {
  const { students, records, nameOf } = useOutletContext();
  const now = Date.now();
  const presentToday = new Set(records.filter((r) => sameDay(r.timeIn, now)).map((r) => r.studentId)).size;

  const stats = [
    { label: "Registered students", value: students.length, trend: "3.2%", icon: Users, tone: "bg-emerald-50 text-emerald-600" },
    { label: "Present today", value: presentToday, trend: "8.4%", icon: Check, tone: "bg-sky-50 text-sky-600" },
    { label: "Attendance records", value: records.length, trend: "8.1%", icon: FileText, tone: "bg-slate-100 text-slate-600" },
    { label: "Absent today", value: Math.max(0, students.length - presentToday), trend: "1.4%", icon: Clock, tone: "bg-amber-50 text-amber-600" },
  ];

  const events = records
    .flatMap((r) => [{ t: r.timeIn, r, k: "in" }, ...(r.timeOut ? [{ t: r.timeOut, r, k: "out" }] : [])])
    .sort((a, b) => b.t - a.t)
    .slice(0, 5);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of today’s laboratory attendance activity.">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium">
          <Calendar className="h-4 w-4 text-slate-500" />
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </div>
      </PageHeader>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, trend, icon: Icon, tone }) => (
          <Card key={label}>
            <div className="flex items-start justify-between">
              <div className={`grid h-11 w-11 place-items-center rounded-xl ${tone}`}><Icon className="h-5 w-5" /></div>
              <span className="flex items-center gap-1 text-xs font-semibold text-brand"><TrendingUp className="h-3.5 w-3.5" />{trend}</span>
            </div>
            <p className="mt-5 text-3xl font-bold">{value.toLocaleString()}</p>
            <p className="mt-1 text-slate-500">{label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-bold">Weekly attendance</h2>
          <p className="mb-5 text-sm text-slate-500">Students present per day</p>
          <WeekChart week={lastDays(records, 6)} />
        </Card>
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold">Recent activity</h2>
              <p className="text-sm text-slate-500">Latest QR scan events</p>
            </div>
            <Link to="/live" className="text-sm font-semibold text-brand hover:underline">View live</Link>
          </div>
          <ul className="mt-3 divide-y divide-slate-100">
            {events.map((e, i) => (
              <li key={i} className="flex items-center gap-3 py-3">
                <Avatar name={nameOf(e.r.studentId)} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{nameOf(e.r.studentId)}</p>
                  <p className="truncate text-sm text-slate-500">scanned {e.k} of {LABS[e.r.lab]}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-400">{timeAgo(e.t)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
