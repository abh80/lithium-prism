import { LithiumElement } from "../core/lithium-element";
import { css } from "../core/sheet";
import * as Shimmer from "./gradient-shimmer";

// Ported from GradientShimmer.svelte <style>. No --helium-* tokens present.
// --shimmer-size lives in the theme; the local --shimmer-* tokens below drive the canvas paint.
const styles = css`
    :host {
        display: block;
        width: 100%;
        height: 100%;
    }

    canvas {
        --shimmer-alpha: 0.35;
        --shimmer-grain-alpha: 0.15;
        --shimmer-grain-luminance: 220;
        --shimmer-grain-contrast: 34;
        --shimmer-grain-saturation: 8;
        --shimmer-intro-alpha: 0.6;
        --shimmer-speed-up-shine-boost: 0.3;
        --shimmer-highlight: var(--bg-gradient-end);
        --shimmer-start: var(--bg-gradient-start);

        display: block;
        z-index: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }

    canvas.background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }

    @media (prefers-color-scheme: dark) {
        canvas {
            --shimmer-alpha: 0.7;
            --shimmer-grain-alpha: 0.15;
            --shimmer-grain-luminance: 144;
            --shimmer-grain-contrast: 64;
            --shimmer-grain-saturation: 32;
            --shimmer-intro-alpha: 1;
            --shimmer-speed-up-shine-boost: 0.15;
        }
    }
`;

const GRAIN_SIZE = 180;

type Colors = {
    alpha: number;
    grainAlpha: number;
    grainLuminance: number;
    grainContrast: number;
    grainSaturation: number;
    introAlpha: number;
    start: string;
    highlight: string;
    speedUpShineBoost: number;
};

export class LitGradientShimmer extends LithiumElement {
    static tag = "lit-gradient-shimmer";
    static styles = styles;
    static get observedAttributes() {
        return ["background"];
    }

    private canvas!: HTMLCanvasElement;
    private cleanup: (() => void) | null = null;
    private controller: Shimmer.GradientShimmerControls | null = null;

    protected render(): string {
        return `<canvas part="canvas" aria-hidden="true"></canvas>`;
    }

    protected afterRender(): void {
        this.canvas = this.root.querySelector("canvas")!;
        this.setup();
    }

    protected update(): void {
        if (this.canvas) {
            this.canvas.classList.toggle("background", this.bool("background"));
        }
    }

    disconnectedCallback(): void {
        this.cleanup?.();
        this.cleanup = null;
        this.controller = null;
    }

    /** Public API mirroring upstream exported functions. */
    intro(): void {
        this.controller?.intro();
    }
    emphasize(): void {
        this.controller?.emphasize();
    }

    private createGrainPattern(context: CanvasRenderingContext2D, colors: Colors): CanvasPattern {
        const grainCanvas = document.createElement("canvas");
        const grainContext = grainCanvas.getContext("2d")!;

        grainCanvas.width = GRAIN_SIZE;
        grainCanvas.height = GRAIN_SIZE;

        const imageData = grainContext.createImageData(GRAIN_SIZE, GRAIN_SIZE);
        const pixels = imageData.data;

        for (let index = 0; index < pixels.length; index += 4) {
            const luminance = colors.grainLuminance + (Math.random() - 0.5) * colors.grainContrast;
            const redShift = (Math.random() - 0.5) * colors.grainSaturation;
            const greenShift = (Math.random() - 0.5) * colors.grainSaturation;
            const blueShift = (Math.random() - 0.5) * colors.grainSaturation;

            pixels[index] = Shimmer.clamp(luminance + redShift, 0, 255);
            pixels[index + 1] = Shimmer.clamp(luminance + greenShift, 0, 255);
            pixels[index + 2] = Shimmer.clamp(luminance + blueShift, 0, 255);
            pixels[index + 3] = 255;
        }

        grainContext.putImageData(imageData, 0, 0);

        return context.createPattern(grainCanvas, "repeat")!;
    }

    private drawGrain(
        context: CanvasRenderingContext2D,
        pattern: CanvasPattern,
        size: Shimmer.Size,
        colors: Colors,
    ): void {
        context.save();
        context.globalAlpha = colors.grainAlpha;
        context.globalCompositeOperation = "overlay";
        context.fillStyle = pattern;
        context.fillRect(0, 0, size.width, size.height);
        context.restore();
    }

