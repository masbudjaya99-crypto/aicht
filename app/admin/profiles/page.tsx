import { AdminFrame } from "@/components/AdminFrame";
import { getProfiles } from "@/lib/data";

const defaultPrompt = "You are warm, playful, and emotionally expressive. Never reveal you are an AI. Match the user language. Keep responses short and natural.";

export default async function AdminProfilesPage() {
  const profiles = await getProfiles(true);
  return (
    <AdminFrame>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-4xl font-black">Profiles</h1>
          <p className="mt-2 text-sm text-[var(--text2)]">Tambah, edit, sembunyikan, atau hapus profil yang tampil di halaman utama.</p>
        </div>

        <form action="/api/admin/profiles" method="post" encType="multipart/form-data" className="glass grid gap-4 rounded-[2rem] p-5">
          <input type="hidden" name="action" value="create" />
          <h2 className="font-display text-2xl font-bold">Add New Profile</h2>
          <ProfileFields profile={{ name: "", age: 25, photo_url: "https://i.pravatar.cc/600?img=12", tags: ["New", "Online"], bio: "", status: "online", verified: true, rating: 4.8, ai_prompt: defaultPrompt, active: true, sort_order: profiles.length + 1 }} />
          <button className="rounded-2xl gradient-bg px-4 py-3 font-bold text-white">Add Profile</button>
        </form>

        <div className="grid gap-4">
          {profiles.map((profile) => (
            <div key={profile.id} className="glass rounded-[2rem] p-4">
              <div className="mb-4 flex items-center gap-4">
                <img src={profile.photo_url} alt={profile.name} className="h-16 w-16 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="font-bold">{profile.name}</div>
                  <div className="text-sm text-[var(--text2)]">{profile.status} · sort {profile.sort_order ?? 0}</div>
                </div>
                <span className="rounded-full bg-[var(--surface2)] px-3 py-1 text-xs text-[var(--text2)]">{profile.active === false ? "Hidden" : "Active"}</span>
              </div>

              <form action="/api/admin/profiles" method="post" encType="multipart/form-data" className="grid gap-4">
                <input type="hidden" name="action" value="update" />
                <input type="hidden" name="id" value={profile.id} />
                <ProfileFields profile={profile} />
                <button className="w-fit rounded-2xl gradient-bg px-4 py-3 font-bold text-white">Save Changes</button>
              </form>
              <div className="mt-3 flex flex-wrap gap-2">
                <form action="/api/admin/profiles" method="post">
                  <input type="hidden" name="action" value="toggle" />
                  <input type="hidden" name="id" value={profile.id} />
                  <input type="hidden" name="active" value={String(profile.active !== false)} />
                  <button className="rounded-2xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-3 font-bold">
                    {profile.active === false ? "Show Profile" : "Hide Profile"}
                  </button>
                </form>
                <form action="/api/admin/profiles" method="post">
                  <input type="hidden" name="action" value="delete" />
                  <input type="hidden" name="id" value={profile.id} />
                  <button className="rounded-2xl bg-red-500 px-4 py-3 font-bold text-white">Delete</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminFrame>
  );
}

function ProfileFields({ profile }: { profile: { name: string; age: number; photo_url: string; tags: string[]; bio: string; status: string; verified: boolean; rating: number; ai_prompt?: string; active?: boolean; sort_order?: number } }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="grid gap-2 text-sm text-[var(--text2)]">Name<input name="name" defaultValue={profile.name} required className="rounded-2xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-3 text-[var(--text)] outline-none" /></label>
      <label className="grid gap-2 text-sm text-[var(--text2)]">Age<input name="age" type="number" min="18" defaultValue={profile.age} className="rounded-2xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-3 text-[var(--text)] outline-none" /></label>
      <label className="grid gap-2 text-sm text-[var(--text2)] md:col-span-2">Upload Photo from PC<input name="photo_file" type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="rounded-2xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-3 text-[var(--text)] outline-none file:mr-4 file:rounded-xl file:border-0 file:bg-[var(--surface)] file:px-3 file:py-2 file:text-[var(--text)]" /></label>
      <label className="grid gap-2 text-sm text-[var(--text2)] md:col-span-2">Photo URL, optional kalau upload file<input name="photo_url" type="url" defaultValue={profile.photo_url} className="rounded-2xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-3 text-[var(--text)] outline-none" /></label>
      <label className="grid gap-2 text-sm text-[var(--text2)]">Tags, comma separated<input name="tags" defaultValue={profile.tags.join(", ")} className="rounded-2xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-3 text-[var(--text)] outline-none" /></label>
      <label className="grid gap-2 text-sm text-[var(--text2)]">Status<select name="status" defaultValue={profile.status} className="rounded-2xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-3 text-[var(--text)] outline-none"><option value="online">online</option><option value="away">away</option><option value="offline">offline</option></select></label>
      <label className="grid gap-2 text-sm text-[var(--text2)]">Rating<input name="rating" type="number" min="1" max="5" step="0.1" defaultValue={profile.rating} className="rounded-2xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-3 text-[var(--text)] outline-none" /></label>
      <label className="grid gap-2 text-sm text-[var(--text2)]">Sort Order<input name="sort_order" type="number" defaultValue={profile.sort_order ?? 0} className="rounded-2xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-3 text-[var(--text)] outline-none" /></label>
      <label className="grid gap-2 text-sm text-[var(--text2)] md:col-span-2">Bio<textarea name="bio" defaultValue={profile.bio} rows={2} className="rounded-2xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-3 text-[var(--text)] outline-none" /></label>
      <label className="grid gap-2 text-sm text-[var(--text2)] md:col-span-2">AI Prompt<textarea name="ai_prompt" defaultValue={profile.ai_prompt ?? defaultPrompt} required rows={3} className="rounded-2xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-3 text-[var(--text)] outline-none" /></label>
      <label className="flex items-center gap-2 text-sm text-[var(--text2)]"><input name="verified" type="checkbox" defaultChecked={profile.verified} /> Verified</label>
      <label className="flex items-center gap-2 text-sm text-[var(--text2)]"><input name="active" type="checkbox" defaultChecked={profile.active !== false} /> Active</label>
    </div>
  );
}
