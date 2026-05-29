<script lang="ts">
    import type { ClassValue } from "svelte/elements";
    import IconLoader from "./icons/IconLoader.svelte";

    type Props = {
        size?: number;
        class?: ClassValue;
    };

    let { size = 24, class: className }: Props = $props();
</script>

<div class={["spinner", className]} style="--size: {size}px">
    <IconLoader />
</div>

<style>
    .spinner {
        display: flex;
    }

    .spinner :global(svg) {
        width: var(--size);
        height: var(--size);
        color: inherit;
        animation: spinner 1s infinite linear;
        will-change: transform;
    }

    @media (prefers-reduced-motion: reduce) {
        .spinner :global(svg) {
            animation: none;
        }
    }

    @keyframes spinner {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
