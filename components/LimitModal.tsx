"use client";

import { useEffect, useState } from "react";
import type { PublicConfig } from "@/types";

export function LimitModal({ config, fingerprint, onClaimed }: { config: PublicConfig; fingerprint: string; onClaimed: () => void }) {
  const [countdown, setCountdown] = useState(config.chat_claim_wait_seconds);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading) return;
    if (countdown <= 0) {
      fetch("/api/limit/claim", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fingerprint }) }).then(onClaimed);
      return;
    }
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown, fingerprint, loading, onClaimed]);

  function claim() {
    if (loading) return;
    setLoading(true);
    window.open(config.claim_redirect_url, "_blank");
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/75 p-3 backdrop-blur-lg sm:p-4">
      <div className="glass max-h-[92dvh] w-full max-w-sm overflow-y-auto rounded-[2rem] p-5 text-center sm:p-7">
        <div className="mx-auto mb-4 grid h-20 w-20 animate-float place-items-center rounded-full gradient-bg text-4xl">🎁</div>
        <h2 className="font-display text-2xl font-black sm:text-3xl">Dapatkan lebih banyak pesan!</h2>
        <p className="mt-2 text-[var(--text2)]">Klik untuk lanjut ngobrol - gratis!</p>
        <button onClick={claim} className="mt-6 w-full rounded-2xl gradient-bg px-5 py-4 font-bold text-white shadow-glow">
          {loading ? `Tunggu ${countdown} detik...` : "Klaim Sekarang"}
        </button>
      </div>
    </div>
  );
}
