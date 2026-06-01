import { describe, it, expect, beforeEach } from "vitest";
import "../src/components/lit-tooltip";

describe("lit-tooltip", () => {
    let el: any;
    beforeEach(() => {
        document.body.innerHTML = `<lit-tooltip text="Hello"><button>Hover me</button></lit-tooltip>`;
        el = document.querySelector("lit-tooltip");
    });

    it("renders the default slot (trigger) plus a tooltip element hidden initially", () => {
        const slot = el.shadowRoot.querySelector("slot");
        expect(slot).not.toBeNull();

        const tip = el.shadowRoot.querySelector(".tooltip");
        expect(tip).not.toBeNull();
        expect(tip.getAttribute("part")).toBe("tip");
        expect(tip.getAttribute("role")).toBe("tooltip");
        // not revealed until interaction
        expect(tip.classList.contains("visible")).toBe(false);
    });

    it("populates the tooltip content from the text attr", () => {
        const tip = el.shadowRoot.querySelector(".tooltip");
        expect(tip.textContent).toBe("Hello");
    });

    it("updates tooltip content when the text attr changes", async () => {
        el.setAttribute("text", "Bye");
        await Promise.resolve();
        expect(el.shadowRoot.querySelector(".tooltip").textContent).toBe("Bye");
    });

    it("reveals the tooltip on pointerenter and hides on pointerleave", () => {
        const tip = el.shadowRoot.querySelector(".tooltip");
        el.dispatchEvent(new Event("pointerenter"));
        expect(tip.classList.contains("visible")).toBe(true);
        el.dispatchEvent(new Event("pointerleave"));
        expect(tip.classList.contains("visible")).toBe(false);
    });

    it("reveals the tooltip on focusin and hides on focusout", () => {
        const tip = el.shadowRoot.querySelector(".tooltip");
        el.dispatchEvent(new Event("focusin", { bubbles: true }));
        expect(tip.classList.contains("visible")).toBe(true);
        el.dispatchEvent(new Event("focusout", { bubbles: true }));
        expect(tip.classList.contains("visible")).toBe(false);
    });
});
