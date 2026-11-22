import { useOutletContext } from "react-router-dom";
import { Card, PageHeader, WeekChart } from "../ui";
import { LABS, lastDays, duration } from "../data";

export default function Reports() {
  const { records } = useOutletContext();
  const week = lastDays(records, 6);
  const avgDaily = week.reduce((a, d) => a + d.students, 0) / week.length;
  const finished = records.filter((r) => r.timeOut);
  const avgMs = finished.length ? finished.reduce((a, r) => a + (r.timeOut - r.timeIn), 0) / finished.length : 0;
  const perLab = LABS.map((name, i) => ({ name, count: records.filter((r) => r.lab === i).length }));
  const top = [...perLab].sort((a, b) => b.count - a.count)[0];

  const stats = [
    { label: "Total sessions", value: records.length },
    { label: "Average daily attendance", value: avgDaily.toFixed(1) },
    { label: "Average session length", value: duration(0, avgMs) },
    { label: "Busiest laboratory", value: top.name },
  ];

  return (
    <>
      <PageHeader title="Reports" subtitle="Attendance averages and totals across the laboratories." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <p className="text-slate-500">{s.label}</p>
            <p className="mt-2 text-2xl font-bold">{s.value}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-5 text-lg font-bold">Attendance over the last 6 days</h2>
          <WeekChart week={week} />
        </Card>
        <Card>
          <h2 className="mb-2 text-lg font-bold">Sessions per laboratory</h2>
          {perLab.map((l) => (
            <div key={l.name} className="mt-4">
              <div className="flex justify-between text-sm"><span>{l.name}</span><b>{l.count}</b></div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-brand-light">
                <div className="h-full rounded-full bg-brand" style={{ width: `${(l.count / Math.max(1, top.count)) * 100}%` }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}
