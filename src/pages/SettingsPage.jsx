import { useState } from "react";
import { Card, PageHeader, Avatar } from "../ui";

const field = "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/40";

export default function SettingsPage() {
  const [name, setName] = useState("Maria Andres");
  const [email, setEmail] = useState("maria.andres@school.edu");
  const [saved, setSaved] = useState(false);

  return (
    <>
      <PageHeader title="Profile & Settings" subtitle="Manage your administrator account." />
      <Card className="max-w-xl">
        <div className="mb-6 flex items-center gap-4">
          <Avatar name={name} size="h-14 w-14" />
          <div><p className="text-lg font-bold">{name}</p><p className="text-sm text-slate-500">Administrator</p></div>
        </div>
        <label className="mb-4 block text-sm font-medium">Full name
          <input className={field} value={name} onChange={(e) => { setName(e.target.value); setSaved(false); }} />
        </label>
        <label className="mb-5 block text-sm font-medium">School email
          <input className={field} value={email} onChange={(e) => { setEmail(e.target.value); setSaved(false); }} />
        </label>
        <button onClick={() => setSaved(true)} className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark">
          Save changes
        </button>
        {saved && <p role="status" className="mt-4 text-sm font-medium text-brand-dark">Changes saved.</p>}
      </Card>
    </>
  );
}
