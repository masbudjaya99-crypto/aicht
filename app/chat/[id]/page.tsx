import { notFound } from "next/navigation";
import { ChatApp } from "@/components/ChatApp";
import { getProfile, getPublicConfig } from "@/lib/data";

export default async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [profile, config] = await Promise.all([getProfile(id), getPublicConfig()]);
  if (!profile) notFound();
  return <ChatApp profile={profile} config={config} />;
}
