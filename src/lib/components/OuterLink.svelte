<script lang="ts">
    import type { Snippet } from "svelte";
    import type { ClassValue, HTMLAnchorAttributes } from "svelte/elements";

    type Props = Omit<HTMLAnchorAttributes, "class" | "href"> & {
        href: string;
        class?: ClassValue;
        children: Snippet;
    };

    let {
        href,
        children,
        class: className,
        target: targetProp,
        rel: relProp,
        ...rest
    }: Props = $props();
    let target = $derived(targetProp ?? (href.startsWith("#") ? undefined : "_blank"));
    let rel = $derived(relProp ?? (target ? "noopener noreferrer" : undefined));
</script>

<a class={["outer-link", className]} {href} {target} {rel} {...rest}>
    {@render children()}
</a>

<style>
    .outer-link.button:not(.card) {
        width: fit-content;
    }
</style>
