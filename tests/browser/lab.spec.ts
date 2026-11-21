import { expect, test, type Page } from "@playwright/test";

const themes = ["qingge", "kanci", "yingbian"] as const;
const schemes = ["light", "dark"] as const;

async function openWithStorage(
  page: Page,
  path: string,
  values: { theme?: string; scheme?: string; surface?: string } = {},
) {
  await page.addInitScript((stored) => {
    localStorage.clear();
    Object.entries(stored).forEach(([key, value]) => {
      if (typeof value === "string") localStorage.setItem(`zhejiao-${key}`, value);
    });
  }, values);
  await page.goto(path, { waitUntil: "domcontentloaded" });
}

async function rootAttributes(page: Page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    let storedScheme: string | null = null;
    try {
      storedScheme = localStorage.getItem("zhejiao-scheme");
    } catch {
      /* 受限存储仍应允许检查根节点属性。 */
    }
    return {
      theme: root.getAttribute("data-zj-theme"),
      scheme: root.getAttribute("data-zj-scheme"),
      mode: root.getAttribute("data-zj-scheme-mode"),
      surface: root.getAttribute("data-surface"),
      storedScheme,
    };
  });
}

function parseRgb(value: string) {
  const parts = value.match(/[\d.]+/g)?.map(Number);
  if (!parts || parts.length < 3) throw new Error(`无法解析颜色：${value}`);
  return parts.slice(0, 3);
}

function luminance(rgb: number[]) {
  const channels = rgb.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(foreground: string, background: string) {
  const first = luminance(parseRgb(foreground));
  const second = luminance(parseRgb(background));
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

async function renderedTextSamples(page: Page, selectors: string[]) {
  return page.evaluate((requestedSelectors) => {
    const effectiveBackground = (element: Element) => {
      let current: Element | null = element;
      while (current) {
        const background = getComputedStyle(current).backgroundColor;
        if (background !== "rgba(0, 0, 0, 0)" && background !== "transparent") {
          return background;
        }
        current = current.parentElement;
      }
      return getComputedStyle(document.body).backgroundColor;
    };

    return requestedSelectors.flatMap((selector) =>
      Array.from(document.querySelectorAll(selector)).map((element) => ({
        selector,
        text: element.textContent?.trim().replace(/\s+/g, " ") ?? "",
        foreground: getComputedStyle(element).color,
        background: effectiveBackground(element),
      })),
    );
  }, selectors);
}

test("系统偏好只在 system 模式监听，显式明暗会持久化", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await openWithStorage(page, "/");

  await expect.poll(() => rootAttributes(page)).toMatchObject({
    theme: "qingge",
    scheme: "dark",
    mode: "system",
    storedScheme: "system",
  });

  await page.emulateMedia({ colorScheme: "light" });
  await expect
    .poll(async () => (await rootAttributes(page)).scheme)
    .toBe("light");

  await page.getByRole("group", { name: "明暗偏好" }).getByRole("button", { name: "深色" }).click();
  await page.emulateMedia({ colorScheme: "light" });
  await expect
    .poll(() => rootAttributes(page))
    .toMatchObject({ scheme: "dark", mode: "dark", storedScheme: "dark" });

  await page.getByRole("group", { name: "明暗偏好" }).getByRole("button", { name: "系统" }).click();
  await expect
    .poll(() => rootAttributes(page))
    .toMatchObject({ scheme: "light", mode: "system", storedScheme: "system" });
});

test("非法值与受限存储都保留合法主题属性", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await openWithStorage(page, "/", {
    theme: "broken",
    scheme: "sepia",
    surface: "unknown",
  });
  await expect.poll(() => rootAttributes(page)).toMatchObject({
    theme: "qingge",
    scheme: "dark",
    mode: "system",
    surface: "product",
  });

  const restricted = await page.context().newPage();
  await restricted.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException("blocked", "SecurityError");
    };
    Storage.prototype.setItem = () => {
      throw new DOMException("blocked", "SecurityError");
    };
  });
  await restricted.emulateMedia({ colorScheme: "dark" });
  await restricted.goto("/", { waitUntil: "domcontentloaded" });
  await expect
    .poll(() => rootAttributes(restricted))
    .toMatchObject({ theme: "qingge", scheme: "dark", mode: "system", surface: "product" });
  await restricted.close();
});

