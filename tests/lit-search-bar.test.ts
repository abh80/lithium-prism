import { describe, it, expect, beforeEach } from "vitest";
import "../src/components/lit-search-bar";

describe("lit-search-bar", () => {
    let el: any;
    beforeEach(() => {
        document.body.innerHTML = `<lit-search-bar placeholder="Search…"></lit-search-bar>`;
        el = document.querySelector("lit-search-bar");
    });

    it("renders an input with a leading search svg", () => {
        const input = el.shadowRoot.querySelector("input");
        expect(input).not.toBeNull();
        expect(input.type).toBe("search");
        const svg = el.shadowRoot.querySelector(".input-accessory svg");
        expect(svg).not.toBeNull();
        // search icon: lens circle + handle line (two paths)
        expect(svg.querySelectorAll("path").length).toBe(2);
    });

    it("reflects the placeholder attribute to the input", () => {
        expect(el.shadowRoot.querySelector("input").placeholder).toBe("Search…");
    });

    it("typing fires input with { value }", () => {
        let detail: any = null;
        el.addEventListener("input", (e: any) => (detail = e.detail));
        const input = el.shadowRoot.querySelector("input");
        input.value = "hello";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        expect(detail).toEqual({ value: "hello" });
        expect(el.getAttribute("value")).toBe("hello");
    });

    it("pressing Enter fires search with { value }", () => {
        let detail: any = null;
        el.addEventListener("search", (e: any) => (detail = e.detail));
        const input = el.shadowRoot.querySelector("input");
        input.value = "query";
        input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        expect(detail).toEqual({ value: "query" });
    });

    it("does not fire search on non-Enter keys", () => {
        let fired = false;
        el.addEventListener("search", () => (fired = true));
        const input = el.shadowRoot.querySelector("input");
        input.dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true }));
        expect(fired).toBe(false);
    });

    it("value property syncs the inner input", async () => {
        el.value = "synced";
        await Promise.resolve();
        expect(el.shadowRoot.querySelector("input").value).toBe("synced");
        expect(el.value).toBe("synced");
    });
});
