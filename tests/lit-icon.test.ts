import { describe, it, expect, beforeEach } from "vitest";
import "../src/components/lit-icon";

describe("lit-icon", () => {
    let el: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("renders an svg containing the check path for name=check", () => {
        document.body.innerHTML = `<lit-icon name="check"></lit-icon>`;
        el = document.querySelector("lit-icon")!;
        const svg = el.shadowRoot!.querySelector("svg");
        expect(svg).not.toBeNull();
        const path = svg!.querySelector("path");
        expect(path!.getAttribute("d")).toBe("M5 12l5 5l10 -10");
    });

    it("renders empty for an unknown name", () => {
        document.body.innerHTML = `<lit-icon name="not-a-real-icon"></lit-icon>`;
        el = document.querySelector("lit-icon")!;
        expect(el.shadowRoot!.querySelector("svg")).toBeNull();
        expect(el.shadowRoot!.innerHTML).toBe("");
    });

    it("renders empty when no name is given", () => {
        document.body.innerHTML = `<lit-icon></lit-icon>`;
        el = document.querySelector("lit-icon")!;
        expect(el.shadowRoot!.querySelector("svg")).toBeNull();
        expect(el.shadowRoot!.innerHTML).toBe("");
    });

    it("updates the svg when name changes", async () => {
        document.body.innerHTML = `<lit-icon name="check"></lit-icon>`;
        el = document.querySelector("lit-icon")!;
        el.setAttribute("name", "x");
        await Promise.resolve();
        const paths = el.shadowRoot!.querySelectorAll("path");
        expect(paths.length).toBe(2);
        expect(paths[0].getAttribute("d")).toBe("M18 6l-12 12");
    });
});
