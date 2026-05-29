<script lang="ts">
    import type { ClassValue } from "svelte/elements";
    import IconCopy from "./icons/IconCopy.svelte";
    import IconLink from "./icons/IconLink.svelte";
    import IconCheck from "./icons/IconCheck.svelte";

    type Props = {
        check: boolean;
        link?: boolean;
        class?: ClassValue;
    };

    let { check, link = false, class: className }: Props = $props();
</script>

<div class={["copy-animation", check && "check", className]}>
    <div class="icon-copy">
        {#if link}
            <IconLink />
        {:else}
            <IconCopy />
        {/if}
    </div>
    <div class="icon-check">
        <IconCheck />
    </div>
</div>

<style>
    .copy-animation {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        height: 18px;
        width: 18px;
    }

    .copy-animation :global(svg) {
        width: 18px;
        height: 18px;
        will-change: transform;
    }

    .icon-copy,
    .icon-check {
        display: flex;
        position: absolute;
        transition: transform 0.25s, opacity 0.25s;
    }

    .icon-copy {
        transform: none;
        opacity: 1;
    }

    .icon-check {
        transform: scale(0.4);
        opacity: 0;
    }

    .check .icon-copy {
        transform: scale(0.4);
        opacity: 0;
    }

    .check .icon-check {
        transform: none;
        opacity: 1;
    }
</style>
