import { describe, it, expect, beforeEach } from "vitest";
import "../src/components/lit-input";

describe("lit-input", () => {
    let el: any;
    beforeEach(() => {
        document.body.innerHTML = `<lit-input id="in" aria-label="name"></lit-input>`;
        el = document.querySelector("lit-input");
    });

    it("renders a label.input-field wrapping an inner input", () => {
        const label = el.shadowRoot.querySelector("label.input-field");
        expect(label).not.toBeNull();
        expect(label.querySelector("input")).not.toBeNull();
    });

    it("small attribute adds the .small class", async () => {
        el.setAttribute("small", "");
        await Promise.resolve();
        expect(el.shadowRoot.querySelector(".input-field").classList.contains("small")).toBe(true);
    });

    it("typing fires input event with { value } and updates el.value", () => {
        let detail: any = null;
        el.addEventListener("input", (e: any) => (detail = e.detail));
        const input = el.shadowRoot.querySelector("input");
        input.value = "hello";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        expect(detail).toEqual({ value: "hello" });
        expect(el.value).toBe("hello");
    });

    it("el.value setter syncs the inner input", async () => {
        el.value = "x";
        await Promise.resolve();
        expect(el.shadowRoot.querySelector("input").value).toBe("x");
    });

    it("disabled reflects to input + adds .disabled class", async () => {
        el.setAttribute("disabled", "");
        await Promise.resolve();
        expect(el.shadowRoot.querySelector("input").disabled).toBe(true);
        expect(el.shadowRoot.querySelector(".input-field").classList.contains("disabled")).toBe(
            true,
        );
    });

    it("provides named leading/trailing slots", () => {
        expect(el.shadowRoot.querySelector('slot[name="leading"]')).not.toBeNull();
        expect(el.shadowRoot.querySelector('slot[name="trailing"]')).not.toBeNull();
    });
});
