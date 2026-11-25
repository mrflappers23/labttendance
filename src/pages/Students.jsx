import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, PageHeader, Avatar, Table, SearchBox, td } from "../ui";
import { LABS, fmtDate, fmtTime, duration } from "../data";

export default function Students() {
  const { students, records } = useOutletContext();
  const [q, setQ] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const list = students.filter((s) => `${s.name} ${s.email} ${s.course}`.toLowerCase().includes(q.toLowerCase()));
  const selected = students.find((s) => s.id === selectedId);
  const history = selected ? records.filter((r) => r.studentId === selected.id).sort((a, b) => b.timeIn - a.timeIn) : [];

  return (
    <>
      <PageHeader title="Student Management" subtitle="View students who attended a laboratory and check their details." />
      <div className="mb-4"><SearchBox value={q} onChange={setQ} placeholder="Search by name, email or course" /></div>
      <Card className="p-3">
        <Table heads={["Student", "Course", "Year", "Email", "Sessions"]}>
          {list.map((s) => (
            <tr
              key={s.id}
              tabIndex={0}
              onClick={() => setSelectedId(s.id)}
              onKeyDown={(e) => e.key === "Enter" && setSelectedId(s.id)}
              className={`cursor-pointer hover:bg-slate-50 ${s.id === selectedId ? "bg-brand-soft" : ""}`}
            >
              <td className={td}>
                <div className="flex items-center gap-3"><Avatar name={s.name} size="h-8 w-8" /><span className="font-semibold">{s.name}</span></div>
              </td>
              <td className={td}>{s.course}</td>
              <td className={td}>{s.year}</td>
              <td className={td}>{s.email}</td>
              <td className={td}>{records.filter((r) => r.studentId === s.id).length}</td>
            </tr>
          ))}
        </Table>
        {!list.length && <p className="p-4 text-slate-500">No students match “{q}”.</p>}
      </Card>

      {selected && (
        <Card className="mt-4">
          <div className="mb-3 flex items-center gap-4">
            <Avatar name={selected.name} size="h-14 w-14" />
            <div>
              <h2 className="text-xl font-bold">{selected.name}</h2>
              <p className="text-sm text-slate-500">{selected.course}, year {selected.year} · {selected.email}</p>
            </div>
          </div>
          <Table heads={["Date", "Laboratory", "Time in", "Time out", "Duration"]}>
            {history.map((r) => (
              <tr key={r.id}>
                <td className={td}>{fmtDate(r.timeIn)}</td>
                <td className={td}>{LABS[r.lab]}</td>
                <td className={td}>{fmtTime(r.timeIn)}</td>
                <td className={td}>{fmtTime(r.timeOut)}</td>
                <td className={td}>{duration(r.timeIn, r.timeOut)}</td>
              </tr>
            ))}
          </Table>
        </Card>
      )}
    </>
  );
}
