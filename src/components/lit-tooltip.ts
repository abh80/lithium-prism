import { LithiumElement } from "../core/lithium-element";
import { css } from "../core/sheet";

// Ported from Tooltip.svelte <style>, --helium-* renamed to --lithium-*.
// Upstream used the native Popover API with mouse-tracked positioning; here the
// tooltip lives in the shadow root, positioned relative to the host trigger, and
// reveals/hides via a `visible` class toggled by host pointer/focus events.
const styles = css`
    :host {
        display: inline-flex;
        position: relative;
        width: fit-content;
        height: fit-content;
        gap: var(--gap-1);
    }
    .tooltip {
        position: absolute;
        left: 0;
        bottom: 100%;
        margin-bottom: 12px;
        z-index: 1;

        color: var(--primary);
        background-color: var(--tooltip-bg);
        outline: 1.5px solid var(--lithium-elevated-10);
        outline-offset: -1.5px;

        text-wrap: pretty;
        padding: 10px 12px;
        font-size: 14px;
        white-space: pre;
        line-height: 120%;

        border-radius: 12px;
        border-bottom-left-radius: 4px;
        box-shadow: 4px 4px 10px 0 var(--tooltip-shadow);

        pointer-events: none;
        opacity: 0;
        transform: scale(0.8);
        transform-origin: bottom left;
        transition:
            transform 0.15s,
            opacity 0.15s;
    }
    .tooltip.visible {
        opacity: 1;
        transform: none;
    }
    .tooltip:empty {
        display: none;
    }
`;

export class LitTooltip extends LithiumElement {
    static tag = "lit-tooltip";
    static styles = styles;
    static get observedAttributes() {
        return ["text"];
    }

    private tip!: HTMLSpanElement;

    protected render(): string {
        return `<slot></slot><span class="tooltip" part="tip" role="tooltip"></span>`;
    }

    protected afterRender(): void {
        this.tip = this.root.querySelector(".tooltip")!;

        const show = () => this.tip.classList.add("visible");
        const hide = () => this.tip.classList.remove("visible");

        this.addEventListener("pointerenter", show);
        this.addEventListener("pointerleave", hide);
        this.addEventListener("focusin", show);
        this.addEventListener("focusout", hide);
    }

    protected update(): void {
        this.tip.textContent = this.getAttribute("text") ?? "";
    }
}
LitTooltip.register();
