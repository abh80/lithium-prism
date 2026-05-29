<script lang="ts">
    import type { ClassValue } from "svelte/elements";

    type Props = {
        class?: ClassValue;
        width?: string;
        height?: string;
    };

    let { class: className, width, height }: Props = $props();
</script>

<div class={["skeleton", className]} style:width style:height></div>

<style>
    .skeleton {
        height: 100%;
        width: 100%;
        background: var(--helium-elevated-10);
        border-radius: 12px;
        background-image: linear-gradient(
            90deg,
            transparent,
            var(--helium-elevated-10),
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
</style>
