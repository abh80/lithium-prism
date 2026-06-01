import { describe, it, expect, beforeEach, vi } from "vitest";
import "../src/components/lit-copy-icon";

describe("lit-copy-icon", () => {
    let el: any;
    let writeText: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        writeText = vi.fn().mockResolvedValue(undefined);
        Object.defineProperty(navigator, "clipboard", {
            configurable: true,
            value: { writeText },
        });
        document.body.innerHTML = `<lit-copy-icon value="hello"></lit-copy-icon>`;
        el = document.querySelector("lit-copy-icon");
    });

    it("renders a button containing the copy svg and the check svg", () => {
        const btn = el.shadowRoot.querySelector("button");
        expect(btn).not.toBeNull();
        expect(el.shadowRoot.querySelector(".icon-copy svg")).not.toBeNull();
        expect(el.shadowRoot.querySelector(".icon-check svg")).not.toBeNull();
    });

    it("clicking copies the value attribute to the clipboard and emits copy {value}", async () => {
        let detail: any = null;
        el.addEventListener("copy", (e: any) => (detail = e.detail));
        el.shadowRoot.querySelector("button").click();
        await Promise.resolve();
        await Promise.resolve();
        expect(writeText).toHaveBeenCalledTimes(1);
        expect(writeText).toHaveBeenCalledWith("hello");
        expect(detail).toEqual({ value: "hello" });
    });

    it("shows the check icon after a successful copy (class swap)", async () => {
        const anim = el.shadowRoot.querySelector(".copy-animation");
        expect(anim.classList.contains("check")).toBe(false);
        el.shadowRoot.querySelector("button").click();
        await Promise.resolve();
        await Promise.resolve();
        expect(anim.classList.contains("check")).toBe(true);
    });

    it("the check class clears after the timeout", async () => {
        vi.useFakeTimers();
        const anim = el.shadowRoot.querySelector(".copy-animation");
        el.shadowRoot.querySelector("button").click();
        await vi.runAllTimersAsync();
        expect(anim.classList.contains("check")).toBe(false);
        vi.useRealTimers();
    });
});
