import { describe, it, expect, beforeEach } from "vitest";
import "../src/components/lit-button";

describe("lit-button", () => {
    let el: HTMLElement;
    beforeEach(() => {
        document.body.innerHTML = "<lit-button>Go</lit-button>";
        el = document.querySelector("lit-button")!;
    });

    it("renders a shadow <button> with a slot", () => {
        const btn = el.shadowRoot!.querySelector("button")!;
        expect(btn).not.toBeNull();
        expect(btn.querySelector("slot")).not.toBeNull();
        expect(btn.classList.contains("button")).toBe(true);
    });

    it("type defaults to button", () => {
        expect(el.shadowRoot!.querySelector("button")!.type).toBe("button");
    });

    it("reflects variant boolean attributes to classes", async () => {
        el.setAttribute("primary", "");
        el.setAttribute("circle", "");
        await Promise.resolve();
        const cl = el.shadowRoot!.querySelector("button")!.classList;
        expect(cl.contains("primary")).toBe(true);
        expect(cl.contains("circle")).toBe(true);
    });

    it("propagates disabled to the inner button", async () => {
        el.setAttribute("disabled", "");
        await Promise.resolve();
        expect((el.shadowRoot!.querySelector("button") as HTMLButtonElement).disabled).toBe(true);
    });
});
