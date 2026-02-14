-- ============================================
-- Seed Data: Districts, Cities, Amenities, Plans
-- ============================================

-- Districts (25 Sri Lankan districts)
INSERT INTO public.districts (name, slug) VALUES
  ('Colombo', 'colombo'),
  ('Gampaha', 'gampaha'),
  ('Kalutara', 'kalutara'),
  ('Kandy', 'kandy'),
  ('Matale', 'matale'),
  ('Nuwara Eliya', 'nuwara-eliya'),
  ('Galle', 'galle'),
  ('Matara', 'matara'),
  ('Hambantota', 'hambantota'),
  ('Jaffna', 'jaffna'),
  ('Kilinochchi', 'kilinochchi'),
  ('Mannar', 'mannar'),
  ('Mullaitivu', 'mullaitivu'),
  ('Vavuniya', 'vavuniya'),
  ('Batticaloa', 'batticaloa'),
  ('Ampara', 'ampara'),
  ('Trincomalee', 'trincomalee'),
  ('Kurunegala', 'kurunegala'),
  ('Puttalam', 'puttalam'),
  ('Anuradhapura', 'anuradhapura'),
  ('Polonnaruwa', 'polonnaruwa'),
  ('Badulla', 'badulla'),
  ('Monaragala', 'monaragala'),
  ('Ratnapura', 'ratnapura'),
  ('Kegalle', 'kegalle')
ON CONFLICT (name) DO NOTHING;

-- Cities for Colombo district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Colombo 01', 'colombo-01'),
  ('Colombo 02', 'colombo-02'),
  ('Colombo 03', 'colombo-03'),
  ('Colombo 04', 'colombo-04'),
  ('Colombo 05', 'colombo-05'),
  ('Colombo 06', 'colombo-06'),
  ('Colombo 07', 'colombo-07'),
  ('Dehiwala', 'dehiwala'),
  ('Mount Lavinia', 'mount-lavinia'),
  ('Moratuwa', 'moratuwa'),
  ('Nugegoda', 'nugegoda'),
  ('Maharagama', 'maharagama'),
  ('Kottawa', 'kottawa'),
  ('Piliyandala', 'piliyandala'),
  ('Boralesgamuwa', 'boralesgamuwa'),
  ('Battaramulla', 'battaramulla'),
  ('Rajagiriya', 'rajagiriya'),
  ('Nawala', 'nawala'),
  ('Malabe', 'malabe'),
  ('Kaduwela', 'kaduwela')
) AS c(name, slug)
WHERE d.slug = 'colombo'
ON CONFLICT (slug) DO NOTHING;

-- Cities for Gampaha district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Negombo', 'negombo'),
  ('Ja-Ela', 'ja-ela'),
  ('Wattala', 'wattala'),
  ('Kadawatha', 'kadawatha'),
  ('Kiribathgoda', 'kiribathgoda'),
  ('Kelaniya', 'kelaniya'),
  ('Gampaha', 'gampaha-city'),
  ('Minuwangoda', 'minuwangoda'),
  ('Nittambuwa', 'nittambuwa')
) AS c(name, slug)
WHERE d.slug = 'gampaha'
ON CONFLICT (slug) DO NOTHING;

-- Cities for Kandy district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Kandy City', 'kandy-city'),
  ('Peradeniya', 'peradeniya'),
  ('Katugastota', 'katugastota'),
  ('Gelioya', 'gelioya'),
  ('Pilimatalawa', 'pilimatalawa'),
  ('Kundasale', 'kundasale')
) AS c(name, slug)
WHERE d.slug = 'kandy'
ON CONFLICT (slug) DO NOTHING;

-- Cities for Galle district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Galle City', 'galle-city'),
  ('Unawatuna', 'unawatuna'),
  ('Hikkaduwa', 'hikkaduwa'),
  ('Ambalangoda', 'ambalangoda'),
  ('Karapitiya', 'karapitiya')
) AS c(name, slug)
WHERE d.slug = 'galle'
ON CONFLICT (slug) DO NOTHING;

-- Cities for Kalutara district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Panadura', 'panadura'),
  ('Kalutara City', 'kalutara-city'),
  ('Beruwala', 'beruwala'),
  ('Horana', 'horana'),
  ('Bandaragama', 'bandaragama')
) AS c(name, slug)
WHERE d.slug = 'kalutara'
ON CONFLICT (slug) DO NOTHING;

-- Amenities
INSERT INTO public.amenities (name, icon) VALUES
  ('Wi-Fi', 'wifi'),
  ('Air Conditioning', 'wind'),
  ('Parking', 'car'),
  ('Hot Water', 'flame'),
  ('Washing Machine', 'shirt'),
  ('Kitchen', 'cooking-pot'),
  ('TV', 'tv'),
  ('Security', 'shield'),
  ('CCTV', 'camera'),
  ('Generator', 'zap'),
  ('Swimming Pool', 'waves'),
  ('Gym', 'dumbbell'),
  ('Garden', 'trees'),
  ('Furnished', 'sofa'),
  ('Balcony', 'fence')
ON CONFLICT (name) DO NOTHING;

-- Plans
INSERT INTO public.plans (name, slug, price_monthly, listing_limit, free_boosts, featured_eligible, analytics_access, description) VALUES
  ('Free', 'free', 0, 3, 0, false, false, 'Get started with up to 3 listings per month'),
  ('Basic', 'basic', 1500, 5, 0, false, false, '5 listings per month with standard visibility'),
  ('Pro', 'pro', 3500, 20, 2, true, false, '20 listings with 2 free boosts and featured eligibility'),
  ('Business', 'business', 7500, 999, 5, true, true, 'Unlimited listings, 5 free boosts, featured eligibility, and analytics')
ON CONFLICT (name) DO NOTHING;

-- System config defaults
INSERT INTO public.system_config (key, value) VALUES
  ('listing_expiry_days', '30'),
  ('free_listing_limit', '3'),
  ('boost_prices', '{"7": 500, "14": 800, "30": 1200}'),
  ('featured_price_per_day', '200'),
  ('site_name', '"Annex.lk"'),
  ('site_description', '"Find your perfect rental in Sri Lanka"'),
  ('contact_email', '"support@annex.lk"')
ON CONFLICT (key) DO NOTHING;
