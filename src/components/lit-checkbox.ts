import { LithiumElement } from "../core/lithium-element";
import { css } from "../core/sheet";

// Ported from Checkbox.svelte <style>, --helium-* renamed to --lithium-*,
// :global(svg) selectors flattened to plain svg.
const styles = css`
    .checkbox {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        width: fit-content;
        color: var(--primary);
        cursor: pointer;
        line-height: 120%;
        user-select: none;
        -webkit-user-select: none;
    }

    input {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        clip-path: inset(50%);
        white-space: nowrap;
    }

    .checkbox-control {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 28px;
        width: 28px;
        height: 28px;
        border-radius: 100%;
        background-color: var(--lithium-elevated-7);
        box-shadow: 0 0 0 1.5px var(--lithium-elevated-5) inset;
        transition:
            background-color 0.2s,
            transform 0.2s;
        will-change: transform;
    }

    .checkbox-control svg {
        width: 21px;
        height: 21px;
        stroke-width: 2px;
        opacity: 0;
    }

    .toggling .checkbox-control {
        transition: transform 0.2s;
    }

    @media (hover: hover) {
        .checkbox:hover input:not(:checked) + .checkbox-control {
            background-color: var(--lithium-elevated-10);
        }

        .checkbox:hover input:checked + .checkbox-control {
            background-color: var(--lithium-blue-hover);
        }
    }

    .checkbox:active .checkbox-control {
        transform: scale(0.97);
    }

    input:checked + .checkbox-control {
        background-color: var(--lithium-blue);
        color: #ffffff;
    }

    input:checked + .checkbox-control svg {
        opacity: 1;
    }

    input:focus-visible + .checkbox-control {
        outline: 2px var(--primary) solid;
        outline-offset: 3px;
    }

    .checkbox-content {
        color: var(--secondary);
        font-size: 16px;
        line-height: 122%;
    }

    .disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;

const CHECK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5l10 -10" /></svg>`;

export class LitCheckbox extends LithiumElement {
    static tag = "lit-checkbox";
    static styles = styles;
    static get observedAttributes() {
        return ["checked", "disabled", "id"];
    }

    private input!: HTMLInputElement;
    private label!: HTMLLabelElement;

    get checked() {
        return this.bool("checked");
    }
    set checked(v: boolean) {
        this.setBool("checked", v);
        if (this.input) this.update();
    }

    protected render(): string {
        return `
            <label class="checkbox">
                <input type="checkbox" />
                <span class="checkbox-control" aria-hidden="true">${CHECK_SVG}</span>
                <span class="checkbox-content"><slot></slot></span>
            </label>`;
    }

    protected afterRender(): void {
        this.input = this.root.querySelector("input")!;
        this.label = this.root.querySelector("label")!;
        this.input.addEventListener("change", () => {
            this.checked = this.input.checked;
            this.emit("change", { checked: this.checked });
        });
    }

    protected update(): void {
        const checked = this.bool("checked");
        const disabled = this.bool("disabled");

        if (this.input.checked !== checked) {
            this.input.checked = checked;
            this.label.classList.add("toggling");
            requestAnimationFrame(() => this.label.classList.remove("toggling"));
        }

        this.input.disabled = disabled;
        this.label.classList.toggle("disabled", disabled);

        const id = this.getAttribute("id");
        if (id) this.input.id = id;
    }
}
LitCheckbox.register();