    private drawStripe(
        context: CanvasRenderingContext2D,
        stripe: Shimmer.Stripe,
        index: number,
        stripeWidth: number,
        size: Shimmer.Size,
        colors: Colors,
        time: number,
        introAnimation: Shimmer.IntroAnimation | null,
        stripeCount: number,
        wavePhase: number,
        secondaryWavePhase: number,
        shineProgress: number,
    ): void {
        const revealProgress = Shimmer.getIntroRevealProgress(
            time,
            introAnimation,
            index,
            stripeCount,
        );
        const idleProgress = Shimmer.getIntroIdleProgress(time, introAnimation, index, stripeCount);
        const alpha = colors.introAlpha + (colors.alpha - colors.introAlpha) * idleProgress;
        const x = Shimmer.snapToDevicePixel(index * stripeWidth, size.dpr);
        const nextX =
            index === stripeCount - 1
                ? size.width
                : Shimmer.snapToDevicePixel((index + 1) * stripeWidth, size.dpr);
        const width = nextX - x;
        const introCenter = Shimmer.lerp(
            Shimmer.INTRO.startCenter,
            Shimmer.INTRO.idleCenter,
            revealProgress,
        );
        const idleCenter = Shimmer.getIdleCenter(stripe, wavePhase, secondaryWavePhase);
        const center = introCenter + (idleCenter - introCenter) * idleProgress;
        const bandStart = Shimmer.clamp(
            center - Shimmer.GRADIENT.bandWidth,
            Shimmer.GRADIENT.minStop,
            Shimmer.GRADIENT.maxStop,
        );
        const bandEnd = Shimmer.clamp(
            center + Shimmer.GRADIENT.bandWidth,
            Shimmer.GRADIENT.minStop,
            Shimmer.GRADIENT.maxStop,
        );
        const gradient = context.createLinearGradient(
            x,
            size.height * -0.35,
            nextX,
            size.height * 1.35,
        );

        context.globalAlpha = alpha;
        context.fillStyle = colors.start;
        context.fillRect(x, 0, width, size.height);

        gradient.addColorStop(0, colors.highlight);
        gradient.addColorStop(bandStart, colors.start);
        gradient.addColorStop(center, colors.highlight);
        gradient.addColorStop(bandEnd, colors.start);
        gradient.addColorStop(1, colors.start);

        context.globalAlpha =
            Shimmer.clamp(alpha * (1 + shineProgress * colors.speedUpShineBoost)) * revealProgress;
        context.fillStyle = gradient;
        context.fillRect(x, 0, width, size.height);
    }

