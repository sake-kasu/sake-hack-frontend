// @vitest-environment jsdom
import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import RandomBoozeSpinner from "@/components/ui/RandomBoozeSpinner";

describe("RandomBoozeSpinner", () => {
  afterEach(() => {
    cleanup();
  });

  // ===== レンダリング =====

  it("デフォルトpropsでレンダリングされる", () => {
    const { container } = render(<RandomBoozeSpinner />);
    const svg = container.querySelector("svg");
    expect(svg).toBeTruthy();
  });

  it("カスタムsize propが反映される", () => {
    const { container } = render(<RandomBoozeSpinner size={64} />);
    const wrapper = container.firstElementChild;
    expect(wrapper).toBeTruthy();
    expect(wrapper?.getAttribute("style")).toContain("width: 64px");
    expect(wrapper?.getAttribute("style")).toContain("height: 64px");
  });

  it("animationスタイルが設定される", () => {
    const { container } = render(<RandomBoozeSpinner />);
    const allDivs = container.querySelectorAll("div div");
    const animatedDiv = Array.from(allDivs).find((el) =>
      el.getAttribute("style")?.includes("booze-"),
    );
    expect(animatedDiv).toBeTruthy();
  });

  // ===== バリエーション =====

  it("4つのバリエーションのいずれかがレンダリングされる", () => {
    const iconTestIds = [
      "SportsBarIcon",
      "LocalBarIcon",
      "LiquorOutlinedIcon",
      "WineBarIcon",
    ];

    const renderedIcons = new Set<string>();

    for (let i = 0; i < 100; i++) {
      vi.spyOn(Math, "random").mockReturnValue(i / 100);
      const { container, unmount } = render(<RandomBoozeSpinner />);
      const svg = container.querySelector("svg");
      if (svg) {
        const testId = svg.getAttribute("data-testid");
        if (testId) {
          renderedIcons.add(testId);
        }
      }
      unmount();
      vi.restoreAllMocks();
    }

    expect(renderedIcons.size).toBe(4);
    for (const iconId of iconTestIds) {
      expect(renderedIcons.has(iconId)).toBe(true);
    }
  });
});
