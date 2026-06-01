import { describe, it, expect, beforeEach } from "vitest";
import "../src/components/lit-checkbox";

describe("lit-checkbox", () => {
    let el: any;
    beforeEach(() => {
        document.body.innerHTML = `<lit-checkbox id="c1" aria-label="agree"></lit-checkbox>`;
        el = document.querySelector("lit-checkbox");
    });
    it("renders a hidden checkbox input and a control with an svg", () => {
        expect(el.shadowRoot.querySelector('input[type="checkbox"]')).not.toBeNull();
        expect(el.shadowRoot.querySelector(".checkbox-control svg")).not.toBeNull();
    });
    it("toggling the input updates checked + emits change", () => {
        let detail: any = null;
        el.addEventListener("change", (e: any) => (detail = e.detail));
        const input = el.shadowRoot.querySelector("input");
        input.checked = true;
        input.dispatchEvent(new Event("change", { bubbles: true }));
        expect(el.hasAttribute("checked")).toBe(true);
        expect(detail).toEqual({ checked: true });
    });
    it("property setter syncs the inner input", () => {
        el.checked = true;
        expect(el.shadowRoot.querySelector("input").checked).toBe(true);
    });
});