test("导航与深链让版面状态、正文和表格密度一致", async ({ page }) => {
  await openWithStorage(page, "/product");
  const pageNav = page.getByRole("navigation", { name: "页面" });

  await pageNav.getByRole("link", { name: "阅读", exact: true }).click();
  await expect(page).toHaveURL(/\/reading$/);
  await expect
    .poll(() => rootAttributes(page))
    .toMatchObject({ surface: "reading" });
  await expect
    .poll(() =>
      page.locator("body").evaluate((node) => getComputedStyle(node).fontSize),
    )
    .toBe("18px");

  await pageNav.getByRole("link", { name: "运维", exact: true }).click();
  await expect(page).toHaveURL(/\/infra$/);
  await expect.poll(() => rootAttributes(page)).toMatchObject({ surface: "infra" });
  await expect
    .poll(() => page.locator("body").evaluate((node) => getComputedStyle(node).fontSize))
    .toBe("14px");
  await expect
    .poll(() => page.locator("table").evaluate((node) => getComputedStyle(node).fontSize))
    .toBe("14px");
  await expect
    .poll(() => page.locator("th").first().evaluate((node) => getComputedStyle(node).fontSize))
    .toBe("14px");

  await page.goto("/reading", { waitUntil: "domcontentloaded" });
  await expect.poll(() => rootAttributes(page)).toMatchObject({ surface: "reading" });

  await page.goto("/product", { waitUntil: "domcontentloaded" });
  await expect.poll(() => rootAttributes(page)).toMatchObject({ surface: "product" });
});

test("六套正文、普通与选中弱化文字、主动作和输入边界可读", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/product", { waitUntil: "domcontentloaded" });

  for (const theme of themes) {
    for (const scheme of schemes) {
      await page.evaluate(
        ({ selectedTheme, selectedScheme }) => {
          localStorage.setItem("zhejiao-theme", selectedTheme);
          localStorage.setItem("zhejiao-scheme", selectedScheme);
          localStorage.setItem("zhejiao-surface", "product");
        },
        { selectedTheme: theme, selectedScheme: scheme },
      );
      await page.reload({ waitUntil: "domcontentloaded" });
      await expect.poll(() => rootAttributes(page)).toMatchObject({ theme, scheme });

      const colors = await page.evaluate(() => {
        const effectiveBackground = (element: Element) => {
          let current: Element | null = element;
          while (current) {
            const background = getComputedStyle(current).backgroundColor;
            if (background !== "rgba(0, 0, 0, 0)" && background !== "transparent") {
              return background;
            }
            current = current.parentElement;
          }
          return "rgb(255, 255, 255)";
        };
        const body = getComputedStyle(document.body);
        const normalMuted = getComputedStyle(
          document.querySelector(".ticket:not(.is-selected) .ticket-meta") as Element,
        );
        const selectedMuted = getComputedStyle(
          document.querySelector(".ticket.is-selected .ticket-meta") as Element,
        );
        const action = getComputedStyle(
          document.querySelector(".detail .btn-primary") as Element,
        );
        const input = getComputedStyle(document.querySelector(".filters input") as Element);
        return {
          text: body.color,
          canvas: body.backgroundColor,
          normalMuted: normalMuted.color,
          normalSurface: effectiveBackground(
            document.querySelector(".ticket:not(.is-selected)") as Element,
          ),
          selectedMuted: selectedMuted.color,
          selectedSurface: effectiveBackground(
            document.querySelector(".ticket.is-selected") as Element,
          ),
          actionFg: action.color,
          actionBg: action.backgroundColor,
          inputBg: input.backgroundColor,
          inputBorder: input.borderTopColor,
        };
      });

      expect(contrast(colors.text, colors.canvas), `${theme}/${scheme} 正文`).toBeGreaterThanOrEqual(4.5);
      expect(
        contrast(colors.normalMuted, colors.normalSurface),
        `${theme}/${scheme} 普通工单弱化文字`,
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrast(colors.selectedMuted, colors.selectedSurface),
        `${theme}/${scheme} 选中工单弱化文字`,
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrast(colors.actionFg, colors.actionBg),
        `${theme}/${scheme} 主按钮`,
      ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrast(colors.inputBorder, colors.inputBg),
        `${theme}/${scheme} 输入边界`,
      ).toBeGreaterThanOrEqual(3);

      const actionButton = page.locator(".detail .btn-primary");
      await actionButton.hover();
      const actionHover = await actionButton.evaluate((node) => {
        const style = getComputedStyle(node);
        return { foreground: style.color, background: style.backgroundColor };
      });
      expect(
        contrast(actionHover.foreground, actionHover.background),
        `${theme}/${scheme} 主按钮 hover`,
      ).toBeGreaterThanOrEqual(4.5);

      await page.locator(".filters input").focus();
      const focus = await page
        .locator(".filters input")
        .evaluate((node) => {
          const style = getComputedStyle(node);
          return {
            width: style.outlineWidth,
            style: style.outlineStyle,
            color: style.outlineColor,
            background: style.backgroundColor,
          };
        });
      expect(focus.style, `${theme}/${scheme} 焦点`).not.toBe("none");
      expect(Number.parseFloat(focus.width)).toBeGreaterThanOrEqual(2);
      expect(
        contrast(focus.color, focus.background),
        `${theme}/${scheme} 焦点环`,
      ).toBeGreaterThanOrEqual(3);
    }
  }
});

