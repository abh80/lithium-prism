import { describe, it, expect, beforeEach } from "vitest";
import "../src/components/lit-skeleton";
import { LitSkeleton } from "../src/components/lit-skeleton";

describe("lit-skeleton", () => {
    let el: HTMLElement;
    beforeEach(() => {
        document.body.innerHTML = "<lit-skeleton></lit-skeleton>";
        el = document.querySelector("lit-skeleton")!;
    });

    it("renders the skeleton root element with its base class", () => {
        const box = el.shadowRoot!.querySelector(".skeleton")!;
        expect(box).not.toBeNull();
        expect(box.classList.contains("skeleton")).toBe(true);
    });

    it("reflects width/height attributes to inline style on the .skeleton element", async () => {
        el.setAttribute("width", "120px");
        el.setAttribute("height", "20px");
        await Promise.resolve();
        const box = el.shadowRoot!.querySelector(".skeleton") as HTMLElement;
        expect(box.style.width).toBe("120px");
        expect(box.style.height).toBe("20px");
    });

    it("has no inline sizing when width/height are absent", () => {
        const box = el.shadowRoot!.querySelector(".skeleton") as HTMLElement;
        expect(box.style.width).toBe("");
        expect(box.style.height).toBe("");
    });

    it("includes the shimmer/background style rule in the sheet", () => {
        const sheet = LitSkeleton.styles!;
        const rules = Array.from(sheet.cssRules)
            .map((r) => r.cssText)
            .join("\n");
        // base background rule on the skeleton box (renamed --helium-* -> --lithium-*)
        expect(rules).toContain(".skeleton");
        expect(rules).toMatch(/--lithium-elevated-10/);
        // shimmer animation wired on the box + its keyframes
        expect(rules).toMatch(/animation:\s*skeleton/);
        expect(rules).toMatch(/@keyframes skeleton/);
    });
});
