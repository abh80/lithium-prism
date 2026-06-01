import { LithiumElement } from "../core/lithium-element";
import { css } from "../core/sheet";
import { TYPOGRAPHY_CSS } from "../core/typography";

type Variant = "display" | "title" | "heading" | "subheading" | "body" | "caption";
type Tag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

// Ported verbatim from Text.svelte.
const defaultTag = (variant: Variant): Tag => {
    if (variant === "display") return "h1";
    if (variant === "title") return "h2";
    if (variant === "heading") return "h3";
    if (variant === "subheading") return "h4";
    return "p";
};

// Ported from Text.svelte <style>, --helium-* renamed to --lithium-*. The global
// element typography is adopted here so heading/paragraph tags render at the right
// size inside the shadow root (per-tag font sizes don't cross the shadow boundary).
const styles = css`
    ${TYPOGRAPHY_CSS}

    .text {
        margin: 0;
    }

    .center {
        text-align: center;
    }

    .tone-primary {
        color: var(--primary);
    }

    .tone-secondary {
        color: var(--secondary);
    }

    .tone-tertiary {
        color: var(--tertiary);
    }

    .tone-white {
        color: var(--white);
    }
`;

export class LitText extends LithiumElement {
    static tag = "lit-text";
    static styles = styles;
    // tag/variant are read once at render; post-render changes only swap tone/center.
    static get observedAttributes() {
        return ["variant", "tone", "tag", "center"];
    }

    private inner!: HTMLElement;

    protected render(): string {
        const variant = (this.getAttribute("variant") ?? "body") as Variant;
        const tag = (this.getAttribute("tag") as Tag | null) ?? defaultTag(variant);
        return `<${tag} class="text" part="text"><slot></slot></${tag}>`;
    }

    protected afterRender(): void {
        this.inner = this.root.firstElementChild as HTMLElement;
    }

    protected update(): void {
        const tone = this.getAttribute("tone");
        for (const t of ["primary", "secondary", "tertiary", "white"]) {
            this.inner.classList.toggle(`tone-${t}`, tone === t);
        }
        this.inner.classList.toggle("center", this.bool("center"));
    }
}
LitText.register();