test("原生对话框隔离背景、循环焦点并经受父级重渲染", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await openWithStorage(page, "/gallery", { scheme: "system" });

  await page.getByRole("button", { name: "发出提示" }).click();
  await page.getByRole("button", { name: "打开对话框" }).click();
  const dialog = page.locator("dialog[open]");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveJSProperty("open", true);
  expect(await dialog.evaluate((node: HTMLDialogElement) => node.matches(":modal"))).toBe(true);
  await expect(page.locator(":focus")).toHaveText("取消");

  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toHaveText("交给夜班");
  await page.waitForTimeout(4_200);
  await expect(page.locator(":focus")).toHaveText("交给夜班");

  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toHaveText("取消");
  await page.keyboard.press("Shift+Tab");
  await expect(page.locator(":focus")).toHaveText("交给夜班");

  const outsideFocus = await page.evaluate(() => {
    const logo = document.querySelector<HTMLElement>(".logo-link");
    logo?.focus();
    return {
      activeClass: document.activeElement?.className ?? "",
      insideDialog: Boolean(document.activeElement?.closest("dialog[open]")),
    };
  });
  expect(outsideFocus.activeClass).not.toContain("logo-link");
  expect(outsideFocus.insideDialog).toBe(true);

  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("button", { name: "打开对话框" })).toBeFocused();

  await page.getByRole("button", { name: "打开对话框" }).click();
  await expect(dialog).toBeVisible();
  const bounds = await dialog.boundingBox();
  expect(bounds).not.toBeNull();
  if (!bounds) throw new Error("对话框缺少可点击边界");

  await page.mouse.click(bounds.x + 8, bounds.y + 8);
  await expect(dialog).toBeVisible();

  await page.mouse.click(Math.max(1, bounds.x - 12), bounds.y + bounds.height / 2);
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole("button", { name: "打开对话框" })).toBeFocused();
});

test("产品样张的本地表单、四种状态和副作用边界可用", async ({ page }) => {
  await openWithStorage(page, "/patterns");
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.resourceType() === "fetch" || request.resourceType() === "xhr") {
      requests.push(request.url());
    }
  });

  await page.getByLabel("输入消息").fill("列出还没关闭的紧急工单");
  await page.getByRole("button", { name: "发送本地消息" }).click();
  await expect(page.getByText("列出还没关闭的紧急工单", { exact: true })).toBeVisible();
  await expect(page.getByText("这是固定样例回应。", { exact: true })).toBeVisible();

  await page.getByLabel("草稿标题").fill("清晨交接");
  await page.getByLabel("创作要求").fill("列出未结工单并标出下一步。");
  await page.getByRole("button", { name: "生成本地草稿" }).click();
  await expect(page.locator(".draft-preview pre")).toContainText("《清晨交接》");

  const scenario = page.getByLabel("场景状态");
  await scenario.selectOption("empty");
  await expect(page.getByText("还没有对话", { exact: true })).toBeVisible();
  await expect(page.getByText("还没有草稿", { exact: true })).toBeVisible();

  await scenario.selectOption("loading");
  await expect(page.getByText("正在加载历史对话", { exact: true })).toBeVisible();
  await expect(page.getByText("正在生成结构", { exact: true })).toBeVisible();

  await scenario.selectOption("error");
  await expect(
    page.getByRole("alert").filter({ hasText: "本地样例未能载入" }),
  ).toBeVisible();
  await expect(page.getByRole("alert").filter({ hasText: "本地草稿没有载入" })).toBeVisible();
  await page
    .getByRole("alert")
    .filter({ hasText: "本地样例未能载入" })
    .getByRole("button", { name: "重试本地样例" })
    .click();
  await expect(page.getByText("东门读卡器仍在人工核验；地库授时偏差等待复核。")).toBeVisible();
  expect(requests).toEqual([]);
});

