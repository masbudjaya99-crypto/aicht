import { AdSlot } from "@/components/AdSlot";
import type { PublicConfig } from "@/types";

export function GlobalAds({ config }: { config: PublicConfig }) {
  return (
    <>
      <AdSlot slot="interstitial" config={config} />
      <AdSlot slot="popunder" config={config} />
      <AdSlot slot="in_page_push" config={config} />
    </>
  );
}
