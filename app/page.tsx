import { HomeApp } from "@/components/HomeApp";
import { getProfiles, getPublicConfig } from "@/lib/data";

export default async function Page() {
  const [profiles, config] = await Promise.all([getProfiles(), getPublicConfig()]);
  return <HomeApp profiles={profiles} config={config} />;
}