test("重试样例状态时保留用户输入、消息和已生成草稿", async ({ page }) => {
  await openWithStorage(page, "/patterns");

  await page.getByLabel("草稿标题").fill("清晨交接");
  await page.getByLabel("创作要求").fill("列出未结工单并标出下一步。");
  await page.getByRole("button", { name: "生成本地草稿" }).click();
  await expect(page.locator(".draft-preview pre")).toContainText("《清晨交接》");

  await page.getByLabel("输入消息").fill("保留的已发消息");
  await page.getByRole("button", { name: "发送本地消息" }).click();
  await expect(page.getByText("保留的已发消息", { exact: true })).toBeVisible();
  await page.getByLabel("输入消息").fill("保留的未发送消息");

  await page.getByLabel("场景状态").selectOption("error");
  await page
    .getByRole("alert")
    .filter({ hasText: "本地样例未能载入" })
    .getByRole("button", { name: "重试本地样例" })
    .click();

  await expect(page.getByLabel("草稿标题")).toHaveValue("清晨交接");
  await expect(page.getByLabel("创作要求")).toHaveValue("列出未结工单并标出下一步。");
  await expect(page.getByLabel("输入消息")).toHaveValue("保留的未发送消息");
  await expect(page.getByText("保留的已发消息", { exact: true })).toBeVisible();
  await expect(page.locator(".draft-preview pre")).toContainText("《清晨交接》");
});

test("六套产品样张的状态文字与消息使用真实渲染对比度", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/patterns", { waitUntil: "domcontentloaded" });

  const scenarios = [
    {
      id: "normal",
      selectors: [
        '.message-list li[data-from="me"] p',
        '.message-list li[data-from="me"] .message-author',
        '.message-list li[data-from="echotalk"] p',
        '.message-list li[data-from="echotalk"] .message-author',
        ".sample-help",
        ".sample-head h2",
        ".draft-preview .sample-kicker",
        ".draft-preview pre",
      ],
    },
    {
      id: "empty",
      selectors: [".sample-state p", ".draft-preview p"],
    },
    {
      id: "loading",
      selectors: [".sample-state-title"],
    },
    {
      id: "error",
      selectors: [
        ".sample-state-error .sample-state-title",
        ".sample-state-error > p",
        ".sample-state-error button",
        ".draft-preview p",
      ],
    },
  ] as const;

  for (const theme of themes) {
    for (const scheme of schemes) {
      await page.evaluate(
        ({ selectedTheme, selectedScheme }) => {
          localStorage.setItem("zhejiao-theme", selectedTheme);
          localStorage.setItem("zhejiao-scheme", selectedScheme);
          localStorage.setItem("zhejiao-surface", "product");
        },
        { selectedTheme: theme, selectedScheme: scheme },
      );
      await page.reload({ waitUntil: "domcontentloaded" });
      await expect.poll(() => rootAttributes(page)).toMatchObject({ theme, scheme });
      await page.waitForTimeout(420);

      for (const scenario of scenarios) {
        if (scenario.id !== "normal") {
          await page.getByLabel("场景状态").selectOption(scenario.id);
          await page.waitForTimeout(420);
        }
        const samples = await renderedTextSamples(page, [...scenario.selectors]);
        expect(samples.length, `${theme}/${scheme}/${scenario.id} 样张文字节点`).toBeGreaterThan(
          0,
        );
        for (const sample of samples) {
          expect(sample.text, `${theme}/${scheme}/${scenario.id} ${sample.selector} 文本`).not.toBe(
            "",
          );
          expect(
            contrast(sample.foreground, sample.background),
            `${theme}/${scheme}/${scenario.id} ${sample.selector} “${sample.text}” ${sample.foreground}/${sample.background}`,
          ).toBeGreaterThanOrEqual(4.5);
        }
      }
    }
  }
});

