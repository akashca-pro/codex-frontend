import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface Language {
  id: string
  name: string
  extension: string
  monacoId: string
  color: string
}

const languages: Language[] = [
  { id: "javascript", name: "JavaScript", extension: "js", monacoId: "javascript", color: "bg-yellow-500" },
  { id: "typescript", name: "TypeScript", extension: "ts", monacoId: "typescript", color: "bg-blue-500" },
  { id: "python", name: "Python", extension: "py", monacoId: "python", color: "bg-green-500" },
  { id: "java", name: "Java", extension: "java", monacoId: "java", color: "bg-orange-500" },
  { id: "cpp", name: "C++", extension: "cpp", monacoId: "cpp", color: "bg-purple-500" },
]

interface LanguageSelectorProps {
  value: string
  onChange: (value: string) => void
}

export default function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const selectedLanguage = languages.find((lang) => lang.id === value)

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] bg-card/50 backdrop-blur-sm border-gray-800">
        <SelectValue>
          {selectedLanguage && (
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${selectedLanguage.color}`} />
              <span>{selectedLanguage.name}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.id} value={language.id}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${language.color}`} />
              <span>{language.name}</span>
              <Badge variant="secondary" className="ml-auto text-xs">
                .{language.extension}
              </Badge>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
