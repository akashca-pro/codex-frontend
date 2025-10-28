export function registerLanguages(monaco) {
  // Python with proper token classification
  monaco.languages.register({ id: "python" });
  monaco.languages.setMonarchTokensProvider("python", {
    keywords: [
      'def', 'class', 'if', 'else', 'elif', 'while', 'for', 'import', 
      'from', 'return', 'pass', 'break', 'continue', 'try', 'except', 
      'finally', 'with', 'as', 'lambda', 'yield', 'in', 'is', 'and', 
      'or', 'not', 'raise', 'assert', 'del', 'global', 'nonlocal', 'async', 'await'
    ],
    builtins: [
      'print', 'len', 'range', 'str', 'int', 'float', 'list', 'dict', 
      'tuple', 'set', 'bool', 'type', 'open', 'input', 'sorted', 'sum',
      'max', 'min', 'abs', 'all', 'any', 'enumerate', 'zip', 'map', 'filter'
    ],
    constants: ['True', 'False', 'None'],
    
    tokenizer: {
      root: [
        // Comments
        [/#.*$/, 'comment'],
        
        // Keywords
        [/\b(?:def|class|if|else|elif|while|for|import|from|return|pass|break|continue|try|except|finally|with|as|lambda|yield|in|is|and|or|not|raise|assert|del|global|nonlocal|async|await)\b/, 'keyword'],
        
        // Built-in functions (like print)
        [/\b(?:print|len|range|str|int|float|list|dict|tuple|set|bool|type|open|input|sorted|sum|max|min|abs|all|any|enumerate|zip|map|filter)\b/, 'function.builtin'],
        
        // Constants
        [/\b(?:True|False|None)\b/, 'constant.language'],
        
        // Function definitions
        [/\bdef\s+([a-zA-Z_][a-zA-Z0-9_]*)/, ['keyword', 'function']],
        
        // Class definitions
        [/\bclass\s+([a-zA-Z_][a-zA-Z0-9_]*)/, ['keyword', 'class']],
        
        // Numbers
        [/\b\d+\.?\d*([eE][-+]?\d+)?\b/, 'number'],
        
        // Strings
        [/"([^"\\]|\\.)*$/, 'string.invalid'],
        [/'([^'\\]|\\.)*$/, 'string.invalid'],
        [/"""/, { token: 'string', next: '@string_triple_double' }],
        [/'''/, { token: 'string', next: '@string_triple_single' }],
        [/"/, { token: 'string', next: '@string_double' }],
        [/'/, { token: 'string', next: '@string_single' }],
        
        // Operators
        [/[+\-*/%=<>!&|^~]/, 'operator'],
        
        // Identifiers
        [/[a-zA-Z_]\w*/, 'identifier'],
      ],
      
      string_double: [
        [/[^\\"]+/, 'string'],
        [/\\./, 'string.escape'],
        [/"/, { token: 'string', next: '@pop' }],
      ],
      
      string_single: [
        [/[^\\']+/, 'string'],
        [/\\./, 'string.escape'],
        [/'/, { token: 'string', next: '@pop' }],
      ],
      
      string_triple_double: [
        [/[^"\\]+/, 'string'],
        [/\\./, 'string.escape'],
        [/"""/, { token: 'string', next: '@pop' }],
        [/"/, 'string'],
      ],
      
      string_triple_single: [
        [/[^'\\]+/, 'string'],
        [/\\./, 'string.escape'],
        [/'''/, { token: 'string', next: '@pop' }],
        [/'/, 'string'],
      ],
    },
  });

  // Go with proper token classification
  monaco.languages.register({ id: "go" });
  monaco.languages.setMonarchTokensProvider("go", {
    tokenizer: {
      root: [
        // Comments
        [/\/\/.*$/, 'comment'],
        [/\/\*/, 'comment', '@comment'],
        
        // Keywords
        [/\b(?:package|import|func|var|const|type|struct|interface|return|if|else|for|range|map|chan|go|defer|select|switch|case|default|break|continue|fallthrough)\b/, 'keyword'],
        
        // Built-in functions
        [/\b(?:make|len|cap|new|append|copy|delete|panic|recover|print|println)\b/, 'function.builtin'],
        
        // Constants
        [/\b(?:true|false|nil|iota)\b/, 'constant.language'],
        
        // Types
        [/\b(?:int|int8|int16|int32|int64|uint|uint8|uint16|uint32|uint64|float32|float64|complex64|complex128|byte|rune|string|bool|error)\b/, 'type'],
        
        // Numbers
        [/\d+/, 'number'],
        
        // Strings
        [/".*?"/, 'string'],
        [/`[^`]*`/, 'string'],
        [/'.'/, 'string'],
        
        // Operators
        [/[+\-*/%=<>!&|^]/, 'operator'],
      ],
      
      comment: [
        [/[^\/*]+/, 'comment'],
        [/\*\//, 'comment', '@pop'],
        [/[\/*]/, 'comment'],
      ],
    },
  });

monaco.languages.register({ id: "javascript" });
  monaco.languages.setMonarchTokensProvider("javascript", {
    keywords: [
      "break","case","catch","class","const","continue","debugger","default",
      "delete","do","else","export","extends","finally","for","from","function",
      "if","import","in","instanceof","let","new","return","super","switch",
      "this","throw","try","typeof","var","void","while","with","yield","async","await"
    ],

    builtins: [
      "console","window","document","Array","Object","String","Number","Boolean",
      "Symbol","Date","Promise","RegExp","Math","JSON","Error","Map","Set","WeakMap",
      "WeakSet","Proxy","Reflect","Intl","isNaN","isFinite","parseInt","parseFloat"
    ],

    constants: [
      "true","false","null","undefined","NaN","Infinity"
    ],

    tokenizer: {
      root: [
        // Comments
        [/\/\/.*$/, "comment"],
        [/\/\*/, "comment", "@comment"],

        // Keywords
        [/\b(?:break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|from|function|if|import|in|instanceof|let|new|return|super|switch|this|throw|try|typeof|var|void|while|with|yield|async|await)\b/, "keyword"],

        // Builtins
        [/\b(?:console|window|document|Array|Object|String|Number|Boolean|Symbol|Date|Promise|RegExp|Math|JSON|Error|Map|Set|WeakMap|WeakSet|Proxy|Reflect|Intl|isNaN|isFinite|parseInt|parseFloat)\b/, "function.builtin"],

        // Constants
        [/\b(?:true|false|null|undefined|NaN|Infinity)\b/, "constant.language"],

        // Function definitions
        [/\bfunction\s+([a-zA-Z_]\w*)/, ["keyword", "function"]],

        // Class definitions
        [/\bclass\s+([A-Z][a-zA-Z0-9_]*)/, ["keyword", "class"]],

        // Numbers (int, float, hex, binary, octal)
        [/\b0[xX][0-9a-fA-F]+\b/, "number"],
        [/\b0[bB][01]+\b/, "number"],
        [/\b0[oO][0-7]+\b/, "number"],
        [/\b\d+(\.\d+)?([eE][\-+]?\d+)?\b/, "number"],

        // Strings
        [/"([^"\\]|\\.)*$/, "string.invalid"],
        [/'([^'\\]|\\.)*$/, "string.invalid"],
        [/"/, { token: "string", next: "@string_double" }],
        [/'/, { token: "string", next: "@string_single" }],
        [/`/, { token: "string", next: "@string_template" }],

        // Operators
        [/[+\-*/%=<>!&|^~?:]/, "operator"],

        // Identifiers
        [/[a-zA-Z_$][\w$]*/, "identifier"],
      ],

      // String handling
      string_double: [
        [/[^\\"]+/, "string"],
        [/\\./, "string.escape"],
        [/"/, { token: "string", next: "@pop" }],
      ],

      string_single: [
        [/[^\\']+/, "string"],
        [/\\./, "string.escape"],
        [/'/, { token: "string", next: "@pop" }],
      ],

      string_template: [
        [/[^\\`$]+/, "string"],
        [/\\./, "string.escape"],
        [/\$\{/, { token: "delimiter.bracket", next: "@bracketCounting" }],
        [/`/, { token: "string", next: "@pop" }],
      ],

      bracketCounting: [
        [/\{/, "delimiter.bracket", "@bracketCounting"],
        [/\}/, "delimiter.bracket", "@pop"],
        { include: "root" },
      ],

      // Multiline comments
      comment: [
        [/[^/*]+/, "comment"],
        [/\*\//, "comment", "@pop"],
        [/[\/*]/, "comment"],
      ],
    },
  });
}