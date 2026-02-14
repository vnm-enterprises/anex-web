import { describe, it, expect } from "vitest";
import { addMonths, computeSubscriptionWindow } from "@/lib/server/subscription";

describe("Subscription Logic", () => {
  it("adds months correctly", () => {
    const start = new Date("2026-01-15T00:00:00.000Z");
    const result = addMonths(start, 2);

    expect(result.getUTCMonth()).toBe(2); // March
  });

  it("computes grace period window", () => {
    const start = new Date("2026-01-01T00:00:00.000Z");
    const window = computeSubscriptionWindow(start, 1);

    expect(window.startedAt.toISOString()).toBe("2026-01-01T00:00:00.000Z");
    expect(window.endsAt.getUTCMonth()).toBe(1);
    expect(window.graceEndsAt.getUTCMonth()).toBe(2);
  });
});
