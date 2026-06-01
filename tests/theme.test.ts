import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const cssText = readFileSync(resolve(__dirname, "../src/theme/lithium.css"), "utf8");

describe("lithium.css tokens", () => {
    it("defines renamed --lithium-* tokens", () => {
        expect(cssText).toContain("--lithium-blue:");
        expect(cssText).toContain("--lithium-elevated:");
        expect(cssText).toContain("--lithium-elevated-30:");
    });
    it("no --helium-* tokens remain", () => {
        expect(cssText).not.toMatch(/--helium-/);
    });
    it("keeps non-prefixed tokens and dark mode", () => {
        expect(cssText).toContain("--primary:");
        expect(cssText).toContain("prefers-color-scheme: dark");
    });
});
