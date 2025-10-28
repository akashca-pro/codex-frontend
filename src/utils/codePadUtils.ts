export const getFileIcon = (language: string) => {
    console.log(language);
  switch (language) {
    case "javascript":
      return "🟨"
    case "python":
      return "🐍"
    case "go":
      return ""
    default:
      return "📄"
  }
}