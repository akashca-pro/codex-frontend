export function registerMonacoTheme(monaco, themeName, themeJson) {
  const base = themeJson.type === "dark" ? "vs-dark" : themeJson.type === "light" ? "vs" : "vs-dark";

  // Build rules from tokenColors
  const rules = themeJson.tokenColors?.flatMap((token) => {
    const scopes = Array.isArray(token.scope) ? token.scope : token.scope ? [token.scope] : [];
    return scopes.map((scope) => ({
      token: scope,
      foreground: token.settings.foreground?.replace('#', ''),
      background: token.settings.background?.replace('#', ''),
      fontStyle: token.settings.fontStyle,
    }));
  }) ?? [];

  // Add specific token rules for better syntax highlighting
  const customRules = [
    // Keywords (if, else, return, etc.)
    { token: 'keyword', foreground: 'C792EA' },
    { token: 'keyword.control', foreground: 'C792EA' },
    { token: 'keyword.operator', foreground: '89DDFF' },

    // Functions
    { token: 'function', foreground: '82AAFF' },
    { token: 'function.builtin', foreground: '82AAFF', },
    { token: 'method', foreground: '82AAFF' },

    // Classes & Types
    { token: 'class', foreground: 'FFCB6B' },
    { token: 'type', foreground: 'FFCB6B' },
    { token: 'type.identifier', foreground: '82AAFF' },

    // Variables / Identifiers
    { token: 'identifier', foreground: 'DCDDDD' },
    { token: 'variable', foreground: 'A6ACCD' },
    { token: 'variable.parameter', foreground: 'A6ACCD' },

    // Constants
    { token: 'constant', foreground: 'C792EA' },
    { token: 'constant.language', foreground: 'FF5370' },
    { token: 'number', foreground: 'F78C6C' },

    // Strings
    { token: 'string', foreground: 'C3E88D' },
    { token: 'string.escape', foreground: '89DDFF' },
    { token: 'string.template', foreground: 'C3E88D' },

    // Operators & punctuation
    { token: 'operator', foreground: '89DDFF' },
    { token: 'delimiter', foreground: '89DDFF' },

    // Comments
    { token: 'comment', foreground: '74985d', fontStyle: 'italic' },

    // JavaScript-specific
    { token: 'this', foreground: 'FF5370', },
    { token: 'super', foreground: 'FF5370', },
    { token: 'new', foreground: 'C792EA', },
    { token: 'null', foreground: 'FF5370' },
    { token: 'undefined', foreground: 'FF5370' },
    { token: 'NaN', foreground: 'FF5370' },
    { token: 'async', foreground: 'C792EA' },
    { token: 'await', foreground: 'C792EA', },
  ];
  
  monaco.editor.defineTheme(themeName, {
    base,
    inherit: true,
    rules: [...rules, ...customRules],
    colors: themeJson.colors || {},
  });
}
