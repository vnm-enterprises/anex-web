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
  ('Bandaragama', 'bandaragama'),
  ('Wadduwa', 'wadduwa'),
  ('Alutgama', 'alutgama')
) AS c(name, slug)
WHERE d.slug = 'kalutara'
ON CONFLICT (slug) DO NOTHING;

-- Cities for Matale district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Matale City', 'matale-city'),
  ('Dambulla', 'dambulla'),
  ('Sigiriya', 'sigiriya'),
  ('Kishiri-ela', 'kishiri-ela'),
  ('Rattota', 'rattota')
) AS c(name, slug)
WHERE d.slug = 'matale'
ON CONFLICT (slug) DO NOTHING;

-- Cities for Nuwara Eliya district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Nuwara Eliya City', 'nuwara-eliya-city'),
  ('Hatton', 'hatton'),
  ('Talawakele', 'talawakele'),
  ('Nanu Oya', 'nanu-oya'),
  ('Hanguranketha', 'hanguranketha')
) AS c(name, slug)
WHERE d.slug = 'nuwara-eliya'
ON CONFLICT (slug) DO NOTHING;

-- Cities for Matara district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Matara City', 'matara-city'),
  ('Weligama', 'weligama'),
  ('Dikwella', 'dikwella'),
  ('Hakmana', 'hakmana'),
  ('Deniyaya', 'deniyaya'),
  ('Akuressa', 'akuressa')
) AS c(name, slug)
WHERE d.slug = 'matara'
ON CONFLICT (slug) DO NOTHING;

-- Cities for Hambantota district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Hambantota City', 'hambantota-city'),
  ('Tangalle', 'tangalle'),
  ('Tissamaharama', 'tissamaharama'),
  ('Ambalantota', 'ambalantota'),
  ('Beliatta', 'beliatta')
) AS c(name, slug)
WHERE d.slug = 'hambantota'
ON CONFLICT (slug) DO NOTHING;

-- Cities for Jaffna district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Jaffna City', 'jaffna-city'),
  ('Chavakachcheri', 'chavakachcheri'),
  ('Point Pedro', 'point-pedro'),
  ('Karainagar', 'karainagar'),
  ('Nallur', 'nallur')
) AS c(name, slug)
WHERE d.slug = 'jaffna'
ON CONFLICT (slug) DO NOTHING;

-- Cities for Kilinochchi district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Kilinochchi Town', 'kilinochchi-town'),
  ('Pallai', 'pallai'),
  ('Pooneryn', 'pooneryn')
) AS c(name, slug)
WHERE d.slug = 'kilinochchi'
ON CONFLICT (slug) DO NOTHING;

-- Cities for Mannar district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Mannar Town', 'mannar-town'),
  ('Nanattan', 'nanattan'),
  ('Madhu', 'madhu')
) AS c(name, slug)
WHERE d.slug = 'mannar'
ON CONFLICT (slug) DO NOTHING;

-- Cities for Mullaitivu district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Mullaitivu Town', 'mullaitivu-town'),
  ('Puthukkudiyiruppu', 'puthukkudiyiruppu'),
  ('Oddusuddan', 'oddusuddan')
) AS c(name, slug)
WHERE d.slug = 'mullaitivu'
ON CONFLICT (slug) DO NOTHING;

-- Cities for Vavuniya district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Vavuniya Town', 'vavuniya-town'),
  ('Nedunkeni', 'nedunkeni'),
  ('Cheddikulam', 'cheddikulam')
) AS c(name, slug)
WHERE d.slug = 'vavuniya'
ON CONFLICT (slug) DO NOTHING;

-- Cities for Batticaloa district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Batticaloa City', 'batticaloa-city'),
  ('Eravur', 'eravur'),
  ('Kattankudy', 'kattankudy'),
  ('Valaichchenai', 'valaichchenai')
) AS c(name, slug)
WHERE d.slug = 'batticaloa'
ON CONFLICT (slug) DO NOTHING;

-- Cities for Ampara district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Ampara Town', 'ampara-town'),
  ('Kalmunai', 'kalmunai'),
  ('Akkaraipattu', 'akkaraipattu'),
  ('Sainthamaruthu', 'sainthamaruthu'),
  ('Pottuvil', 'pottuvil')
) AS c(name, slug)
WHERE d.slug = 'ampara'
ON CONFLICT (slug) DO NOTHING;

