import { initials } from "./data";

export const Card = ({ className = "", children }) => (
  <div className={`rounded-2xl border border-slate-200 bg-white p-6 ${className}`}>{children}</div>
);

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export const Avatar = ({ name, size = "h-10 w-10" }) => (
  <div className={`${size} grid shrink-0 place-items-center rounded-full bg-brand-light text-xs font-bold text-brand-dark`}>
    {initials(name)}
  </div>
);

export const Pill = ({ done, children }) => (
  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${done ? "bg-slate-100 text-slate-500" : "bg-brand-light text-brand-dark"}`}>
    {children}
  </span>
);

export const td = "px-3 py-3";

export function Table({ heads, children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead>
          <tr>
            {heads.map((h) => (
              <th key={h} className="px-3 py-3 text-xs font-semibold text-slate-500">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}

export const SearchBox = ({ value, onChange, placeholder }) => (
  <input
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    aria-label={placeholder}
    className="w-full max-w-sm rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/40"
  />
);

// Dark bar = unique students, light bar = total sessions.
export function WeekChart({ week }) {
  const max = Math.max(1, ...week.map((d) => d.sessions));
  return (
    <div>
      <div className="flex h-56 items-end gap-4">
        {week.map((d) => (
          <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <div className="relative w-full flex-1">
              <div className="absolute bottom-0 w-full rounded-t-xl bg-brand-light" style={{ height: `${(d.sessions / max) * 100}%` }} />
              <div className="absolute bottom-0 w-full rounded-t-xl bg-brand" style={{ height: `${(d.students / max) * 100}%` }} />
            </div>
            <span className="text-xs text-slate-500">{d.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-brand" />Students</span>
        <span className="flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-sm bg-brand-light" />Sessions</span>
      </div>
    </div>
  );
}
