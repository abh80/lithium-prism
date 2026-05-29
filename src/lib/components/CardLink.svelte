<script lang="ts">
    import type { ClassValue } from "svelte/elements";
    import IconExternalLink from "./icons/IconExternalLink.svelte";

    type Props = {
        title: string;
        desc: string;
        href: string;
        class?: ClassValue;
    };

    const { title, desc, href, class: className }: Props = $props();
</script>

<a
    class={["button card card-link", className]}
    {href}
    target="_blank"
    rel="noopener noreferrer"
>
    <div class="link-text">
        <h4>{title}</h4>
        <p>{desc}</p>
    </div>
    <IconExternalLink />
</a>

<style>
    .card-link {
        text-decoration: none;
        align-items: flex-start;
    }

    .link-text {
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;
        overflow: hidden;
    }
</style>
