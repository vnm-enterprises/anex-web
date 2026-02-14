import { describe, it, expect, vi } from "vitest";
import { refreshExpiredStates } from "@/lib/server/listing-service";

describe("Expiry Cron Logic", () => {
  it("expires listings and downgrades boosts", async () => {
    const updateMany = vi.fn().mockResolvedValue({ count: 1 });
    const prisma = {
      listing: {
        updateMany,
      },
    } as unknown as Parameters<typeof refreshExpiredStates>[0];

    await refreshExpiredStates(prisma);

    expect(updateMany).toHaveBeenCalledTimes(2);
    expect(updateMany.mock.calls[0][0].data.status).toBe("EXPIRED");
    expect(updateMany.mock.calls[1][0].data.isBoosted).toBe(false);
  });
});
