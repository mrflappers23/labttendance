import { useAuth } from "./auth/AuthContext";
import { Outlet, NavLink } from "react-router-dom";
import { LayoutGrid, Users, CalendarCheck, QrCode, FileText, BarChart3, Settings, Search, Bell, ChevronDown } from "lucide-react";
import { Avatar } from "./ui";

const WORKSPACE = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { to: "/students", label: "Student Management", icon: Users },
  { to: "/live", label: "Live Attendance", icon: CalendarCheck },
  { to: "/qr", label: "QR Attendance", icon: QrCode },
  { to: "/records", label: "Attendance Records", icon: FileText },
  { to: "/reports", label: "Reports", icon: BarChart3 },
];
const ACCOUNT = [{ to: "/settings", label: "Profile & Settings", icon: Settings }];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
    isActive ? "bg-brand-light font-semibold text-brand-dark" : "text-slate-500 hover:bg-slate-100"
  }`;

function NavItem({ to, label, icon: Icon }) {
  return (
    <NavLink to={to} className={linkClass}>
      {({ isActive }) => (
        <>
          <Icon className="h-5 w-5" />
          <span className="flex-1">{label}</span>
          {isActive && <span className="h-1.5 w-1.5 rounded-full bg-brand" />}
        </>
      )}
    </NavLink>
  );
}

const Heading = ({ children }) => (
  <p className="px-3 pb-2 pt-4 text-xs font-semibold tracking-widest text-slate-400">{children}</p>
);

export default function Layout({ ctx }) {
  const { profile, signOut } = useAuth();

  const displayName =
  profile?.full_name || profile?.email || "User";

  const roleName = profile?.role || "User";
  
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-lg font-extrabold text-white">L</div>
          <div>
            <p className="text-lg font-bold leading-tight">LabTrack</p>
            <p className="text-[10px] font-medium tracking-widest text-slate-500">LABORATORY ATTENDANCE</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-2">
          <Heading>WORKSPACE</Heading>
          <div className="space-y-1">{WORKSPACE.map((n) => <NavItem key={n.to} {...n} />)}</div>
          <Heading>ACCOUNT</Heading>
          <div className="space-y-1">{ACCOUNT.map((n) => <NavItem key={n.to} {...n} />)}</div>
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3 md:px-9">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search LabTrack"
              aria-label="Search LabTrack"
              className="w-full rounded-xl bg-slate-100 py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>
          <div className="flex items-center gap-4">
            <button aria-label="Notifications" className="relative text-slate-500">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber-500" />
            </button>
            <div className="hidden h-8 w-px bg-slate-200 sm:block" />
            <div className="flex items-center gap-3">
              <Avatar name={displayName} />

              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-semibold">
                  {displayName}
                </p>

                <p className="text-xs capitalize text-slate-500">
                  {roleName}
                </p>
              </div>

              <button
                onClick={() => signOut().catch(console.error)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </header>

        <nav className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 md:hidden">
          {[...WORKSPACE, ...ACCOUNT].map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => `whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ${isActive ? "bg-brand-light text-brand-dark" : "text-slate-500"}`}>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <main className="px-4 py-6 md:px-9 md:py-8">
          <Outlet context={ctx} />
        </main>
      </div>
    </div>
  );
}