test("启动脚本在 React 接管前拒绝对象原型键", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  const cases = [
    { theme: "constructor", surface: "toString" },
    { theme: "__proto__", surface: "constructor" },
    { theme: "toString", surface: "__proto__" },
  ];

  for (const values of cases) {
    const probe = await page.context().newPage();
    await probe.emulateMedia({ colorScheme: "light" });
    await probe.route("**/src/main.tsx", (route) => route.abort());
    await probe.addInitScript((stored) => {
      localStorage.clear();
      localStorage.setItem("zhejiao-theme", stored.theme);
      localStorage.setItem("zhejiao-scheme", "system");
      localStorage.setItem("zhejiao-surface", stored.surface);
    }, values);
    await probe.goto("/", { waitUntil: "domcontentloaded" });

    await expect.poll(() => rootAttributes(probe)).toMatchObject({
      theme: "qingge",
      scheme: "light",
      mode: "system",
      surface: "product",
    });
    await expect(probe.locator("#root")).toBeEmpty();
    await probe.close();
  }
});

test("390px 下六套组合没有整页横向溢出", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/patterns", { waitUntil: "domcontentloaded" });

  for (const theme of themes) {
    for (const scheme of schemes) {
      await page.evaluate(
        ({ selectedTheme, selectedScheme }) => {
          localStorage.setItem("zhejiao-theme", selectedTheme);
          localStorage.setItem("zhejiao-scheme", selectedScheme);
          localStorage.setItem("zhejiao-surface", "product");
        },
        { selectedTheme: theme, selectedScheme: scheme },
      );
      await page.reload({ waitUntil: "domcontentloaded" });
      const dimensions = await page.evaluate(() => ({
        viewport: window.innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
      }));
      expect(dimensions.document, `${theme}/${scheme} document`).toBeLessThanOrEqual(
        dimensions.viewport,
      );
      expect(dimensions.body, `${theme}/${scheme} body`).toBeLessThanOrEqual(dimensions.viewport);
    }
  }
});

test("echotalk 根主题的真实宿主 light/dark 变量不会覆盖 adapter", async ({ page }) => {
  await page.goto("/tests/fixtures/adapter-echotalk-host.html", {
    waitUntil: "domcontentloaded",
  });
  const rendered = () =>
    page.evaluate(() => {
      const surface = getComputedStyle(document.querySelector("#echotalk-rendered") as Element);
      const action = getComputedStyle(document.querySelector("#echotalk-action") as Element);
      return {
        background: surface.backgroundColor,
        text: surface.color,
        radius: surface.borderRadius,
        action: action.backgroundColor,
        actionText: action.color,
      };
    });

  await expect.poll(rendered).toEqual({
    background: "rgb(251, 252, 252)",
    text: "rgb(37, 49, 58)",
    radius: "6px",
    action: "rgb(15, 110, 102)",
    actionText: "rgb(244, 255, 253)",
  });

  await page.evaluate(() => {
    document.documentElement.dataset.zjScheme = "dark";
  });
  await expect.poll(rendered).toEqual({
    background: "rgb(21, 27, 36)",
    text: "rgb(237, 247, 246)",
    radius: "6px",
    action: "rgb(82, 216, 202)",
    actionText: "rgb(8, 34, 31)",
  });
});

test("Nexty 根主题的 :root 与 .dark 变量不会覆盖 adapter", async ({ page }) => {
  await page.goto("/tests/fixtures/adapter-nexty-host.html", {
    waitUntil: "domcontentloaded",
  });
  const rendered = () =>
    page.evaluate(() => {
      const surface = getComputedStyle(document.querySelector("#nexty-rendered") as Element);
      const action = getComputedStyle(document.querySelector("#nexty-action") as Element);
      return {
        background: surface.backgroundColor,
        text: surface.color,
        action: action.backgroundColor,
        actionText: action.color,
      };
    });

  await expect.poll(rendered).toEqual({
    background: "rgb(21, 27, 36)",
    text: "rgb(237, 247, 246)",
    action: "rgb(82, 216, 202)",
    actionText: "rgb(8, 34, 31)",
  });

  await page.evaluate(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.dataset.zjTheme = "kanci";
    document.documentElement.dataset.zjScheme = "light";
  });
  await expect.poll(rendered).toEqual({
    background: "rgb(238, 241, 243)",
    text: "rgb(22, 23, 26)",
    action: "rgb(155, 35, 53)",
    actionText: "rgb(255, 247, 247)",
  });
});

