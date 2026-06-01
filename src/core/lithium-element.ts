import { reset } from "./reset";

export abstract class LithiumElement extends HTMLElement {
    static styles: CSSStyleSheet | undefined;
    protected readonly root: ShadowRoot;
    private rendered = false;
    private dirty = false;

    constructor() {
        super();
        this.root = this.attachShadow({ mode: "open" });
        const ctor = this.constructor as typeof LithiumElement;
        this.root.adoptedStyleSheets = ctor.styles ? [reset, ctor.styles] : [reset];
    }

    /** Markup for the shadow root, built ONCE on connect. Use <slot> for projected content. */
    protected abstract render(): string;

    /** Bind listeners / cache refs. Called once after the first render. Override as needed. */
    protected afterRender(): void {}

    /** Reflect current attributes to existing DOM (classes, aria, disabled). Called after first
     *  render and on every observed attribute change. Override as needed. */
    protected update(): void {}

    connectedCallback(): void {
        if (!this.rendered) {
            this.root.innerHTML = this.render();
            this.rendered = true;
            this.afterRender();
        }
        this.update();
    }

    attributeChangedCallback(): void {
        if (!this.rendered) return;
        if (this.dirty) return;
        this.dirty = true;
        queueMicrotask(() => {
            this.dirty = false;
            this.update();
        });
    }

    /** boolean attribute present? */
    protected bool(name: string): boolean {
        return this.hasAttribute(name);
    }
    /** set/clear a boolean attribute */
    protected setBool(name: string, value: boolean): void {
        this.toggleAttribute(name, value);
    }
    /** dispatch a composed, bubbling CustomEvent */
    protected emit<T>(type: string, detail?: T): boolean {
        return this.dispatchEvent(
            new CustomEvent<T>(type, { detail, bubbles: true, composed: true }),
        );
    }

    /** define guard helper for component modules */
    static register(): void {
        const ctor = this as unknown as { tag: string };
        if (ctor.tag && !customElements.get(ctor.tag)) {
            customElements.define(ctor.tag, this as unknown as CustomElementConstructor);
        }
    }
}
