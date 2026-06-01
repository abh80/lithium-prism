import { describe, it, expect, beforeEach } from "vitest";
import "../src/components/lit-spinner";

describe("lit-spinner", () => {
    let el: HTMLElement;
    beforeEach(() => {
        document.body.innerHTML = "<lit-spinner></lit-spinner>";
        el = document.querySelector("lit-spinner")!;
    });

    it("renders a .spinner with an inner svg", () => {
        const spinner = el.shadowRoot!.querySelector(".spinner")!;
        expect(spinner).not.toBeNull();
        expect(spinner.querySelector("svg")).not.toBeNull();
    });

    it("size defaults to 24px on the .spinner element", () => {
        const spinner = el.shadowRoot!.querySelector(".spinner") as HTMLElement;
        expect(spinner.style.getPropertyValue("--size")).toBe("24px");
    });

    it('size="40" sets --size:40px on the .spinner element', async () => {
        el.setAttribute("size", "40");
        await Promise.resolve();
        const spinner = el.shadowRoot!.querySelector(".spinner") as HTMLElement;
        expect(spinner.style.getPropertyValue("--size")).toBe("40px");
    });
});
