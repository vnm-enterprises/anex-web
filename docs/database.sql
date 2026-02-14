-- Annex.lk MySQL baseline (aligned to prisma/schema.prisma)
-- Run Prisma migrations for source-of-truth DDL. This file is deployment reference.

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(191) PRIMARY KEY,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NULL,
  name VARCHAR(120) NULL,
  phone VARCHAR(32) NULL,
  avatar_url VARCHAR(255) NULL,
  role ENUM('USER','ADMIN') NOT NULL DEFAULT 'USER',
  provider ENUM('CREDENTIALS','GOOGLE') NOT NULL DEFAULT 'CREDENTIALS',
  provider_sub VARCHAR(191) NULL,
  email_verified_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_provider_sub (provider, provider_sub)
);

CREATE TABLE IF NOT EXISTS districts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(120) NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  district_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_city_district_name (district_id, name),
  UNIQUE KEY uq_city_district_slug (district_id, slug),
  INDEX idx_city_slug (slug),
  CONSTRAINT fk_city_district FOREIGN KEY (district_id) REFERENCES districts(id)
);

CREATE TABLE IF NOT EXISTS listings (
  id VARCHAR(191) PRIMARY KEY,
  owner_id VARCHAR(191) NOT NULL,
  title VARCHAR(140) NOT NULL,
  slug VARCHAR(180) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  property_type ENUM('ANNEX','BOARDING','HOUSE','APARTMENT') NOT NULL,
  price_lkr INT NOT NULL,
  district_id INT NOT NULL,
  city_id INT NOT NULL,
  area VARCHAR(120) NULL,
  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,
  furnished_status ENUM('FURNISHED','SEMI_FURNISHED','UNFURNISHED') NOT NULL,
  gender_preference ENUM('ANY','MALE','FEMALE') NOT NULL DEFAULT 'ANY',
  contact_name VARCHAR(120) NOT NULL,
  contact_phone VARCHAR(32) NOT NULL,
  contact_email VARCHAR(191) NULL,
  ranking_weight INT NOT NULL DEFAULT 0,
  status ENUM('PENDING','APPROVED','REJECTED','EXPIRED') NOT NULL DEFAULT 'PENDING',
  is_boosted BOOLEAN NOT NULL DEFAULT FALSE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  boost_expires_at DATETIME NULL,
  expires_at DATETIME NOT NULL,
  approved_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_listing_owner_created (owner_id, created_at),
  INDEX idx_listing_geo (district_id, city_id, property_type),
  INDEX idx_listing_status_expiry (status, expires_at, created_at),
  INDEX idx_listing_rank (is_featured, is_boosted, ranking_weight),
  INDEX idx_listing_price (price_lkr),
  FULLTEXT KEY ft_listing_text (title, description),
  CONSTRAINT fk_listing_owner FOREIGN KEY (owner_id) REFERENCES users(id),
  CONSTRAINT fk_listing_district FOREIGN KEY (district_id) REFERENCES districts(id),
  CONSTRAINT fk_listing_city FOREIGN KEY (city_id) REFERENCES cities(id)
);

CREATE TABLE IF NOT EXISTS listing_images (
  id VARCHAR(191) PRIMARY KEY,
  listing_id VARCHAR(191) NOT NULL,
  url VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_listing_image_sort (listing_id, sort_order),
  CONSTRAINT fk_listing_image_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS amenities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(120) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS listing_amenities (
  listing_id VARCHAR(191) NOT NULL,
  amenity_id INT NOT NULL,
  PRIMARY KEY (listing_id, amenity_id),
  INDEX idx_listing_amenity_amenity (amenity_id),
  CONSTRAINT fk_la_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
  CONSTRAINT fk_la_amenity FOREIGN KEY (amenity_id) REFERENCES amenities(id)
);

CREATE TABLE IF NOT EXISTS plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code ENUM('FREE','BASIC','PRO','BUSINESS') NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL,
  monthly_price_lkr INT NOT NULL,
  listing_limit_monthly INT NULL,
  free_boosts_monthly INT NOT NULL DEFAULT 0,
  can_feature BOOLEAN NOT NULL DEFAULT FALSE,
  priority_weight INT NOT NULL DEFAULT 0,
  analytics_level VARCHAR(40) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id VARCHAR(191) PRIMARY KEY,
  user_id VARCHAR(191) NOT NULL,
  plan_id INT NOT NULL,
  status ENUM('ACTIVE','EXPIRED','CANCELED','GRACE') NOT NULL DEFAULT 'ACTIVE',
  started_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  grace_ends_at DATETIME NULL,
  canceled_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sub_user_status (user_id, status, ends_at),
  CONSTRAINT fk_sub_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT fk_sub_plan FOREIGN KEY (plan_id) REFERENCES plans(id)
);

