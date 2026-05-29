<script lang="ts">
    import type { ClassValue } from "svelte/elements";
    import HeliumLogoRaw from "./logos/HeliumLogoRaw.svelte";
    import HeliumTextRaw from "./logos/HeliumTextRaw.svelte";

    type Props = {
        height?: string;
        text?: boolean;
        class?: ClassValue;
    };

    let {
        height = "28px",
        text = false,
        class: className,
    }: Props = $props();
</script>

<span class={["helium-logo", className]} style:height aria-hidden="true">
    {#if text}
        <HeliumTextRaw />
    {:else}
        <HeliumLogoRaw />
    {/if}
</span>

<style>
    .helium-logo {
        display: inline-flex;
        color: currentColor;
        flex: 0 0 auto;
        width: auto;
    }

    .helium-logo :global(svg) {
        display: block;
        width: auto;
        height: 100%;
    }
</style>
