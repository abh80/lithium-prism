import { describe, it, expect, beforeEach } from "vitest";
import "../src/components/lit-text";

describe("lit-text", () => {
    let el: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = "";
    });

    it("default renders inner p.text wrapping a slot", () => {
        document.body.innerHTML = "<lit-text>Hello</lit-text>";
        el = document.querySelector("lit-text")!;
        const inner = el.shadowRoot!.firstElementChild!;
        expect(inner.tagName).toBe("P");
        expect(inner.classList.contains("text")).toBe(true);
        expect(inner.querySelector("slot")).not.toBeNull();
    });

    it('variant="title" with no tag renders inner h2', () => {
        document.body.innerHTML = `<lit-text variant="title">T</lit-text>`;
        el = document.querySelector("lit-text")!;
        expect(el.shadowRoot!.firstElementChild!.tagName).toBe("H2");
    });

    it("maps display->h1, title->h2, heading->h3, subheading->h4, else->p", () => {
        const cases: Record<string, string> = {
            display: "H1",
            title: "H2",
            heading: "H3",
            subheading: "H4",
            body: "P",
            caption: "P",
        };
        for (const [variant, tag] of Object.entries(cases)) {
            document.body.innerHTML = `<lit-text variant="${variant}">x</lit-text>`;
            const node = document.querySelector("lit-text")!;
            expect(node.shadowRoot!.firstElementChild!.tagName).toBe(tag);
        }
    });

    it('explicit tag="span" overrides variant', () => {
        document.body.innerHTML = `<lit-text tag="span" variant="title">x</lit-text>`;
        el = document.querySelector("lit-text")!;
        expect(el.shadowRoot!.firstElementChild!.tagName).toBe("SPAN");
    });

    it('tone="secondary" adds .tone-secondary', async () => {
        document.body.innerHTML = `<lit-text tone="secondary">x</lit-text>`;
        el = document.querySelector("lit-text")!;
        await Promise.resolve();
        expect(el.shadowRoot!.firstElementChild!.classList.contains("tone-secondary")).toBe(true);
    });

    it("center adds .center", async () => {
        document.body.innerHTML = `<lit-text center>x</lit-text>`;
        el = document.querySelector("lit-text")!;
        await Promise.resolve();
        expect(el.shadowRoot!.firstElementChild!.classList.contains("center")).toBe(true);
    });
});
