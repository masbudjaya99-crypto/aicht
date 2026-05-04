export type ProfileStatus = "online" | "away" | "offline";

export interface Profile {
  id: string;
  name: string;
  age: number;
  photo_url: string;
  tags: string[];
  bio: string;
  status: ProfileStatus;
  verified: boolean;
  rating: number;
  ai_prompt?: string;
  active?: boolean;
  sort_order?: number;
}

export interface AdConfig {
  enabled: boolean;
  code: string;
  redirect_url?: string;
}

export interface PublicConfig {
  notification_enabled: boolean;
  notification_text: string;
  chat_free_limit: number;
  chat_bonus_amount: number;
  chat_claim_wait_seconds: number;
  chat_reset_hours: number;
  messages_per_ad: number;
  video_call_redirect: string;
  voice_call_redirect: string;
  claim_redirect_url: string;
  site_name: string;
  site_tagline: string;
  ga4_enabled: boolean;
  ga4_measurement_id: string;
  ai_provider?: string;
  ai_base_url?: string;
  ai_model?: string;
  ads: Record<string, AdConfig>;
}

export interface LimitStatus {
  messages_sent: number;
  free_limit: number;
  bonus_messages: number;
  total_allowed: number;
  remaining: number;
  reset_at: string;
}

export type ChatMessage = {
  id: string;
  role: "assistant" | "user" | "ad";
  content: string;
  created_at: string;
};
