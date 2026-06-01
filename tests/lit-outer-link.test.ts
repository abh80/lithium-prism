import { describe, it, expect, beforeEach } from "vitest";
import "../src/components/lit-outer-link";

describe("lit-outer-link", () => {
    let el: HTMLElement;
    beforeEach(() => {
        document.body.innerHTML = `<lit-outer-link href="https://example.com">Visit</lit-outer-link>`;
        el = document.querySelector("lit-outer-link")!;
    });

    it("renders an inner <a> with a slot", () => {
        const a = el.shadowRoot!.querySelector("a")!;
        expect(a).not.toBeNull();
        expect(a.classList.contains("outer-link")).toBe(true);
        expect(a.querySelector("slot")).not.toBeNull();
    });

    it("reflects href to the inner anchor", () => {
        const a = el.shadowRoot!.querySelector("a")!;
        expect(a.getAttribute("href")).toBe("https://example.com");
    });

    it("defaults target to _blank when not set", () => {
        const a = el.shadowRoot!.querySelector("a")!;
        expect(a.getAttribute("target")).toBe("_blank");
    });

    it("defaults rel to contain noopener when not set", () => {
        const a = el.shadowRoot!.querySelector("a")!;
        expect(a.getAttribute("rel")).toContain("noopener");
    });

    it("honors an explicit target attribute", async () => {
        el.setAttribute("target", "_self");
        await Promise.resolve();
        const a = el.shadowRoot!.querySelector("a")!;
        expect(a.getAttribute("target")).toBe("_self");
    });

    it("honors an explicit rel attribute", async () => {
        el.setAttribute("rel", "nofollow");
        await Promise.resolve();
        const a = el.shadowRoot!.querySelector("a")!;
        expect(a.getAttribute("rel")).toBe("nofollow");
    });

    it("does not force target/rel for fragment links", async () => {
        document.body.innerHTML = `<lit-outer-link href="#section">Anchor</lit-outer-link>`;
        const frag = document.querySelector("lit-outer-link")!;
        await Promise.resolve();
        const a = frag.shadowRoot!.querySelector("a")!;
        expect(a.hasAttribute("target")).toBe(false);
        expect(a.hasAttribute("rel")).toBe(false);
    });

    it("does not render an external-link icon (upstream has none)", () => {
        // Upstream OuterLink.svelte renders a plain <a> with no inline icon.
        const a = el.shadowRoot!.querySelector("a")!;
        expect(a.querySelector("svg")).toBeNull();
    });
});
