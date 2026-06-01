import { describe, it, expect, beforeEach } from "vitest";
import "../src/components/lit-toggle";

describe("lit-toggle", () => {
    let el: any;
    beforeEach(() => {
        document.body.innerHTML = `<lit-toggle name="Wi-Fi" desc="net"></lit-toggle>`;
        el = document.querySelector("lit-toggle");
    });

    it("renders role=switch with aria-checked reflecting state", () => {
        const b = el.shadowRoot.querySelector("button");
        expect(b.getAttribute("role")).toBe("switch");
        expect(b.getAttribute("aria-checked")).toBe("false");
    });
    it("renders name and desc text", () => {
        expect(el.shadowRoot.querySelector("h4")!.textContent).toBe("Wi-Fi");
        expect(el.shadowRoot.querySelector("p")!.textContent).toBe("net");
    });
    it("click toggles checked, adds .enabled, emits change with detail", async () => {
        let detail: any = null;
        el.addEventListener("change", (e: any) => (detail = e.detail));
        el.shadowRoot.querySelector("button").click();
        await Promise.resolve();
        expect(el.hasAttribute("checked")).toBe(true);
        expect(el.shadowRoot.querySelector(".toggle").classList.contains("enabled")).toBe(true);
        expect(detail).toEqual({ checked: true });
    });
    it("property setter reflects to attribute", () => {
        el.checked = true;
        expect(el.hasAttribute("checked")).toBe(true);
    });
    it("disabled blocks toggle", () => {
        el.setAttribute("disabled", "");
        el.shadowRoot.querySelector("button").click();
        expect(el.hasAttribute("checked")).toBe(false);
    });
});
