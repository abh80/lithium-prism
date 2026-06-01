import { LithiumElement } from "../core/lithium-element";
import { css } from "../core/sheet";
import { TYPOGRAPHY_CSS } from "../core/typography";

// Ported from Toggle.svelte <style>, --helium-* renamed to --lithium-*. The global
// element typography is adopted so the name <h4> and description <p> render at the
// right size/weight inside the shadow root.
const styles = css`
    ${TYPOGRAPHY_CSS}

    :host {
        display: block;
        width: 100%;
    }
    .toggle-button {
        display: flex;
        align-items: center;
        gap: var(--gap-3);
        width: 100%;
        background-color: var(--lithium-elevated-7);
        border: none;
        cursor: pointer;
        font-family: inherit;
        color: var(--primary);
        text-align: left;
        border-radius: 14px;
        padding: 14px 18px;
    }
    .toggle-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .toggle-text {
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;
        overflow: hidden;
    }
    .toggle-text h4 {
        margin: 0;
    }
    .toggle-text p {
        margin: 0;
        color: var(--secondary);
    }
    .toggle {
        display: block;
        flex: 0 0 auto;
        min-width: 48px;
        width: 48px;
        height: 28px;
        border-radius: 50px;
        background-color: var(--lithium-elevated-30);
        transition: background-color 0.25s;
    }
    .toggle .runner {
        display: block;
        width: 22px;
        height: 22px;
        margin: 3px;
        background-color: var(--white);
        border-radius: 50px;
        will-change: translate;
        transition: translate 0.15s;
    }
    .toggle.enabled {
        background-color: var(--lithium-blue);
    }
    .toggle.enabled .runner {
        translate: 20px 0;
    }
`;

export class LitToggle extends LithiumElement {
    static tag = "lit-toggle";
    static styles = styles;
    static get observedAttributes() {
        return ["checked", "name", "desc", "disabled"];
    }

    private btn!: HTMLButtonElement;

    get checked() {
        return this.bool("checked");
    }
    set checked(v: boolean) {
        this.setBool("checked", v);
    }

    protected render(): string {
        return `
            <button class="toggle-button card" type="button" role="switch">
                <span class="toggle-text">
                    <slot><h4 part="name"></h4><p part="desc"></p></slot>
                </span>
                <span class="toggle" aria-hidden="true"><span class="runner"></span></span>
            </button>`;
    }
    protected afterRender(): void {
        this.btn = this.root.querySelector("button")!;
        this.btn.addEventListener("click", () => {
            if (this.bool("disabled")) return;
            this.checked = !this.checked;
            this.emit("change", { checked: this.checked });
        });
    }
    protected update(): void {
        const checked = this.bool("checked");
        this.btn.setAttribute("aria-checked", String(checked));
        this.btn.disabled = this.bool("disabled");
        this.root.querySelector(".toggle")!.classList.toggle("enabled", checked);
        const h4 = this.root.querySelector("h4");
        const p = this.root.querySelector("p");
        if (h4) h4.textContent = this.getAttribute("name") ?? "";
        if (p) p.textContent = this.getAttribute("desc") ?? "";
    }
}
LitToggle.register();
