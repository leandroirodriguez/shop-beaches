-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query).
-- Safe to re-run; uses IF NOT EXISTS and ON CONFLICT.

-- ============================================================
-- USERS (extends auth.users with an is_admin flag)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup.
-- SECURITY DEFINER + SET search_path = public is required so the function
-- can resolve the public.users table when invoked from the auth schema.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,                -- name or URL for the small icon shown in the grid
  hero_image_url TEXT,      -- image for the category landing page
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
  );

-- Seed the categories shown in the mockups
INSERT INTO categories (slug, name, description, hero_image_url, display_order) VALUES
  ('pregnancy',         'Pregnancy',          'Essential care for a healthy pregnancy journey, ensuring the well-being of both mother and baby.', '/categories/pregnancy.webp', 1),
  ('nutrition-wellness','Nutrition & Wellness','Key elements for maintaining vitality and long-term wellness.', '/categories/nutrition.webp', 2),
  ('sexual-health',     'Sexual Health',      'Supporting physical and emotional aspects of intimacy.', '/categories/sexualhealth.webp', 3),
  ('pcos',              'PCOS Support',       'Hormonal harmony for regular ovulation and cycles.', '/categories/pcos.webp', 4),
  ('perimenopause',     'Perimenopause',      'Navigate the transition with confidence — supporting hormone balance, sleep, and mood during the years before menopause.', '/categories/perimenopause.webp', 5),
  ('menopause',         'Menopause/TRT Support', 'Alleviate common symptoms for a smoother transition.', '/categories/trtsupport.webp', 6)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================
-- PRODUCTS (curated Amazon Associates picks)
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,

  -- Source data from Amazon
  amazon_url TEXT NOT NULL,           -- full affiliate URL (with your partner tag baked in)
  amazon_asin TEXT,                   -- the 10-char product ID (parsed from URL)
  amazon_title TEXT,                  -- raw title from Amazon
  amazon_price TEXT,                  -- captured at ingest time; can drift
  amazon_image_urls TEXT[],           -- primary + gallery
  rating NUMERIC,                     -- e.g. 4.8 (out of 5)
  review_count INTEGER,               -- e.g. 124

  -- Curated content (Claude-generated, you edit)
  display_title TEXT NOT NULL,        -- what we show on the card / detail page
  short_description TEXT,             -- 1–2 sentence summary under the title
  provider_note TEXT,                 -- italicized "Why We Recommend This" body
  how_to_use JSONB,                   -- [{step, title, body}, ...]
  key_benefits JSONB,                 -- [{title, body}, ...]
  tags TEXT[],                        -- e.g. ['Prenatal Vitamins', 'Omega-3']
  is_top_recommendation BOOLEAN DEFAULT false,
  badge TEXT,                         -- "OBGYN APPROVED", "BRAIN DEVELOPMENT", etc.

  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_category_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS products_published_idx ON products(published);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published products" ON products
  FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
  );

-- ============================================================
-- BLOG POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  body_html TEXT,
  cover_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published posts" ON blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage posts" ON blog_posts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
  );

-- ============================================================
-- STORAGE (product images, blog covers, etc.)
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('public-assets', 'public-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'public-assets');

CREATE POLICY "Admin upload assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'public-assets'
    AND EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
  );

CREATE POLICY "Admin update assets" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'public-assets'
    AND EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
  );

CREATE POLICY "Admin delete assets" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'public-assets'
    AND EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.is_admin = true)
  );
