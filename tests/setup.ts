process.env.NODE_ENV = "test";
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
process.env.DATABASE_URL = process.env.DATABASE_URL ?? "mysql://root:root_secure_password@localhost:3307/anexlk";
process.env.JWT_SECRET = process.env.JWT_SECRET ?? "12345678901234567890123456789012";
process.env.JWT_EXPIRES_IN = "7d";
process.env.GOOGLE_CLIENT_ID = "test-google-client-id";
process.env.SESSION_COOKIE_NAME = "annex_access";
process.env.CSRF_COOKIE_NAME = "annex_csrf";
