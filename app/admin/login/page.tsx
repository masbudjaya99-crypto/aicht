"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: form.get("username"), password: form.get("password") }) });
    if (!response.ok) { setError("Invalid credentials"); return; }
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center p-4">
      <form onSubmit={submit} className="glass w-full max-w-sm rounded-[2rem] p-7">
        <h1 className="font-display text-4xl font-black gradient-text">Admin Login</h1>
        <p className="mt-2 text-sm text-[var(--text2)]">Default local credentials: admin / admin123</p>
        <input name="username" placeholder="Username" className="mt-6 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-3 outline-none" />
        <input name="password" type="password" placeholder="Password" className="mt-3 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface2)] px-4 py-3 outline-none" />
        {error ? <p className="mt-3 text-sm text-pink-400">{error}</p> : null}
        <button className="mt-5 w-full rounded-2xl gradient-bg px-4 py-3 font-bold text-white">Login</button>
      </form>
    </main>
  );
}
