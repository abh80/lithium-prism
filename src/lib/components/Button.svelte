<script lang="ts">
    import type { Snippet } from "svelte";
    import type { ClassValue, HTMLButtonAttributes } from "svelte/elements";

    type ButtonVariantProps =
        | {
            primary?: boolean;
            transparent?: false;
        }
        | {
            primary?: false;
            transparent?: boolean;
        };

    type Props = Omit<HTMLButtonAttributes, "class"> & {
        children: Snippet;
        class?: ClassValue;
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
        {
            button: true,
            primary,
            card,
            selected,
            circle,
            transparent,
        },
        className,
    ]}
    {type}
    {...rest}
>
    {@render children()}
</button>
