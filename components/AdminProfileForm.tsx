"use client";

import { useState } from "react";

type AdminProfileFormProps = {
  children: React.ReactNode;
  className?: string;
  multipart?: boolean;
};

export function AdminProfileForm({ children, className, multipart }: AdminProfileFormProps) {
  const [pending, setPending] = useState(false);

  async function submitProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);

    const response = await fetch("/api/admin/profiles", {
      method: "POST",
      body: new FormData(event.currentTarget),
      credentials: "same-origin"
    });

    if (response.ok || response.redirected) {
      window.location.href = response.redirected ? response.url : "/admin/profiles";
      return;
    }

    alert("Gagal menyimpan profil. Coba refresh lalu ulangi lagi.");
    setPending(false);
  }

  return (
    <form onSubmit={submitProfile} encType={multipart ? "multipart/form-data" : undefined} className={className} aria-busy={pending}>
      {children}
    </form>
  );
}
