import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword, signAccessToken, verifyAccessToken } from "@/lib/server/auth";

describe("Auth", () => {
  it("hashes and verifies password", async () => {
    const hash = await hashPassword("StrongPass!123");
    expect(hash).not.toBe("StrongPass!123");

    expect(await verifyPassword("StrongPass!123", hash)).toBe(true);
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });

  it("signs and verifies JWT token", async () => {
    const token = await signAccessToken({
      sub: "user_1",
      email: "test@annex.lk",
      role: "USER",
    });

    const payload = await verifyAccessToken(token);
    expect(payload.sub).toBe("user_1");
    expect(payload.email).toBe("test@annex.lk");
    expect(payload.role).toBe("USER");
  });
});
