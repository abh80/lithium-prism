import { describe, it, expect, beforeEach } from "vitest";
import "../src/components/lit-dropdown";

describe("lit-dropdown", () => {
    let el: any;
    beforeEach(() => {
        document.body.innerHTML = `
            <lit-dropdown aria-label="pick">
                <button slot="option" data-value="a">A</button>
                <button slot="option" data-value="b">B</button>
            </lit-dropdown>`;
        el = document.querySelector("lit-dropdown");
    });

    it("renders a trigger button and a panel with a slot for options", () => {
        const trigger = el.shadowRoot.querySelector(".dropdown-trigger");
        const panel = el.shadowRoot.querySelector(".dropdown-panel");
        expect(trigger).not.toBeNull();
        expect(panel).not.toBeNull();
        expect(panel.querySelector('slot[name="option"]')).not.toBeNull();
        // inlined chevron svg lives in the trigger
        expect(trigger.querySelector(".dropdown-icon svg")).not.toBeNull();
    });

    it("open attr toggles the panel visibility class and aria-expanded", async () => {
        const trigger = el.shadowRoot.querySelector(".dropdown-trigger");
        const panel = el.shadowRoot.querySelector(".dropdown-panel");
        expect(panel.classList.contains("open")).toBe(false);
        expect(trigger.getAttribute("aria-expanded")).toBe("false");

        el.setAttribute("open", "");
        await Promise.resolve();

        expect(panel.classList.contains("open")).toBe(true);
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
    });

    it("clicking the trigger toggles open", async () => {
        const trigger = el.shadowRoot.querySelector(".dropdown-trigger");
        expect(el.hasAttribute("open")).toBe(false);

        trigger.click();
        await Promise.resolve();
        expect(el.hasAttribute("open")).toBe(true);

        trigger.click();
        await Promise.resolve();
        expect(el.hasAttribute("open")).toBe(false);
    });

    it("selecting an option emits change with { value } and closes", async () => {
        let detail: any = null;
        el.addEventListener("change", (e: any) => (detail = e.detail));

        el.setAttribute("open", "");
        await Promise.resolve();

        const optionB = el.querySelector('[data-value="b"]');
        optionB.click();
        await Promise.resolve();

        expect(detail).toEqual({ value: "b" });
        expect(el.getAttribute("value")).toBe("b");
        expect(el.hasAttribute("open")).toBe(false);
    });

    it("outside click closes the dropdown", async () => {
        el.setAttribute("open", "");
        await Promise.resolve();
        expect(el.hasAttribute("open")).toBe(true);

        document.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        await Promise.resolve();

        expect(el.hasAttribute("open")).toBe(false);
    });

    it("clicking the trigger does not let the document listener immediately re-close", async () => {
        const trigger = el.shadowRoot.querySelector(".dropdown-trigger");
        trigger.click();
        await Promise.resolve();
        expect(el.hasAttribute("open")).toBe(true);
    });
});
