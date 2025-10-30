import type React from "react"
import { useCollaboration } from "./CollaborationProvider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Code2 } from "lucide-react"
import { toast } from "sonner"

const LANGUAGES = [
  { value: "javascript", label: "JavaScript", icon: "⚡" },
  { value: "typescript", label: "TypeScript", icon: "📘" },
  { value: "python", label: "Python", icon: "🐍" },
  { value: "java", label: "Java", icon: "☕" },
  { value: "cpp", label: "C++", icon: "⚙️" },
  { value: "go", label: "Go", icon: "🐹" },
]

const LanguageSelect: React.FC = () => {
  const { metadata, socket, doc } = useCollaboration()

  const currentLanguage = metadata?.language || "javascript"

  const handleLanguageChange = (newLanguage: string) => {
    if (socket && socket.connected && doc) {
      // Update Yjs metadata
      const metadataMap = doc.getMap("metadata")
      metadataMap.set("language", newLanguage)

      // Emit socket event
      socket.emit("metadata-changed", { language: newLanguage })

      toast.success(`Language set to ${LANGUAGES.find((l) => l.value === newLanguage)?.label}`)
    }
  }

  return (
    <Select value={currentLanguage} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[140px] h-8">
        <Code2 className="h-3.5 w-3.5 mr-1" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            <span className="flex items-center gap-2">
              {lang.icon} {lang.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default LanguageSelect
