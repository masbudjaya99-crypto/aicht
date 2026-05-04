"use client";

import { useEffect, useRef } from "react";
import type { PublicConfig } from "@/types";

export function AdSlot({ slot, config, className = "" }: { slot: string; config: PublicConfig; className?: string }) {
  const ad = config.ads?.[slot];
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.querySelectorAll("script").forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, [ad?.code]);

  if (!ad?.enabled || !ad.code) return null;

  return <div ref={ref} className={className} dangerouslySetInnerHTML={{ __html: ad.code }} />;
}
