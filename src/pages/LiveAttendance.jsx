import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, PageHeader, Avatar, Table, td } from "../ui";
import { LABS, fmtTime, duration } from "../data";

export default function LiveAttendance() {
  const { records, nameOf, timeOut } = useOutletContext();
  const [, setTick] = useState(0);

  // Re-render every 30 seconds so the durations keep counting.
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const inLab = records.filter((r) => !r.timeOut).sort((a, b) => b.timeIn - a.timeIn);
  const left = records.filter((r) => r.timeOut).sort((a, b) => b.timeOut - a.timeOut).slice(0, 5);

  return (
    <>
      <PageHeader title="Live Attendance" subtitle="Students currently inside a laboratory, with their time in and time out." />
      <Card className="p-3">
        <h2 className="px-3 pb-1 pt-3 text-lg font-bold">In a lab right now ({inLab.length})</h2>
        <Table heads={["Student", "Laboratory", "Time in", "Time out", "Duration", ""]}>
          {inLab.map((r) => (
            <tr key={r.id}>
              <td className={td}>
                <div className="flex items-center gap-3"><Avatar name={nameOf(r.studentId)} size="h-8 w-8" /><span className="font-semibold">{nameOf(r.studentId)}</span></div>
              </td>
              <td className={td}>{LABS[r.lab]}</td>
              <td className={td}>{fmtTime(r.timeIn)}</td>
              <td className={td}>–</td>
              <td className={td}>{duration(r.timeIn)}</td>
              <td className={td}>
                <button onClick={() => timeOut(r.id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:bg-slate-50">
                  Time out
                </button>
              </td>
            </tr>
          ))}
        </Table>
        {!inLab.length && <p className="p-4 text-slate-500">No one is checked in. New scans appear here as they happen.</p>}
      </Card>

      <Card className="mt-4 p-3">
        <h2 className="px-3 pb-1 pt-3 text-lg font-bold">Recently left</h2>
        <Table heads={["Student", "Laboratory", "Time in", "Time out", "Duration"]}>
          {left.map((r) => (
            <tr key={r.id}>
              <td className={td}>{nameOf(r.studentId)}</td>
              <td className={td}>{LABS[r.lab]}</td>
              <td className={td}>{fmtTime(r.timeIn)}</td>
              <td className={td}>{fmtTime(r.timeOut)}</td>
              <td className={td}>{duration(r.timeIn, r.timeOut)}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </>
  );
}
