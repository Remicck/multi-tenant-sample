import { expect } from "@playwright/test";
import { Base } from "./Common";

export class TopPage extends Base {
  async goTo() {
    await this.page.goto("/");
  }

  async expectUI(state: "signIn" | "signOut") {
    if (state === "signIn") {
      await expect(
        this.page.getByRole("button", { name: "Delete my items" }),
      ).toBeVisible();
    }

    if (state === "signOut") {
      await expect(
        this.page.getByRole("button", { name: "Delete my items" }),
      ).not.toBeVisible();
    }
  }

  async getItems() {
    const items = await this.page
      .getByRole("list", { name: "items" })
      .getByRole("listitem")
      .all();
    const res = await Promise.all(
      items.map(async (item) => {
        const img = await item.getByRole("img").getAttribute("src");
        const title = await item.getByRole("heading").innerText();

        return {
          img,
          title,
        };
      }),
    );
    // resの1行だけを返す
    if (res.length > 0) return [res[0]];

    return res;
  }

  async deleteAllItems() {
    await this.page.getByRole("button", { name: "Delete my items" }).click();
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
  }
}
