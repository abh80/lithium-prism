// Tagged-template helper building a shared, constructable CSSStyleSheet.
export function css(strings: TemplateStringsArray, ...values: unknown[]): CSSStyleSheet {
    const text = strings.reduce(
        (acc, s, i) => acc + s + (i < values.length ? String(values[i]) : ""),
        "",
    );
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(text);
    return sheet;
}