-- Cities for Trincomalee district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Trincomalee Town', 'trincomalee-town'),
  ('Kinniya', 'kinniya'),
  ('Mutur', 'mutur'),
  ('Kuchchaveli', 'kuchchaveli')
) AS c(name, slug)
WHERE d.slug = 'trincomalee'
ON CONFLICT (slug) DO NOTHING;

-- Cities for Kurunegala district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Kurunegala City', 'kurunegala-city'),
  ('Kuliyapitiya', 'kuliyapitiya'),
  ('Pannala', 'pannala'),
  ('Narammala', 'narammala'),
  ('Wariyapola', 'wariyapola'),
  ('Maho', 'maho')
) AS c(name, slug)
WHERE d.slug = 'kurunegala'
ON CONFLICT (slug) DO NOTHING;

-- Cities for Puttalam district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Puttalam Town', 'puttalam-town'),
  ('Chilaw', 'chilaw'),
  ('Marawila', 'marawila'),
  ('Dankotuwa', 'dankotuwa'),
  ('Nattandiya', 'nattandiya'),
  ('Kalpitiya', 'kalpitiya')
) AS c(name, slug)
WHERE d.slug = 'puttalam'
ON CONFLICT (slug) DO NOTHING;

-- Cities for Anuradhapura district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Anuradhapura City', 'anuradhapura-city'),
  ('Kekirawa', 'kekirawa'),
  ('Eppawala', 'eppawala'),
  ('Medawachchiya', 'medawachchiya'),
  ('Thalawa', 'thalawa'),
  ('Nochchiyagama', 'nochchiyagama')
) AS c(name, slug)
WHERE d.slug = 'anuradhapura'
ON CONFLICT (slug) DO NOTHING;

-- Cities for Polonnaruwa district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Polonnaruwa City', 'polonnaruwa-city'),
  ('Kaduruwela', 'kaduruwela'),
  ('Hingurakgoda', 'hingurakgoda'),
  ('Medirigiriya', 'medirigiriya')
) AS c(name, slug)
WHERE d.slug = 'polonnaruwa'
ON CONFLICT (slug) DO NOTHING;

-- Cities for Badulla district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Badulla City', 'badulla-city'),
  ('Bandarawela', 'bandarawela'),
  ('Hali-Ela', 'hali-ela'),
  ('Ella', 'ella'),
  ('Haputale', 'haputale'),
  ('Welimada', 'welimada'),
  ('Mahiyanganaya', 'mahiyanganaya')
) AS c(name, slug)
WHERE d.slug = 'badulla'
ON CONFLICT (slug) DO NOTHING;

-- Cities for Monaragala district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Monaragala Town', 'monaragala-town'),
  ('Wellawaya', 'wellawaya'),
  ('Buttala', 'buttala'),
  ('Bibile', 'bibile'),
  ('Kataragama', 'kataragama')
) AS c(name, slug)
WHERE d.slug = 'monaragala'
ON CONFLICT (slug) DO NOTHING;

-- Cities for Ratnapura district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Ratnapura City', 'ratnapura-city'),
  ('Balangoda', 'balangoda'),
  ('Eheliyagoda', 'eheliyagoda'),
  ('Kuruwita', 'kuruwita'),
  ('Pelmadulla', 'pelmadulla'),
  ('Embilipitiya', 'embilipitiya')
) AS c(name, slug)
WHERE d.slug = 'ratnapura'
ON CONFLICT (slug) DO NOTHING;

-- Cities for Kegalle district
INSERT INTO public.cities (district_id, name, slug)
SELECT d.id, c.name, c.slug
FROM public.districts d
CROSS JOIN (VALUES
  ('Kegalle City', 'kegalle-city'),
  ('Mawanella', 'mawanella'),
  ('Warakapola', 'warakapola'),
  ('Rambukkana', 'rambukkana'),
  ('Ruwanwella', 'ruwanwella'),
  ('Deraniyagala', 'deraniyagala')
) AS c(name, slug)
WHERE d.slug = 'kegalle'
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
  ('site_name', '"RENTR"'),
  ('site_description', '"Find your perfect rental in Sri Lanka"'),
  ('contact_email', '"support@rentr.lk"')
ON CONFLICT (key) DO NOTHING;
