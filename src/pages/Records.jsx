import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, PageHeader, Table, SearchBox, Pill, td } from "../ui";
import { LABS, fmtDate, fmtTime } from "../data";

export default function Records() {
  const { records, nameOf } = useOutletContext();
  const [q, setQ] = useState("");
  const [lab, setLab] = useState("all");

  const rows = records
    .filter((r) => lab === "all" || r.lab === Number(lab))
    .filter((r) => `${nameOf(r.studentId)} ${LABS[r.lab]}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.timeIn - a.timeIn);

  return (
    <>
      <PageHeader title="Attendance Records" subtitle="Every student’s laboratory sessions and their current status." />
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="min-w-60 flex-1"><SearchBox value={q} onChange={setQ} placeholder="Search by student or laboratory" /></div>
        <select
          aria-label="Filter by laboratory"
          value={lab}
          onChange={(e) => setLab(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/40"
        >
          <option value="all">All laboratories</option>
          {LABS.map((l, i) => <option key={l} value={i}>{l}</option>)}
        </select>
      </div>
      <Card className="p-3">
        <Table heads={["Student", "Laboratory", "Date", "Time in", "Time out", "Status"]}>
          {rows.slice(0, 100).map((r) => (
            <tr key={r.id}>
              <td className={`${td} font-semibold`}>{nameOf(r.studentId)}</td>
              <td className={td}>{LABS[r.lab]}</td>
              <td className={td}>{fmtDate(r.timeIn)}</td>
              <td className={td}>{fmtTime(r.timeIn)}</td>
              <td className={td}>{fmtTime(r.timeOut)}</td>
              <td className={td}><Pill done={!!r.timeOut}>{r.timeOut ? "Completed" : "In lab"}</Pill></td>
            </tr>
          ))}
        </Table>
        {!rows.length && <p className="p-4 text-slate-500">No records match your search.</p>}
      </Card>
    </>
  );
}
