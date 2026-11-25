import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { Card, PageHeader } from "../ui";
import { LABS } from "../data";

const field = "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/40";

export default function QrAttendance() {
  const { students, scan } = useOutletContext();
  const [studentId, setStudentId] = useState(students[0].id);
  const [lab, setLab] = useState(0);
  const [message, setMessage] = useState("");

  return (
    <>
      <PageHeader title="QR Attendance" subtitle="Print each code and post it at the entrance of its laboratory." />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {LABS.map((name, i) => (
          <Card key={name} className="text-center">
            <div className="mx-auto inline-block rounded-xl border border-slate-200 bg-white p-3">
              <QRCodeSVG value={`labtrack:lab-${i + 1}`} size={160} />
            </div>
            <h2 className="mt-4 text-lg font-bold">{name}</h2>
            <p className="text-sm text-slate-500">labtrack:lab-{i + 1}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-lg font-bold">Simulate a student scan</h2>
        <p className="mb-4 text-sm text-slate-500">Scan once to time in. Scan the same lab again to time out.</p>
        <div className="flex flex-wrap gap-3">
          <select aria-label="Student" className={`${field} min-w-48 flex-1`} value={studentId} onChange={(e) => setStudentId(Number(e.target.value))}>
            {students.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select aria-label="Laboratory" className={`${field} min-w-48 flex-1`} value={lab} onChange={(e) => setLab(Number(e.target.value))}>
            {LABS.map((l, i) => <option key={l} value={i}>{l}</option>)}
          </select>
          <button onClick={() => setMessage(scan(studentId, lab))} className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
            Scan QR
          </button>
        </div>
        {message && <p role="status" className="mt-4 rounded-xl bg-brand-soft px-4 py-3 text-sm font-medium text-brand-dark">{message}</p>}
      </Card>
    </>
  );
}
