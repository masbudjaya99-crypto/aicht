import Link from "next/link";

const links = [
  ["Overview", "/admin"],
  ["Profiles", "/admin/profiles"],
  ["Config", "/admin/config"],
  ["Ads", "/admin/ads"],
  ["AI", "/admin/ai"],
  ["Analytics", "/admin/analytics"]
];

export function AdminNav() {
  return (
    <aside className="glass h-max rounded-[2rem] p-4 md:sticky md:top-5">
      <div className="mb-5 font-display text-2xl font-black gradient-text">Fliqué Admin</div>
      <nav className="grid gap-2">
        {links.map(([label, href]) => <Link key={href} href={href} className="rounded-2xl px-4 py-3 text-sm text-[var(--text2)] transition hover:bg-[var(--surface2)] hover:text-[var(--text)]">{label}</Link>)}
      </nav>
      <form action="/api/admin/logout" method="post"><button className="mt-5 w-full rounded-2xl bg-[var(--surface2)] px-4 py-3 text-sm text-[var(--text2)]">Logout</button></form>
    </aside>
  );
}
