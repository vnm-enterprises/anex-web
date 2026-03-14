import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display main sections", async ({ page }) => {
    await expect(page.locator("h1")).toContainText(
      "Find your next living space.",
    );
    await expect(page.getByText("Spotlight Listings")).toBeVisible();
    await expect(page.getByText("Our Favorite Picks")).toBeVisible();
  });

  test("carousels should be present", async ({ page }) => {
    const carousels = page.locator('[aria-roledescription="carousel"]');
    await expect(carousels).toHaveCount(2);
  });

  test("newsletter form should be functional", async ({ page }) => {
    const signupForm = page.locator('form:has-text("Join the Community")');
    await expect(signupForm).toBeVisible();

    await signupForm.locator('input[type="email"]').fill("test@example.com");

    // Mock the API response
    await page.route("**/api/newsletter/subscribe", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    await signupForm.locator('button[type="submit"]').click();

    // Wait for success message
    await expect(page.getByText("Thank you for subscribing!")).toBeVisible({
      timeout: 10000,
    });
  });
});
