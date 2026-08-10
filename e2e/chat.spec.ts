import { test, expect } from "@playwright/test";

test("user can send a message and see it appear in the chat", async ({ page }) => {
  await page.goto("/chat");

  await expect(page.getByText(/no conversation yet/i)).toBeVisible();

  const input = page.getByLabel(/message/i);
  await input.fill("hello");
  await page.getByRole("button", { name: /send/i }).click();

  // the user's own message should appear in the conversation
  await expect(page.getByText("hello")).toBeVisible();

  // the send button should be replaced by a Stop button while the request is in flight
  await expect(page.getByRole("button", { name: /stop/i })).toBeVisible();
});