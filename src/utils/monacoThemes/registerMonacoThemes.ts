export function registerMonacoTheme(monaco: any, themeName: string, themeJson: any) {
  const base =
    themeJson.type === "dark"
      ? "vs-dark"
      : themeJson.type === "light"
      ? "vs"
      : "vs-dark";

  const rules =
    themeJson.tokenColors?.flatMap((token: any) => {
      const scopes = Array.isArray(token.scope)
        ? token.scope
        : token.scope
        ? [token.scope]
        : [];

      return scopes.map((scope: string) => ({
        token: scope,
        foreground: token.settings.foreground,
        fontStyle: token.settings.fontStyle,
      }));
    }) ?? [];

  monaco.editor.defineTheme(themeName, {
    base,
    inherit: true,
    rules,
    colors: themeJson.colors || {},
    semanticHighlighting: true,
    semanticTokenColors: {
      method: "#82AAFF",
      function: "#C792EA",
      property: "#80CBC4",
      variable: "#F78C6C",
      parameter: "#FFCB6B",
      class: "#FF5370",
      interface: "#56B6C2",
      namespace: "#C792EA",
      enum: "#ADCBFF",
      enumMember: "#D7AFFF",
      type: "#C792EA",
      string: "#ECC48D",
      number: "#F78C6C",
      keyword: "#C792EA",
    },
  });
}
