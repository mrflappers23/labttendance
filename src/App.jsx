import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Layout from "./Layout";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import LiveAttendance from "./pages/LiveAttendance";
import QrAttendance from "./pages/QrAttendance";
import Records from "./pages/Records";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login";

import RequireAuth from "./components/RequireAuth";
import { useAuth } from "./auth/AuthContext";

import { STUDENTS, LABS, makeRecords } from "./data";

// Redirect users based on their role.
function HomeRedirect() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <p className="p-8">Loading...</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return <Navigate to="/access-pending" replace />;
  }

  const destinations = {
    admin: "/dashboard",
    teacher: "/teacher",
    student: "/student"
  };

  return (
    <Navigate
      to={destinations[profile.role] || "/access-pending"}
      replace
    />
  );
}

// Temporary landing page for teacher and student accounts.
function RoleLanding({ role }) {
  const { profile, signOut } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold">
          Welcome, {profile?.full_name}
        </h1>

        <p className="mt-2 text-slate-500">
          You are logged in as {role}.
        </p>

        <p className="mt-4 text-sm text-slate-400">
          Your {role.toLowerCase()} dashboard
          will be available in the next development phase.
        </p>

        <button
          onClick={() => signOut().catch(console.error)}
          className="mt-6 rounded-xl bg-brand px-5 py-2.5 text-white"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

// Temporary page when a user's profile is missing.
function AccessPending() {
  const {
    user,
    profile,
    loading,
    profileError,
    signOut
  } = useAuth();

  const destinations = {
    admin: "/dashboard",
    teacher: "/teacher",
    student: "/student"
  };

  // Still checking the account.
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">
          Loading your LabTrack account...
        </p>
      </div>
    );
  }

  // User is not authenticated.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Profile successfully loaded.
  if (profile) {
    const destination = destinations[profile.role];

    if (destination) {
      return (
        <Navigate
          to={destination}
          replace
        />
      );
    }

    return <Navigate to="/no-access" replace />;
  }

  // No profile found after loading.
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="max-w-md text-center">

        <h1 className="text-xl font-bold">
          Account setup required
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          Your account does not have an active LabTrack profile.
          Please contact the administrator.
        </p>

        {profileError && (
          <p className="mt-2 text-xs text-red-500">
            {profileError}
          </p>
        )}

        <button
          onClick={() => signOut().catch(console.error)}
          className="mt-5 rounded-lg bg-brand px-4 py-2 text-white"
        >
          Sign Out
        </button>

      </div>
    </div>
  );
}

function NoAccess() {
  const { signOut } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold">
          Access Denied
        </h1>

        <p className="mt-2 text-slate-500">
          You do not have permission to access this page.
        </p>

        <button
          onClick={() => signOut().catch(console.error)}
          className="mt-5 rounded-xl bg-brand px-5 py-2.5 text-white"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [students] = useState(STUDENTS);
  const [records, setRecords] = useState(makeRecords);

  const nameOf = (id) =>
    students.find((s) => s.id === id)?.name ?? "Unknown";

  const timeOut = (recordId) =>
    setRecords((rs) =>
      rs.map((r) =>
        r.id === recordId
          ? { ...r, timeOut: Date.now() }
          : r
      )
    );

  const scan = (studentId, lab) => {
    const now = Date.now();

    const open = records.find(
      (r) => r.studentId === studentId && !r.timeOut
    );

    const who = nameOf(studentId);

    if (open && open.lab === lab) {
      timeOut(open.id);
      return `${who} timed out of ${LABS[lab]}.`;
    }

    setRecords((rs) => [
      ...rs.map((r) =>
        open && r.id === open.id
          ? { ...r, timeOut: now }
          : r
      ),
      {
        id: Math.max(0, ...rs.map((r) => r.id)) + 1,
        studentId,
        lab,
        timeIn: now,
        timeOut: null
      }
    ]);

    return `${who} timed in to ${LABS[lab]}.`;
  };

  const ctx = {
    students,
    records,
    nameOf,
    timeOut,
    scan
  };

  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Role-based landing pages */}
        <Route
          path="/teacher"
          element={
            <RequireAuth allowedRoles={["teacher"]}>
              <RoleLanding role="Teacher" />
            </RequireAuth>
          }
        />

        <Route
          path="/student"
          element={
            <RequireAuth allowedRoles={["student"]}>
              <RoleLanding role="Student" />
            </RequireAuth>
          }
        />

        {/* Account status pages */}
        <Route
          path="/access-pending"
          element={<AccessPending />}
        />

        <Route
          path="/no-access"
          element={
            <RequireAuth>
              <NoAccess />
            </RequireAuth>
          }
        />

        {/* Root redirect */}
        <Route path="/" element={<HomeRedirect />} />

        {/* Administrator-only application */}
        <Route
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <Layout ctx={ctx} />
            </RequireAuth>
          }
        >
          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          <Route
            path="students"
            element={<Students />}
          />

          <Route
            path="live"
            element={<LiveAttendance />}
          />

          <Route
            path="qr"
            element={<QrAttendance />}
          />

          <Route
            path="records"
            element={<Records />}
          />

          <Route
            path="reports"
            element={<Reports />}
          />

          <Route
            path="settings"
            element={<SettingsPage />}
          />
        </Route>

        <Route path="*" element={<HomeRedirect />} />

      </Routes>
    </BrowserRouter>
  );
}