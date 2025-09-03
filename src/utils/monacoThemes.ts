export const MonacoThemes = {
  // Codex customDark theme
  codexDark: {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6A9955", fontStyle: "italic" },
      { token: "keyword", foreground: "C586C0" },
      { token: "string", foreground: "CE9178" },
      { token: "number", foreground: "B5CEA8" },
      { token: "function", foreground: "FFD700" },
    ],
    colors: {
      "editor.background": "#0d1117",
      "editor.foreground": "#ffffff",
      "editorCursor.foreground": "#ffcc00",
      "editor.lineHighlightBackground": "#1e1e1e",
      "editor.selectionBackground": "#264f78",
      "editor.lineHighlightBorder": "#333333",
      "editor.inactiveSelectionBackground": "#3a3d41",
      "minimap.background": "#1e1e1e",
    },
  },

  // Dracula Theme
  dracula: {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6272A4", fontStyle: "italic" },
      { token: "keyword", foreground: "FF79C6" },
      { token: "number", foreground: "BD93F9" },
      { token: "string", foreground: "F1FA8C" },
      { token: "variable", foreground: "FFB86C" },
      { token: "function", foreground: "50FA7B" },
    ],
    colors: {
      "editor.background": "#282A36",
      "editor.foreground": "#F8F8F2",
      "editorCursor.foreground": "#FFCC00",
      "editorLineNumber.foreground": "#6272A4",
      "editor.selectionBackground": "#44475A",
      "editor.lineHighlightBackground": "#44475A50",
    },
  },

  // One Dark Pro Theme
  oneDark: {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "5C6370", fontStyle: "italic" },
      { token: "keyword", foreground: "C678DD" },
      { token: "number", foreground: "D19A66" },
      { token: "string", foreground: "98C379" },
      { token: "variable", foreground: "E06C75" },
      { token: "function", foreground: "61AFEF" },
    ],
    colors: {
      "editor.background": "#282C34",
      "editor.foreground": "#ABB2BF",
      "editorCursor.foreground": "#528BFF",
      "editorLineNumber.foreground": "#636D83",
      "editor.selectionBackground": "#3E4451",
      "editor.lineHighlightBackground": "#2C313C",
    },
  },

  // Monokai Theme
  monokai: {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "75715E", fontStyle: "italic" },
      { token: "keyword", foreground: "F92672" },
      { token: "number", foreground: "AE81FF" },
      { token: "string", foreground: "E6DB74" },
      { token: "variable", foreground: "F8F8F2" },
      { token: "function", foreground: "A6E22E" },
    ],
    colors: {
      "editor.background": "#272822",
      "editor.foreground": "#F8F8F2",
      "editorCursor.foreground": "#F8F8F0",
      "editorLineNumber.foreground": "#75715E",
      "editor.selectionBackground": "#49483E",
      "editor.lineHighlightBackground": "#3E3D32",
    },
  },

  // Solarized Dark Theme
  solarizedDark: {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "586e75", fontStyle: "italic" },
      { token: "keyword", foreground: "859900" },
      { token: "number", foreground: "2aa198" },
      { token: "string", foreground: "b58900" },
      { token: "variable", foreground: "93a1a1" },
      { token: "function", foreground: "268bd2" },
    ],
    colors: {
      "editor.background": "#002b36",
      "editor.foreground": "#93a1a1",
      "editorCursor.foreground": "#d33682",
      "editorLineNumber.foreground": "#586e75",
      "editor.selectionBackground": "#073642",
      "editor.lineHighlightBackground": "#073642",
    },
  },

  // GitHub Dark Theme
  githubDark: {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6A737D", fontStyle: "italic" },
      { token: "keyword", foreground: "F97583" },
      { token: "number", foreground: "79B8FF" },
      { token: "string", foreground: "9ECBFF" },
      { token: "variable", foreground: "E1E4E8" },
      { token: "function", foreground: "B392F0" },
    ],
    colors: {
      "editor.background": "#0D1117",
      "editor.foreground": "#C9D1D9",
      "editorCursor.foreground": "#F0F6FC",
      "editorLineNumber.foreground": "#6E7681",
      "editor.selectionBackground": "#264F78",
      "editor.lineHighlightBackground": "#161B22",
    },
  },

  // GitHub Light Theme
  githubLight: {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6A737D", fontStyle: "italic" },
      { token: "keyword", foreground: "D73A49" },
      { token: "number", foreground: "005CC5" },
      { token: "string", foreground: "032F62" },
      { token: "variable", foreground: "24292E" },
      { token: "function", foreground: "6F42C1" },
    ],
    colors: {
      "editor.background": "#FFFFFF",
      "editor.foreground": "#24292E",
      "editorCursor.foreground": "#000000",
      "editorLineNumber.foreground": "#959DA5",
      "editor.selectionBackground": "#BFDADC",
      "editor.lineHighlightBackground": "#F6F8FA",
    },
  },

  // Solarized Light Theme
  solarizedLight: {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "93a1a1", fontStyle: "italic" },
      { token: "keyword", foreground: "268bd2" },
      { token: "number", foreground: "2aa198" },
      { token: "string", foreground: "859900" },
      { token: "variable", foreground: "586e75" },
      { token: "function", foreground: "b58900" },
    ],
    colors: {
      "editor.background": "#fdf6e3",
      "editor.foreground": "#657b83",
      "editorCursor.foreground": "#586e75",
      "editorLineNumber.foreground": "#93a1a1",
      "editor.selectionBackground": "#eee8d5",
      "editor.lineHighlightBackground": "#eee8d5",
    },
  },

  // Quiet Light Theme
  quietLight: {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "008000", fontStyle: "italic" },
      { token: "keyword", foreground: "AF00DB" },
      { token: "number", foreground: "09885A" },
      { token: "string", foreground: "A31515" },
      { token: "variable", foreground: "001080" },
      { token: "function", foreground: "795E26" },
    ],
    colors: {
      "editor.background": "#F5F5F5",
      "editor.foreground": "#001080",
      "editorCursor.foreground": "#000000",
      "editorLineNumber.foreground": "#2B91AF",
      "editor.selectionBackground": "#ADD6FF",
      "editor.lineHighlightBackground": "#E5E5E5",
    },
  },

  // Tomorrow Night Theme
  tomorrowNight: {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "969896", fontStyle: "italic" },
      { token: "keyword", foreground: "CC99CC" },
      { token: "number", foreground: "F99157" },
      { token: "string", foreground: "8ABEB7" },
      { token: "variable", foreground: "C5C8C6" },
      { token: "function", foreground: "81A2BE" },
    ],
    colors: {
      "editor.background": "#1D1F21",
      "editor.foreground": "#C5C8C6",
      "editorCursor.foreground": "#AEAFAD",
      "editorLineNumber.foreground": "#373B41",
      "editor.selectionBackground": "#373B41",
      "editor.lineHighlightBackground": "#282A2E",
    },
  },

  // Night Owl Theme
  nightOwl: {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "637777", fontStyle: "italic" },
      { token: "keyword", foreground: "C792EA" },
      { token: "number", foreground: "F78C6C" },
      { token: "string", foreground: "ECC48D" },
      { token: "variable", foreground: "82AAFF" },
      { token: "function", foreground: "7FDBCA" },
    ],
    colors: {
      "editor.background": "#011627",
      "editor.foreground": "#D6DEEB",
      "editorCursor.foreground": "#80CBC4",
      "editorLineNumber.foreground": "#5F7E97",
      "editor.selectionBackground": "#1D3B53",
      "editor.lineHighlightBackground": "#0B253A",
    },
  },
};
