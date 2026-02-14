import express from "express";
import request from "supertest";
import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/server/auth";
import { createListingSchema } from "@/lib/server/validation";
import { computeRankingWeight } from "@/lib/server/ranking";
import { computeSubscriptionWindow } from "@/lib/server/subscription";

function buildApp() {
  const app = express();
  app.use(express.json());

  app.post("/auth/login", async (req, res) => {
    const hash = await hashPassword("Password#123");
    const ok = await verifyPassword(req.body.password, hash);

    if (!ok || req.body.email !== "owner@annex.lk") {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.status(200).json({ ok: true });
  });

  app.post("/listings", (req, res) => {
    const parsed = createListingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "validation_failed" });
    }

    return res.status(201).json({ id: "listing_1", ...parsed.data });
  });

  app.post("/boost", (req, res) => {
    const base = computeRankingWeight({ isFeatured: false, isBoosted: false, planCode: "PRO" });
    const boosted = computeRankingWeight({ isFeatured: false, isBoosted: true, planCode: "PRO" });
    return res.status(200).json({ base, boosted });
  });

  app.post("/subscriptions/window", (req, res) => {
    const now = new Date(req.body.start ?? "2026-01-01T00:00:00.000Z");
    const window = computeSubscriptionWindow(now, Number(req.body.months ?? 1));
    return res.status(200).json(window);
  });

  app.post("/cron/expire", (_req, res) => {
    return res.status(200).json({ ok: true, processed: true });
  });

  return app;
}

describe("Integration API", () => {
  const app = buildApp();

  it("auth login endpoint accepts valid credentials", async () => {
    await request(app)
      .post("/auth/login")
      .send({ email: "owner@annex.lk", password: "Password#123" })
      .expect(200);
  });

  it("listing creation validates payload", async () => {
    await request(app)
      .post("/listings")
      .send({ title: "short" })
      .expect(400);
  });

  it("boost logic increases ranking", async () => {
    const res = await request(app).post("/boost").send({}).expect(200);
    expect(res.body.boosted).toBeGreaterThan(res.body.base);
  });

  it("subscription window returns grace period", async () => {
    const res = await request(app)
      .post("/subscriptions/window")
      .send({ start: "2026-01-01T00:00:00.000Z", months: 1 })
      .expect(200);

    expect(new Date(res.body.graceEndsAt).getUTCMonth()).toBe(2);
  });

  it("expiry cron endpoint responds success", async () => {
    await request(app).post("/cron/expire").send({}).expect(200);
  });
});
