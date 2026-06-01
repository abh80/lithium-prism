import { LithiumElement } from "../core/lithium-element";
import { css } from "../core/sheet";

// Ported from Skeleton.svelte <style>: --helium-* -> --lithium-*, `:global(svg)` -> `svg`
// (none present). `width`/`height` props become attributes reflected to inline style in update().
const styles = css`
    :host {
        display: block;
    }
    .skeleton {
        height: 100%;
        width: 100%;
        background: var(--lithium-elevated-10);
        border-radius: 12px;
        background-image: linear-gradient(
            90deg,
            transparent,
            var(--lithium-elevated-10),
            transparent
        );
        background-repeat: no-repeat;
        animation: skeleton 1.2s ease-in-out infinite;
        background-size: var(--shimmer-size) var(--shimmer-size);
    }

    @media (prefers-reduced-motion: reduce) {
        .skeleton {
            animation: none;
            background-image: none;
        }
    }

    @keyframes skeleton {
        0% {
            background-position: -350px 0;
        }
        100% {
            background-position: calc(350px + 100%) 0;
        }
    }
`;

export class LitSkeleton extends LithiumElement {
    static tag = "lit-skeleton";
    static styles = styles;
    static get observedAttributes() {
        return ["width", "height"];
    }

    protected render(): string {
        return `<div class="skeleton" part="skeleton"></div>`;
    }

    protected update(): void {
        const box = this.root.querySelector(".skeleton") as HTMLElement;
        const width = this.getAttribute("width");
        const height = this.getAttribute("height");
        if (width !== null) box.style.width = width;
        else box.style.removeProperty("width");
        if (height !== null) box.style.height = height;
        else box.style.removeProperty("height");
    }
}
LitSkeleton.register();
