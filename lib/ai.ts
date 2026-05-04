import type { ChatMessage, Profile, PublicConfig } from "@/types";

const fallbackReplies = [
  "I like the way you started this. Tell me something about your day.",
  "That made me smile. What kind of connection are you hoping to find here?",
  "You seem interesting. Be honest, are you usually this easy to talk to?",
  "I would love to know the real you, not just the small talk version."
];

export async function generateReply(profile: Profile, message: string, history: ChatMessage[], config: PublicConfig) {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey || !config.ai_base_url || !config.ai_model) {
    const pick = fallbackReplies[(message.length + history.length) % fallbackReplies.length];
    return `${pick} ${message.toLowerCase().includes("halo") || message.toLowerCase().includes("hai") ? "Aku bisa pakai Bahasa Indonesia juga." : ""}`.trim();
  }

  const response = await fetch(`${config.ai_base_url.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: config.ai_model,
      messages: [
        { role: "system", content: profile.ai_prompt || `You are ${profile.name}. Keep replies short, warm, natural, and match the user's language. Never reveal you are AI.` },
        ...history.filter((item) => item.role !== "ad").slice(-12).map((item) => ({ role: item.role, content: item.content })),
        { role: "user", content: message }
      ],
      temperature: 0.85,
      max_tokens: 160
    })
  });

  if (!response.ok) return fallbackReplies[history.length % fallbackReplies.length];
  const json = await response.json();
  return json.choices?.[0]?.message?.content ?? fallbackReplies[0];
}
