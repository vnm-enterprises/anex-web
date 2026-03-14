import { test, expect } from "@playwright/test";

test.describe("Public Pages", () => {
  test("Safety Center should be accessible", async ({ page }) => {
    await page.goto("/safety-center");
    await expect(page.locator("h1")).toContainText("Safety Center.");
    await expect(page.getByText("For Tenants")).toBeVisible();
  });

  test("About Us should be accessible and rebranded", async ({ page }) => {
    await page.goto("/about-us");
    await expect(page.locator("h1")).toContainText(
      "Reimagining Rental Living in Sri Lanka.",
    );
    // Verify "Meet the team" is gone (implicit by checking general content)
    await expect(page.getByText("Meet the Team")).not.toBeVisible();
  });

  test("Contact Support should have functional form", async ({ page }) => {
    await page.goto("/contact-support");
    await expect(page.locator("h1")).toContainText("We're Here to Help You.");

    const contactForm = page.locator("#contact-form-container form");
    await contactForm
      .locator('input[placeholder="Your Name"]')
      .fill("Test User");
    await contactForm
      .locator('input[placeholder="email@example.com"]')
      .fill("test@user.com");
    await contactForm
      .locator('select[name="subject"]')
      .selectOption("Technical Issue");
    await contactForm
      .locator('textarea[placeholder="How can we help?"]')
      .fill("This is a test message.");

    // Mock successful API response
    await page.route("**/api/contact", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true }),
      });
    });

    // Mock successful API submission
    await contactForm.locator('button[type="submit"]').click();
    await expect(page.getByText(/Message sent successfully/)).toBeVisible({
      timeout: 10000,
    });
  });

  test("Sitemap should be accessible", async ({ page }) => {
    // Sitemap is normally XML, we just check if it returns 200
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
  });
});