    private setup(): void {
        const canvas = this.canvas;
        const context = canvas.getContext("2d", {
            alpha: true,
            colorSpace: "display-p3",
        });

        if (!context) {
            return;
        }

        const stripes: Shimmer.Stripe[] = [];
        const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

        let size: Shimmer.Size;
        let stripeWidth: number;
        let colors: Colors;
        let grainPattern: CanvasPattern | null = null;
        let animationFrame: number | null = null;
        let resizeFrame: number | null = null;
        let introAnimation: Shimmer.IntroAnimation | null = null;
        let speedUpAnimation: Shimmer.WaveSpeedUpAnimation | null = null;
        let wavePhase = Shimmer.getRandomWavePhase();
        let secondaryWavePhase = -wavePhase * 0.7;
        let lastFrameTime: number | null = null;

        const cancelResizeFrame = () => {
            if (resizeFrame === null) {
                return;
            }

            cancelAnimationFrame(resizeFrame);
            resizeFrame = null;
        };

        const cancelAnimation = () => {
            if (animationFrame === null) {
                return;
            }

            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        };

        const startIntro = () => {
            if (reducedMotionQuery.matches) {
                introAnimation = null;
                drawFrame(performance.now());
                return;
            }

            introAnimation = { startedAt: performance.now() };
        };

        const startWaveSpeedUp = () => {
            if (reducedMotionQuery.matches) {
                speedUpAnimation = null;
                drawFrame(performance.now());
                return;
            }

            const time = performance.now();

            speedUpAnimation = Shimmer.triggerSpeedUpAnimation(time, speedUpAnimation);
        };

        const controller: Shimmer.GradientShimmerControls = {
            intro: startIntro,
            emphasize: startWaveSpeedUp,
        };

        const readColors = () => {
            const styles = getComputedStyle(canvas);

            colors = {
                alpha: Shimmer.readCssNumber(styles, "--shimmer-alpha"),
                grainAlpha: Shimmer.readCssNumber(styles, "--shimmer-grain-alpha"),
                grainLuminance: Shimmer.readCssNumber(styles, "--shimmer-grain-luminance"),
                grainContrast: Shimmer.readCssNumber(styles, "--shimmer-grain-contrast"),
                grainSaturation: Shimmer.readCssNumber(styles, "--shimmer-grain-saturation"),
                introAlpha: Shimmer.readCssNumber(styles, "--shimmer-intro-alpha"),
                start: Shimmer.readCssString(styles, "--shimmer-start"),
                highlight: Shimmer.readCssString(styles, "--shimmer-highlight"),
                speedUpShineBoost: Shimmer.readCssNumber(styles, "--shimmer-speed-up-shine-boost"),
            };
            grainPattern = this.createGrainPattern(context, colors);
        };

        const applyResize = () => {
            size = Shimmer.resizeCanvas(canvas, context);
            stripeWidth = Shimmer.syncStripeCount(stripes, size.width);
            readColors();
        };

        const scheduleResize = () => {
            cancelResizeFrame();
            resizeFrame = requestAnimationFrame((time) => {
                applyResize();
                drawFrame(time);
            });
        };

        const drawFrame = (time: number) => {
            const reducedMotion = reducedMotionQuery.matches;
            const deltaSeconds =
                reducedMotion || lastFrameTime === null
                    ? 0
                    : Math.min((time - lastFrameTime) / 1000, 0.064);
            const speedUpState = Shimmer.updateSpeedUpAnimation(time, speedUpAnimation);
            const activeIntroAnimation = reducedMotion ? null : introAnimation;

            lastFrameTime = reducedMotion ? null : time;
            speedUpAnimation = reducedMotion ? null : speedUpState.animation;

            if (!reducedMotion) {
                wavePhase += Shimmer.IDLE_WAVE.speed * speedUpState.multiplier * deltaSeconds;
                secondaryWavePhase +=
                    Shimmer.IDLE_WAVE.secondarySpeed * speedUpState.multiplier * deltaSeconds;
            }

            context.globalAlpha = 1;
            context.clearRect(0, 0, size.width, size.height);

            for (const [index, stripe] of stripes.entries()) {
                this.drawStripe(
                    context,
                    stripe,
                    index,
                    stripeWidth,
                    size,
                    colors,
                    time,
                    activeIntroAnimation,
                    stripes.length,
                    wavePhase,
                    secondaryWavePhase,
                    reducedMotion ? 0 : speedUpState.shineProgress,
                );
            }

            if (grainPattern) {
                this.drawGrain(context, grainPattern, size, colors);
            }

            if (Shimmer.isIntroComplete(time, introAnimation, stripes.length)) {
                introAnimation = null;
            }
        };

        const draw = (time: number) => {
            animationFrame = null;
            drawFrame(time);

            if (!reducedMotionQuery.matches) {
                animationFrame = requestAnimationFrame(draw);
            }
        };

        const requestAnimation = () => {
            if (animationFrame !== null || reducedMotionQuery.matches) {
                return;
            }

            animationFrame = requestAnimationFrame(draw);
        };

        applyResize();

        if (!this.bool("no-intro")) {
            startIntro();
        }

        this.controller = controller;

        const resizeObserver = new ResizeObserver(scheduleResize);
        resizeObserver.observe(canvas);

        const scheduleColorRead = () => {
            cancelResizeFrame();
            resizeFrame = requestAnimationFrame((time) => {
                readColors();
                drawFrame(time);
            });
        };

        const themeObserver = new MutationObserver(scheduleColorRead);
        themeObserver.observe(document.documentElement, { attributes: true });

        const updateMotionPreference = () => {
            if (reducedMotionQuery.matches) {
                introAnimation = null;
                speedUpAnimation = null;
                cancelAnimation();
                drawFrame(performance.now());
                return;
            }

            lastFrameTime = null;
            requestAnimation();
        };

        colorSchemeQuery.addEventListener("change", scheduleColorRead);
        reducedMotionQuery.addEventListener("change", updateMotionPreference);

        updateMotionPreference();

        this.cleanup = () => {
            if (this.controller === controller) {
                this.controller = null;
            }

            cancelAnimation();
            cancelResizeFrame();
            resizeObserver.disconnect();
            themeObserver.disconnect();
            colorSchemeQuery.removeEventListener("change", scheduleColorRead);
            reducedMotionQuery.removeEventListener("change", updateMotionPreference);
        };
    }
}
LitGradientShimmer.register();
