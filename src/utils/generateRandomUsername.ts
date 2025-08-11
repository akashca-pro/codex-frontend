export const generateRandomUsername = (): string => {
  const adjectives = [
    "code", "debug", "stack", "script", "binary", "async", "dev", "logic",
    "muscle", "cyber", "byte", "cloud", "terminal", "syntax", "pixel", "node",
    "quantum", "zero", "dark", "silent", "neon", "wired", "modular", "reactive",
    "atomic", "virtual", "elastic", "secure", "rapid", "dynamic", "solid", "rogue"
  ];

  const nouns = [
    "wizard", "ninja", "vampire", "hacker", "guru", "pirate", "engineer",
    "samurai", "architect", "sniper", "ghost", "bot", "monk", "sorcerer",
    "compiler", "kernel", "daemon", "matrix", "agent", "builder", "coder",
    "devil", "phantom", "executor", "overlord", "warrior", "machine", "cyborg",
    "scriptor", "operator", "alchemist", "drifter", "enchanter", "glitch"
  ];

  const separator = ["_"];
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const sep = separator[Math.floor(Math.random() * separator.length)];

  return `${adj}${sep}${noun}${randomNumber}`;
};
