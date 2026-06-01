import { describe, it, expect, beforeEach } from "vitest";
import "../src/components/lit-gradient-shimmer";
import * as Shimmer from "../src/components/gradient-shimmer";

describe("lit-gradient-shimmer", () => {
    let el: HTMLElement;
    beforeEach(() => {
        document.body.innerHTML = "<lit-gradient-shimmer></lit-gradient-shimmer>";
        el = document.querySelector("lit-gradient-shimmer")!;
    });

    it("renders a shadow canvas root marked aria-hidden", () => {
        const canvas = el.shadowRoot!.querySelector("canvas");
        expect(canvas).not.toBeNull();
        expect(canvas!.getAttribute("aria-hidden")).toBe("true");
        expect(canvas!.getAttribute("part")).toBe("canvas");
    });

    it("reflects the background attribute to the canvas class", async () => {
        el.setAttribute("background", "");
        await Promise.resolve();
        const canvas = el.shadowRoot!.querySelector("canvas")!;
        expect(canvas.classList.contains("background")).toBe(true);
    });

    it("exposes intro()/emphasize() control methods", () => {
        expect(typeof (el as any).intro).toBe("function");
        expect(typeof (el as any).emphasize).toBe("function");
    });
});

describe("gradient-shimmer helper logic", () => {
    it("clamp constrains to the given bounds", () => {
        expect(Shimmer.clamp(-1)).toBe(0);
        expect(Shimmer.clamp(2)).toBe(1);
        expect(Shimmer.clamp(0.5)).toBe(0.5);
        expect(Shimmer.clamp(300, 0, 255)).toBe(255);
    });

    it("lerp interpolates linearly", () => {
        expect(Shimmer.lerp(0, 10, 0.5)).toBe(5);
        expect(Shimmer.lerp(2, 4, 0)).toBe(2);
        expect(Shimmer.lerp(2, 4, 1)).toBe(4);
    });

    it("snapToDevicePixel rounds to the device pixel grid", () => {
        // value*dpr rounded then divided back: 10.3*2=20.6 -> 21 -> 10.5
        expect(Shimmer.snapToDevicePixel(10.3, 2)).toBe(10.5);
        expect(Shimmer.snapToDevicePixel(10, 1)).toBe(10);
    });

    it("getIdleCenter is 0.5 at zero phases (sin(0)=0)", () => {
        const stripe: Shimmer.Stripe = { phase: 0, secondaryPhase: 0 };
        expect(Shimmer.getIdleCenter(stripe, 0, 0)).toBeCloseTo(0.5, 10);
    });

    it("syncStripeCount grows the stripe array and returns even stripe width", () => {
        const stripes: Shimmer.Stripe[] = [];
        // target stripe width is 110 -> 440/110 = 4 stripes
        const width = Shimmer.syncStripeCount(stripes, 440);
        expect(stripes.length).toBe(4);
        expect(width).toBe(110);
    });

    it("intro progress is 1 with no animation, ramps with one", () => {
        expect(Shimmer.getIntroRevealProgress(0, null, 0, 4)).toBe(1);
        const anim: Shimmer.IntroAnimation = { startedAt: 0 };
        // before the delay window the reveal has not started
        expect(Shimmer.getIntroRevealProgress(0, anim, 0, 4)).toBe(0);
        // well past the full duration it completes
        expect(Shimmer.getIntroRevealProgress(100000, anim, 0, 4)).toBeCloseTo(1, 6);
    });

    it("isIntroComplete is true with no animation and after the full timeline", () => {
        expect(Shimmer.isIntroComplete(0, null, 4)).toBe(true);
        const anim: Shimmer.IntroAnimation = { startedAt: 0 };
        expect(Shimmer.isIntroComplete(0, anim, 4)).toBe(false);
        expect(Shimmer.isIntroComplete(100000, anim, 4)).toBe(true);
    });

    it("readCssNumber/readCssString parse CSS custom property output", () => {
        const styles = {
            getPropertyValue: (name: string) =>
                ({ "--shimmer-alpha": " 0.35 ", "--shimmer-start": " #123456 " })[name] ?? "",
        } as unknown as CSSStyleDeclaration;
        expect(Shimmer.readCssNumber(styles, "--shimmer-alpha")).toBe(0.35);
        expect(Shimmer.readCssString(styles, "--shimmer-start")).toBe("#123456");
        expect(() => Shimmer.readCssNumber(styles, "--missing")).toThrow();
        expect(() => Shimmer.readCssString(styles, "--missing")).toThrow();
    });
});
