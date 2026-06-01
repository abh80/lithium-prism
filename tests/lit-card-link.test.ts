import { describe, it, expect, beforeEach } from "vitest";
import "../src/components/lit-card-link";

describe("lit-card-link", () => {
    let el: any;
    beforeEach(() => {
        document.body.innerHTML = `<lit-card-link href="https://example.com/page">Go</lit-card-link>`;
        el = document.querySelector("lit-card-link");
    });

    it("renders an inner anchor with a slot", () => {
        const a = el.shadowRoot.querySelector("a");
        expect(a).not.toBeNull();
        expect(a.classList.contains("button")).toBe(true);
        expect(a.classList.contains("card")).toBe(true);
        expect(a.classList.contains("card-link")).toBe(true);
        expect(a.querySelector("slot")).not.toBeNull();
    });

    it("reflects href to the inner anchor", () => {
        const a = el.shadowRoot.querySelector("a");
        expect(a.getAttribute("href")).toBe("https://example.com/page");
        expect(a.href).toBe("https://example.com/page");
    });

    it("defaults target to _blank and reflects an explicit target", async () => {
        const a = el.shadowRoot.querySelector("a");
        expect(a.target).toBe("_blank");
        el.setAttribute("target", "_self");
        await Promise.resolve();
        expect(a.target).toBe("_self");
    });

    it("updates the anchor href when the attribute changes", async () => {
        const a = el.shadowRoot.querySelector("a");
        el.setAttribute("href", "https://example.org/other");
        await Promise.resolve();
        expect(a.getAttribute("href")).toBe("https://example.org/other");
    });
});
