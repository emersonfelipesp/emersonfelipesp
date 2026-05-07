import { test, type Page } from "@playwright/test";

export function isMobile() {
  return test.info().project.name === "mobile-chromium";
}

export function languageTrigger(page: Page) {
  return isMobile()
    ? page.getByRole("button", { name: /^Language:/ })
    : page.getByRole("button", { name: /--lang=/ });
}

export function languageTriggerPt(page: Page) {
  return isMobile()
    ? page.getByRole("button", { name: /^Idioma:/ })
    : page.getByRole("button", { name: /--idioma=/ });
}

export function themeTrigger(page: Page) {
  return isMobile()
    ? page.getByRole("button", { name: /^Theme:/ })
    : page.getByRole("button", { name: /--theme=/ });
}

export async function gotoTopNavRoute(
  page: Page,
  href: string,
  routeLabel: string,
) {
  if (isMobile()) {
    const nav = page.getByRole("navigation", { name: "Top navigation" });
    await nav.getByRole("button", { name: /^Route:/ }).click();
    await page
      .getByRole("listbox", { name: /^(Route|Rota)$/ })
      .getByRole("option", { name: routeLabel, exact: true })
      .click();
  } else {
    const nav = page.getByRole("navigation", { name: "Top navigation" });
    await nav.getByRole("link", { name: routeLabel }).first().click();
  }
}
