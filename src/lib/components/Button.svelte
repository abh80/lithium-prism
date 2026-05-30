<script lang="ts">
    import type { Snippet } from "svelte";
    import type { HTMLButtonAttributes } from "svelte/elements";

    type ButtonVariantProps =
        | {
            primary?: boolean;
            transparent?: false;
        }
        | {
            primary?: false;
            transparent?: boolean;
        };

    type Props = HTMLButtonAttributes & {
        children: Snippet;
        card?: boolean;
        selected?: boolean;
        circle?: boolean;
    } & ButtonVariantProps;

    let {
        children,
        class: className,
        type = "button",
        primary = false,
        card = false,
        selected = false,
        circle = false,
        transparent = false,
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
        transparent && !primary && "transparent",
        className,
    ]}
    {type}
    {...rest}
>
    {@render children()}
</button>