test("inline 主题 scope 的渲染子元素由 adapter 驱动", async ({ page }) => {
  await page.goto("/tests/fixtures/adapter.html", { waitUntil: "domcontentloaded" });
  const rendered = await page.evaluate(() => {
    const echotalk = getComputedStyle(document.querySelector("#echotalk-rendered") as Element);
    const echotalkAction = getComputedStyle(
      document.querySelector("#echotalk-rendered button") as Element,
    );
    const nexty = getComputedStyle(document.querySelector("#nexty-rendered") as Element);
    const nextyAction = getComputedStyle(
      document.querySelector("#nexty-rendered button") as Element,
    );
    return {
      echotalk: {
        background: echotalk.backgroundColor,
        text: echotalk.color,
        radius: echotalk.borderRadius,
        action: echotalkAction.backgroundColor,
        actionText: echotalkAction.color,
      },
      nexty: {
        background: nexty.backgroundColor,
        text: nexty.color,
        action: nextyAction.backgroundColor,
        actionText: nextyAction.color,
      },
    };
  });
  expect(rendered.echotalk).toEqual({
    background: "rgb(21, 27, 36)",
    text: "rgb(237, 247, 246)",
    radius: "6px",
    action: "rgb(82, 216, 202)",
    actionText: "rgb(8, 34, 31)",
  });
  expect(rendered.nexty).toEqual({
    background: "rgb(238, 241, 243)",
    text: "rgb(22, 23, 26)",
    action: "rgb(155, 35, 53)",
    actionText: "rgb(255, 247, 247)",
  });
});

test("未 opt-in 的 `.dark` 宿主保持自己的 color-scheme", async ({ page }) => {
  await page.goto("/tests/fixtures/no-opt-in.html", { waitUntil: "domcontentloaded" });
  await expect
    .poll(() =>
      page.evaluate(() => ({
        colorScheme: getComputedStyle(document.documentElement).colorScheme,
        theme: document.documentElement.dataset.zjTheme,
        scheme: document.documentElement.dataset.zjScheme,
      })),
    )
    .toEqual({
      colorScheme: "dark",
      theme: undefined,
      scheme: undefined,
    });
});

test("嵌套青格 scope 恢复本地字体与圆角", async ({ page }) => {
  await page.goto("/tests/fixtures/theme-nesting.html", { waitUntil: "domcontentloaded" });
  const probes = await page.evaluate(() =>
    Object.fromEntries(
      Array.from(document.querySelectorAll<HTMLElement>(".theme-probe")).map((element) => {
        const style = getComputedStyle(element);
        return [
          element.id,
          {
            fontFamily: style.fontFamily,
            radius: style.borderRadius,
          },
        ];
      }),
    ),
  );

  expect(probes["kanci-probe"]).toMatchObject({
    radius: "2px",
  });
  expect(probes["kanci-probe"]?.fontFamily).toContain("Source Serif 4");
  expect(probes["yingbian-probe"]).toMatchObject({
    radius: "0px",
  });
  expect(probes["yingbian-probe"]?.fontFamily).toContain("Satoshi");
  for (const id of [
    "kanci-qingge-light",
    "kanci-qingge-dark",
    "yingbian-qingge-light",
    "yingbian-qingge-dark",
    "qingge-sibling-probe",
  ]) {
    expect(probes[id], id).toMatchObject({
      radius: "4px",
    });
    expect(probes[id]?.fontFamily, id).toContain("IBM Plex Sans");
  }
});

test("reduced-motion 关闭控件过渡和对话框动画", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openWithStorage(page, "/gallery");
  const transition = await page
    .locator(".btn")
    .first()
    .evaluate((node) => getComputedStyle(node).transitionDuration);
  expect(transition.split(",").every((value) => Number.parseFloat(value) === 0)).toBe(true);

  await page.getByRole("button", { name: "打开对话框" }).click();
  const animation = await page
    .locator("dialog[open]")
    .evaluate((node) => getComputedStyle(node).animationName);
  expect(animation).toBe("none");
});
