import { LithiumElement } from "../core/lithium-element";
import { css } from "../core/sheet";

// Base .input-field layout copied from src/css/styles.css and the field-specific
// rules from Input.svelte's <style>, with --helium-* renamed to --lithium-* and
// :global(svg) rewritten to ::slotted(svg) for slot projection.
const styles = css`
    :host {
        display: inline-flex;
        width: 100%;
    }

    .input-field {
        color: var(--primary);
        border-radius: 12px;
        align-items: center;
        transition:
            0.2s background-color,
            0.1s outline-color,
            0.1s box-shadow;
        background-color: var(--lithium-elevated-7);
        display: inline-flex;
        gap: 9px;
        width: 100%;
        cursor: text;
    }
    .input-field:focus-within {
        background-color: var(--lithium-elevated-10);
        outline: 2px var(--primary) solid;
        outline-offset: -1px;
    }
    @media (hover: hover) {
        .input-field:hover {
            background-color: var(--lithium-elevated-10);
        }
    }
    .input-field input {
        appearance: none;
        min-width: 0;
        width: 100%;
        color: inherit;
        background: none;
        border: none;
        outline: none;
        font: inherit;
        font-weight: 500;
        letter-spacing: inherit;
    }
    .input-field input::placeholder {
        color: var(--tertiary);
        font-weight: 500;
        user-select: none;
        -webkit-user-select: none;
    }
    .input-field.disabled {
        cursor: not-allowed;
        opacity: 0.5;
        pointer-events: none;
    }

    .input-field {
        --input-font-size: 16px;
        --input-icon-size: 18px;
        --input-line-height: 122%;
        --input-padding: 13px 16px;

        padding: var(--input-padding);
        min-height: 46px;
    }

    .small {
        --input-font-size: 14px;
        --input-icon-size: 16px;
        --input-line-height: 120%;
        --input-padding: 10px 16px;

        min-height: 38px;
    }

    input {
        font-size: var(--input-font-size);
        line-height: var(--input-line-height);
        padding: 0;
    }
    input[type="number"] {
        appearance: textfield;
        -moz-appearance: textfield;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .input-accessory {
        color: var(--tertiary);
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
    }
    .input-field:focus-within .input-accessory {
        color: var(--primary);
    }
    .input-accessory ::slotted(svg),
    .input-accessory ::slotted(lit-icon) {
        width: var(--input-icon-size);
        height: var(--input-icon-size);
        stroke-width: 1.8px;
    }
`;

export class LitInput extends LithiumElement {
    static tag = "lit-input";
    static styles = styles;
    static get observedAttributes() {
        return ["value", "placeholder", "disabled", "small", "width", "id", "aria-label"];
    }

    private inputEl!: HTMLInputElement;

    get value(): string {
        return this.inputEl?.value ?? this.getAttribute("value") ?? "";
    }
    set value(v: string) {
        this.setAttribute("value", v);
    }

    protected render(): string {
        return `<label class="input-field" part="field"><span class="input-accessory"><slot name="leading"></slot></span><input part="input"/><span class="input-accessory"><slot name="trailing"></slot></span></label>`;
    }

    protected afterRender(): void {
        this.inputEl = this.root.querySelector("input")!;
        this.inputEl.addEventListener("input", () => {
            // Reflect to the value attribute; update() only writes back into the
            // input when the attribute value differs, so this avoids a caret reset.
            this.setAttribute("value", this.inputEl.value);
            this.emit("input", { value: this.inputEl.value });
        });
    }

    protected update(): void {
        const field = this.root.querySelector(".input-field") as HTMLLabelElement;
        const input = this.inputEl;

        const placeholder = this.getAttribute("placeholder");
        if (placeholder !== null) input.placeholder = placeholder;
        else input.removeAttribute("placeholder");

        const disabled = this.bool("disabled");
        input.disabled = disabled;
        field.classList.toggle("disabled", disabled);
        field.classList.toggle("small", this.bool("small"));

        const id = this.getAttribute("id");
        if (id !== null) input.id = id;
        else input.removeAttribute("id");

        const ariaLabel = this.getAttribute("aria-label");
        if (ariaLabel !== null) input.setAttribute("aria-label", ariaLabel);
        else input.removeAttribute("aria-label");

        const width = this.getAttribute("width");
        field.style.width = width ?? "";

        // Only write the attribute value into the input when it differs, so user
        // typing (which already updated input.value) does not reset the caret.
        const value = this.getAttribute("value") ?? "";
        if (input.value !== value) input.value = value;
    }
}
LitInput.register();
