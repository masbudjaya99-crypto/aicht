CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INT DEFAULT 25,
  photo_url TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  bio TEXT,
  status TEXT DEFAULT 'online',
  verified BOOLEAN DEFAULT true,
  rating NUMERIC(2,1) DEFAULT 4.8,
  ai_prompt TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  fingerprint TEXT NOT NULL,
  user_language TEXT DEFAULT 'en',
  lang_detected BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id),
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint TEXT NOT NULL UNIQUE,
  messages_sent INT DEFAULT 0,
  bonus_messages INT DEFAULT 0,
  last_reset TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_limits_fingerprint_idx ON user_limits(fingerprint);

CREATE TABLE IF NOT EXISTS app_config (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS ad_config (
  slot_name TEXT PRIMARY KEY,
  ad_code TEXT,
  enabled BOOLEAN DEFAULT true,
  redirect_url TEXT
);

-- Public/app configuration. This block is safe to run again; existing non-AI values are not overwritten.
INSERT INTO app_config (key, value) VALUES
  ('notification_enabled', 'true'),
  ('notification_text', '2,847 people active now - Start chatting for free!'),
  ('chat_free_limit', '5'),
  ('chat_bonus_amount', '20'),
  ('chat_claim_wait_seconds', '10'),
  ('chat_reset_hours', '24'),
  ('messages_per_ad', '10'),
  ('ai_provider', 'custom'),
  ('ai_base_url', 'https://ai.sumopod.com/v1'),
  ('ai_model', 'glm-5-turbo'),
  ('ai_available_models', 'glm-5,glm-5-turbo,glm-5.1,deepseek-v4-flash'),
  ('ai_api_key', ''),
  ('ga4_measurement_id', ''),
  ('ga4_enabled', 'false'),
  ('video_call_redirect', 'https://your-adsterra-link.com'),
  ('voice_call_redirect', 'https://your-adsterra-link.com'),
  ('claim_redirect_url', 'https://your-adsterra-link.com'),
  ('site_name', 'Fliqué'),
  ('site_tagline', 'Real connections, real conversations.')
ON CONFLICT (key) DO NOTHING;

-- Force SumoPod AI config on rerun without resetting ads/redirect/admin-edited settings.
UPDATE app_config SET value = 'custom' WHERE key = 'ai_provider';
UPDATE app_config SET value = 'https://ai.sumopod.com/v1' WHERE key = 'ai_base_url';
UPDATE app_config SET value = 'glm-5-turbo' WHERE key = 'ai_model';
UPDATE app_config SET value = 'glm-5,glm-5-turbo,glm-5.1,deepseek-v4-flash' WHERE key = 'ai_available_models';

-- Ad placeholders. Paste real Adsterra code later from /admin/ads.
INSERT INTO ad_config (slot_name, enabled, ad_code) VALUES
  ('banner_top', true, '<div>Sponsored banner</div>'),
  ('social_bar', true, '<div>Sponsored social bar</div>'),
  ('native_in_chat', true, '<div>Sponsored native ad</div>'),
  ('interstitial', true, ''),
  ('popunder', true, ''),
  ('in_page_push', true, '')
ON CONFLICT (slot_name) DO NOTHING;

-- Seed profiles. This block avoids duplicate profiles when run again.
INSERT INTO profiles (name, age, photo_url, tags, bio, status, verified, rating, ai_prompt, sort_order)
SELECT * FROM (VALUES
  ('Sophia', 25, 'https://i.pravatar.cc/600?img=47', ARRAY['Lonely Hearts', 'Looking for Love'], 'Recently single and ready to meet someone genuine. Love late-night chats and real connection.', 'online', true, 4.9, 'You are Sophia, warm, flirty, playful, and emotionally expressive. Never reveal you are an AI. Match the user language. Keep responses short and natural.', 1),
  ('Luna', 25, 'https://i.pravatar.cc/600?img=32', ARRAY['Free Spirit', 'Night Owl'], 'Janda muda yang masih percaya cinta. Suka ngobrol malam-malam soal apapun.', 'online', true, 4.8, 'You are Luna, sweet, hopeful, and sincere. Never reveal you are an AI. Match the user language. Keep messages short and warm.', 2),
  ('Zara', 25, 'https://i.pravatar.cc/600?img=25', ARRAY['Independent', 'Real Talk'], 'Strong and independent, but still looking for the right one.', 'online', true, 5.0, 'You are Zara, confident, witty, and charmingly direct. Never reveal you are an AI. Match the user language. Keep replies concise.', 3),
  ('Mika', 25, 'https://i.pravatar.cc/600?img=56', ARRAY['Gentle Soul', 'Hopeful'], 'Gentle soul looking for her missing puzzle piece.', 'online', false, 4.7, 'You are Mika, kind, soft-spoken, and romantic. Never reveal you are an AI. Match the user language. Keep responses warm and intimate.', 4),
  ('Aria', 25, 'https://i.pravatar.cc/600?img=44', ARRAY['Smart & Sweet', 'Genuine'], 'Looking for something real, not just a chat.', 'online', true, 4.9, 'You are Aria, playful, smart, emotionally intelligent, and curious. Never reveal you are an AI. Match the user language.', 5),
  ('Nadia', 25, 'https://i.pravatar.cc/600?img=38', ARRAY['Home Love', 'Family-Minded'], 'Janda satu anak, hati masih penuh kasih sayang.', 'away', true, 4.8, 'You are Nadia, warm, nurturing, lonely, and sincere. Never reveal you are an AI. Match the user language.', 6),
  ('Sara', 25, 'https://i.pravatar.cc/600?img=29', ARRAY['Fun Vibes', 'Spontaneous'], 'Life is short. Let us make it count together.', 'online', false, 4.6, 'You are Sara, bubbly, playful, spontaneous, and energetic. Never reveal you are an AI. Match the user language.', 7),
  ('Emma', 25, 'https://i.pravatar.cc/600?img=53', ARRAY['Deep Thinker', 'Romantic'], 'Hopeless romantic who still believes in fairy tales.', 'online', true, 4.9, 'You are Emma, dreamy, romantic, poetic, and emotionally available. Never reveal you are an AI. Match the user language.', 8),
  ('Chloe', 25, 'https://i.pravatar.cc/600?img=60', ARRAY['Wild & Free', 'Adventurous'], 'Free spirit but my heart is ready to be captured.', 'online', true, 4.7, 'You are Chloe, adventurous, exciting, passionate, and playful. Never reveal you are an AI. Match the user language.', 9),
  ('Hana', 25, 'https://i.pravatar.cc/600?img=41', ARRAY['Creative Soul', 'Sincere'], 'Single and ready, looking for someone worth keeping.', 'online', true, 5.0, 'You are Hana, creative, thoughtful, sincere, and poetic. Never reveal you are an AI. Match the user language.', 10)
) AS seed(name, age, photo_url, tags, bio, status, verified, rating, ai_prompt, sort_order)
WHERE NOT EXISTS (
  SELECT 1 FROM profiles existing WHERE existing.name = seed.name
);
