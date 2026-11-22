import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import LiveAttendance from "./pages/LiveAttendance";
import QrAttendance from "./pages/QrAttendance";
import Records from "./pages/Records";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/SettingsPage";
import { STUDENTS, LABS, makeRecords } from "./data";

export default function App() {
  const [students] = useState(STUDENTS);
  const [records, setRecords] = useState(makeRecords);

  const nameOf = (id) => students.find((s) => s.id === id)?.name ?? "Unknown";

  // Admin presses "Time out" on a live session.
  const timeOut = (recordId) =>
    setRecords((rs) => rs.map((r) => (r.id === recordId ? { ...r, timeOut: Date.now() } : r)));

  // A QR scan: scanning the lab you are in times you out, any other lab times you in.
  const scan = (studentId, lab) => {
    const now = Date.now();
    const open = records.find((r) => r.studentId === studentId && !r.timeOut);
    const who = nameOf(studentId);
    if (open && open.lab === lab) {
      timeOut(open.id);
      return `${who} timed out of ${LABS[lab]}.`;
    }
    setRecords((rs) => [
      ...rs.map((r) => (open && r.id === open.id ? { ...r, timeOut: now } : r)),
      { id: Math.max(0, ...rs.map((r) => r.id)) + 1, studentId, lab, timeIn: now, timeOut: null },
    ]);
    return `${who} timed in to ${LABS[lab]}.`;
  };

  const ctx = { students, records, nameOf, timeOut, scan };

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout ctx={ctx} />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="live" element={<LiveAttendance />} />
          <Route path="qr" element={<QrAttendance />} />
          <Route path="records" element={<Records />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