CREATE TABLE IF NOT EXISTS boosts (
  id VARCHAR(191) PRIMARY KEY,
  listing_id VARCHAR(191) NOT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  duration_days INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_boost_listing_ends (listing_id, ends_at),
  CONSTRAINT fk_boost_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS featured_flags (
  id VARCHAR(191) PRIMARY KEY,
  listing_id VARCHAR(191) NOT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_feature_listing_ends (listing_id, ends_at),
  CONSTRAINT fk_feature_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS inquiries (
  id VARCHAR(191) PRIMARY KEY,
  listing_id VARCHAR(191) NOT NULL,
  sender_user_id VARCHAR(191) NULL,
  name VARCHAR(120) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  message VARCHAR(1500) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_inquiry_listing_created (listing_id, created_at),
  CONSTRAINT fk_inquiry_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
  CONSTRAINT fk_inquiry_sender FOREIGN KEY (sender_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS ads (
  id VARCHAR(191) PRIMARY KEY,
  title VARCHAR(140) NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  target_url VARCHAR(255) NOT NULL,
  placement ENUM('HOME_HERO','HOME_INLINE','DISTRICT_TOP','CITY_TOP','SEARCH_INLINE') NOT NULL,
  district_id INT NULL,
  city_id INT NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_ad_active_placement (placement, is_active, starts_at, ends_at),
  INDEX idx_ad_geo (district_id, city_id),
  CONSTRAINT fk_ad_district FOREIGN KEY (district_id) REFERENCES districts(id),
  CONSTRAINT fk_ad_city FOREIGN KEY (city_id) REFERENCES cities(id)
);

CREATE TABLE IF NOT EXISTS ad_impressions (
  id VARCHAR(191) PRIMARY KEY,
  ad_id VARCHAR(191) NOT NULL,
  seen_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  listing_id VARCHAR(191) NULL,
  user_id VARCHAR(191) NULL,
  INDEX idx_ad_impression (ad_id, seen_at),
  CONSTRAINT fk_ad_impression_ad FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS listing_analytics_daily (
  id VARCHAR(191) PRIMARY KEY,
  listing_id VARCHAR(191) NOT NULL,
  date DATE NOT NULL,
  view_count INT NOT NULL DEFAULT 0,
  inquiry_count INT NOT NULL DEFAULT 0,
  favorite_count INT NOT NULL DEFAULT 0,
  UNIQUE KEY uq_listing_day (listing_id, date),
  INDEX idx_analytics_date (date),
  CONSTRAINT fk_analytics_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS system_config (
  `key` VARCHAR(80) PRIMARY KEY,
  `value` VARCHAR(191) NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS upload_assets (
  id VARCHAR(191) PRIMARY KEY,
  user_id VARCHAR(191) NOT NULL,
  listing_id VARCHAR(191) NULL,
  purpose ENUM('LISTING_IMAGE','USER_AVATAR') NOT NULL,
  bucket VARCHAR(120) NOT NULL,
  object_key VARCHAR(255) NOT NULL UNIQUE,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes INT NOT NULL,
  etag VARCHAR(80) NULL,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_upload_user_created (user_id, created_at),
  INDEX idx_upload_listing (listing_id),
  CONSTRAINT fk_upload_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_upload_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id VARCHAR(191) PRIMARY KEY,
  user_id VARCHAR(191) NOT NULL,
  subscription_id VARCHAR(191) NULL,
  listing_id VARCHAR(191) NULL,
  type ENUM('SUBSCRIPTION','BOOST','FEATURE','ONE_TIME') NOT NULL,
  status ENUM('PENDING','SUCCEEDED','FAILED','CANCELED') NOT NULL DEFAULT 'PENDING',
  amount_lkr INT NOT NULL,
  currency VARCHAR(8) NOT NULL DEFAULT 'LKR',
  provider VARCHAR(32) NOT NULL DEFAULT 'stripe',
  provider_session_id VARCHAR(191) NULL UNIQUE,
  provider_payment_intent VARCHAR(191) NULL UNIQUE,
  metadata JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_payment_user_status (user_id, status, created_at),
  INDEX idx_payment_type_status (type, status),
  CONSTRAINT fk_payment_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_payment_subscription FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL,
  CONSTRAINT fk_payment_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS payment_webhook_events (
  id VARCHAR(191) PRIMARY KEY,
  provider VARCHAR(32) NOT NULL,
  event_id VARCHAR(191) NOT NULL UNIQUE,
  event_type VARCHAR(120) NOT NULL,
  payload JSON NOT NULL,
  processed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
