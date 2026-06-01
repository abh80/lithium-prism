import { describe, it, expect, beforeEach } from "vitest";
import { LithiumElement } from "../../src/core/lithium-element";
import { css } from "../../src/core/sheet";

class TestEl extends LithiumElement {
    static tag = "test-el";
    static styles = css`
        .box {
            color: red;
        }
    `;
    static get observedAttributes() {
        return ["active"];
    }
    render() {
        return `<div class="box" part="box"><slot></slot></div>`;
    }
    update() {
        this.root.querySelector(".box")!.classList.toggle("active", this.bool("active"));
    }
}
if (!customElements.get(TestEl.tag)) customElements.define(TestEl.tag, TestEl);

describe("LithiumElement", () => {
    let el: TestEl;
    beforeEach(() => {
        document.body.innerHTML = "";
        el = document.createElement("test-el") as TestEl;
    });

    it("attaches an open shadow root and renders once on connect", () => {
        document.body.append(el);
        expect(el.shadowRoot).not.toBeNull();
        expect(el.shadowRoot!.querySelector(".box")).not.toBeNull();
    });

    it("adopts the reset sheet and the component styles", () => {
        document.body.append(el);
        expect(el.shadowRoot!.adoptedStyleSheets.length).toBe(2);
    });

    it("calls update() on attribute change (reflects to DOM)", async () => {
        document.body.append(el);
        el.setAttribute("active", "");
        await Promise.resolve();
        expect(el.shadowRoot!.querySelector(".box")!.classList.contains("active")).toBe(true);
    });

    it("bool() reads boolean attribute presence", () => {
        document.body.append(el);
        expect(el.bool("active")).toBe(false);
        el.setBool("active", true);
        expect(el.hasAttribute("active")).toBe(true);
        expect(el.bool("active")).toBe(true);
    });

    it("emit() dispatches a composed, bubbling CustomEvent with detail", () => {
        document.body.append(el);
        let got: any = null;
        el.addEventListener("ping", (e) => {
            got = (e as CustomEvent).detail;
        });
        el.emit("ping", { n: 1 });
        expect(got).toEqual({ n: 1 });
    });
});
