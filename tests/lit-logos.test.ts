import { describe, it, expect, beforeEach } from "vitest";
import "../src/components/lit-helium-logo";
import "../src/components/lit-helium-text";

describe("helium logos", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("lit-helium-logo renders an svg", () => {
        document.body.innerHTML = `<lit-helium-logo></lit-helium-logo>`;
        const el = document.querySelector("lit-helium-logo")!;
        const svg = el.shadowRoot!.querySelector("svg");
        expect(svg).not.toBeNull();
        expect(svg!.getAttribute("viewBox")).toBe("0 0 256 256");
        expect(svg!.querySelector("path")).not.toBeNull();
    });

    it("lit-helium-text renders an svg", () => {
        document.body.innerHTML = `<lit-helium-text></lit-helium-text>`;
        const el = document.querySelector("lit-helium-text")!;
        const svg = el.shadowRoot!.querySelector("svg");
        expect(svg).not.toBeNull();
        expect(svg!.getAttribute("viewBox")).toBe("0 0 1123 256");
        expect(svg!.querySelectorAll("path").length).toBe(2);
    });
});
