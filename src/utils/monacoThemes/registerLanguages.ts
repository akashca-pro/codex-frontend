// utils/monacoThemes/registerLanguages.ts
import * as monaco from "monaco-editor";

export function registerLanguages(monacoInstance: typeof monaco) {
  // Python
  monacoInstance.languages.register({ id: "python" });
  monacoInstance.languages.setMonarchTokensProvider("python", {
    tokenizer: {
      root: [
        [/#.*/, "comment"],
        [/\b(def|class|if|else|elif|while|for|import|from|return|pass|break|continue|try|except|finally|with|as|lambda|yield|in|is|and|or|not)\b/, "keyword"],
        [/\b(True|False|None)\b/, "constant"],
        [/\d+(\.\d+)?/, "number"],
        [/"([^"\\]|\\.)*$/, "string.invalid"], // non-terminated string
        [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],
      ],
      string: [
        [/[^\\"]+/, "string"],
        [/\\./, "string.escape"],
        [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
      ],
    },
  });

  // Go
  monacoInstance.languages.register({ id: "go" });
  monacoInstance.languages.setMonarchTokensProvider("go", {
    tokenizer: {
      root: [
        [/\b(package|import|func|var|const|type|struct|interface|return|if|else|for|range|map|chan|go|defer|select|switch|case|default)\b/, "keyword"],
        [/\b(true|false|nil|iota)\b/, "constant"],
        [/\d+/, "number"],
        [/".*?"/, "string"],
        [/\'.*?\'/, "string"],
      ],
    },
  });
}
