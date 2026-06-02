import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const cssText = readFileSync(resolve(__dirname, "../src/theme/lithium.css"), "utf8");

// Extract the first :root { ... } block (the light/base layer) and the dark @media block.
const rootBlock = cssText.match(/:root\s*\{[\s\S]*?\n\}/)?.[0] ?? "";
const darkBlock =
    cssText.match(/@media \(prefers-color-scheme: dark\)\s*\{[\s\S]*?\n\s*\}\s*\n\}/)?.[0] ?? "";

describe("lithium.css tokens", () => {
    it("defines the four base color knobs in :root", () => {
        expect(rootBlock).toMatch(/--lithium-accent:\s*#/);
        expect(rootBlock).toMatch(/--lithium-bg:\s*#/);
        expect(rootBlock).toMatch(/--lithium-fg:\s*#/);
        expect(rootBlock).toContain("--lithium-surface: var(--lithium-accent)");
    });

    it("derives component tokens from the knobs", () => {
        expect(rootBlock).toContain("--lithium-blue: var(--lithium-accent)");
        expect(rootBlock).toContain("--lithium-elevated: var(--lithium-surface)");
        expect(rootBlock).toContain("--bg-surface: var(--lithium-bg)");
        expect(rootBlock).toContain("--primary: var(--lithium-fg)");
    });

    it("derives soft shades via color-mix", () => {
        expect(rootBlock).toMatch(/--lithium-blue-hover:\s*color-mix/);
        expect(rootBlock).toMatch(/--lithium-blue-press:\s*color-mix/);
        expect(rootBlock).toMatch(/--secondary:\s*color-mix/);
        expect(rootBlock).toMatch(/--tertiary:\s*color-mix/);
    });

    it("keeps the elevated tint scale", () => {
        expect(rootBlock).toContain("--lithium-elevated-30:");
        expect(rootBlock).toMatch(/--lithium-elevated-30:\s*color-mix/);
    });

    it("dark mode overrides bg/fg/surface but NOT the accent", () => {
        expect(darkBlock).toContain("--lithium-bg:");
        expect(darkBlock).toContain("--lithium-fg:");
        expect(darkBlock).toContain("--lithium-surface:");
        expect(darkBlock).not.toContain("--lithium-accent:");
    });

    it("no --helium-* tokens remain and non-color tokens intact", () => {
        expect(cssText).not.toMatch(/--helium-/);
        expect(rootBlock).toContain("--gap-1:");
        expect(rootBlock).toContain("--font:");
        expect(cssText).toContain("prefers-color-scheme: dark");
    });
});
