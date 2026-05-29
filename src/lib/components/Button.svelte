<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLButtonAttributes } from "svelte/elements";

    type Props = HTMLButtonAttributes & {
        children: Snippet;
        primary?: boolean;
        card?: boolean;
        selected?: boolean;
        circle?: boolean;
    };

    let {
        children,
        class: className,
        type = "button",
        primary = false,
        card = false,
        selected = false,
        circle = false,
        ...rest
    }: Props = $props();
</script>

<button
    class={[
        "button",
        primary && "primary",
        card && "card",
        selected && "selected",
        circle && "circle",
        className,
    ]}
    {type}
    {...rest}
>
    {@render children()}
</button>
