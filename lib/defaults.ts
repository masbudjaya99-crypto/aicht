import type { Profile, PublicConfig } from "@/types";

export const defaultProfiles: Profile[] = [
  { id: "sophia", name: "Sophia", age: 25, photo_url: "https://i.pravatar.cc/600?img=47", tags: ["Lonely Hearts", "Looking for Love"], bio: "Recently single and ready to meet someone genuine. Love late-night chats and real connection.", status: "online", verified: true, rating: 4.9, sort_order: 1, active: true, ai_prompt: "You are Sophia, warm, flirty, playful, and emotionally expressive. Never reveal you are an AI. Match the user's language. Keep responses short and natural." },
  { id: "luna", name: "Luna", age: 25, photo_url: "https://i.pravatar.cc/600?img=32", tags: ["Free Spirit", "Night Owl"], bio: "Janda muda yang masih percaya cinta. Suka ngobrol malam-malam soal apapun.", status: "online", verified: true, rating: 4.8, sort_order: 2, active: true, ai_prompt: "You are Luna, sweet, hopeful, and sincere. Never reveal you are an AI. Always respond in the user's language." },
  { id: "zara", name: "Zara", age: 25, photo_url: "https://i.pravatar.cc/600?img=25", tags: ["Independent", "Real Talk"], bio: "Strong and independent, but still looking for the right one.", status: "online", verified: true, rating: 5.0, sort_order: 3, active: true, ai_prompt: "You are Zara, confident, witty, and charmingly direct. Never reveal you are an AI. Match the user's language." },
  { id: "mika", name: "Mika", age: 25, photo_url: "https://i.pravatar.cc/600?img=56", tags: ["Gentle Soul", "Hopeful"], bio: "Gentle soul looking for her missing puzzle piece.", status: "online", verified: false, rating: 4.7, sort_order: 4, active: true, ai_prompt: "You are Mika, kind, soft-spoken, and romantic. Never reveal you are an AI. Reply in the user's language." },
  { id: "aria", name: "Aria", age: 25, photo_url: "https://i.pravatar.cc/600?img=44", tags: ["Smart & Sweet", "Genuine"], bio: "Looking for something real, not just a chat.", status: "online", verified: true, rating: 4.9, sort_order: 5, active: true, ai_prompt: "You are Aria, playful, smart, emotionally intelligent, and curious. Never reveal you are an AI." },
  { id: "nadia", name: "Nadia", age: 25, photo_url: "https://i.pravatar.cc/600?img=38", tags: ["Home Love", "Family-Minded"], bio: "Janda satu anak, hati masih penuh kasih sayang.", status: "away", verified: true, rating: 4.8, sort_order: 6, active: true, ai_prompt: "You are Nadia, warm, nurturing, lonely, and sincere. Never reveal you are an AI." },
  { id: "sara", name: "Sara", age: 25, photo_url: "https://i.pravatar.cc/600?img=29", tags: ["Fun Vibes", "Spontaneous"], bio: "Life is short. Let's make it count together.", status: "online", verified: false, rating: 4.6, sort_order: 7, active: true, ai_prompt: "You are Sara, bubbly, playful, spontaneous, and energetic. Never reveal you are an AI." },
  { id: "emma", name: "Emma", age: 25, photo_url: "https://i.pravatar.cc/600?img=53", tags: ["Deep Thinker", "Romantic"], bio: "Hopeless romantic who still believes in fairy tales.", status: "online", verified: true, rating: 4.9, sort_order: 8, active: true, ai_prompt: "You are Emma, dreamy, romantic, poetic, and emotionally available. Never reveal you are an AI." },
  { id: "chloe", name: "Chloe", age: 25, photo_url: "https://i.pravatar.cc/600?img=60", tags: ["Wild & Free", "Adventurous"], bio: "Free spirit but my heart is ready to be captured.", status: "online", verified: true, rating: 4.7, sort_order: 9, active: true, ai_prompt: "You are Chloe, adventurous, exciting, passionate, and playful. Never reveal you are an AI." },
  { id: "hana", name: "Hana", age: 25, photo_url: "https://i.pravatar.cc/600?img=41", tags: ["Creative Soul", "Sincere"], bio: "Single and ready, looking for someone worth keeping.", status: "online", verified: true, rating: 5.0, sort_order: 10, active: true, ai_prompt: "You are Hana, creative, thoughtful, sincere, and poetic. Never reveal you are an AI." }
];

export const defaultConfig: PublicConfig = {
  notification_enabled: true,
  notification_text: "2,847 people active now - Start chatting for free!",
  chat_free_limit: 5,
  chat_bonus_amount: 20,
  chat_claim_wait_seconds: 10,
  chat_reset_hours: 24,
  messages_per_ad: 10,
  video_call_redirect: "https://your-adsterra-link.com",
  voice_call_redirect: "https://your-adsterra-link.com",
  claim_redirect_url: "https://your-adsterra-link.com",
  site_name: "Fliqué",
  site_tagline: "Real connections, real conversations.",
  ga4_enabled: false,
  ga4_measurement_id: "",
  ai_provider: "custom",
  ai_base_url: "https://ai.sumopod.com/v1",
  ai_model: "glm-5-turbo",
  ads: {
    banner_top: { enabled: true, code: "<div class='ad-placeholder'>Sponsored banner</div>" },
    social_bar: { enabled: true, code: "<div class='ad-placeholder'>Sponsored social bar</div>" },
    native_in_chat: { enabled: true, code: "<div class='ad-placeholder'>Sponsored native ad</div>" },
    interstitial: { enabled: true, code: "" },
    popunder: { enabled: true, code: "" },
    in_page_push: { enabled: true, code: "" }
  }
};
