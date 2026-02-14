import { describe, it, expect } from "vitest";
import { computeRankingWeight } from "@/lib/server/ranking";

describe("Ranking Logic", () => {
  it("prioritizes featured listing", () => {
    const featured = computeRankingWeight({
      isFeatured: true,
      isBoosted: false,
      planCode: "FREE",
    });
    const normal = computeRankingWeight({
      isFeatured: false,
      isBoosted: false,
      planCode: "BUSINESS",
    });

    expect(featured).toBeGreaterThan(normal);
  });

  it("boost increases rank for same plan", () => {
    const boosted = computeRankingWeight({ isFeatured: false, isBoosted: true, planCode: "PRO" });
    const nonBoosted = computeRankingWeight({ isFeatured: false, isBoosted: false, planCode: "PRO" });
    expect(boosted).toBeGreaterThan(nonBoosted);
  });

  it("engagement contributes but is capped", () => {
    const low = computeRankingWeight({ isFeatured: false, isBoosted: false, planCode: "BASIC", views30d: 10, inquiries30d: 1 });
    const high = computeRankingWeight({ isFeatured: false, isBoosted: false, planCode: "BASIC", views30d: 1000, inquiries30d: 500 });

    expect(high).toBeGreaterThan(low);
    expect(high - low).toBeLessThanOrEqual(120);
  });
});
