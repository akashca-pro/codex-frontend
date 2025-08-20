import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { LanguageType } from "../../validation/schema"

interface LanguageSelectProps {
  value?: LanguageType
  onValueChange: (value: LanguageType) => void
  placeholder?: string
  disabled?: boolean
}

const languages = [
  { value: "cpp" as const, label: "C++" },
  { value: "java" as const, label: "Java" },
  { value: "python" as const, label: "Python" },
  { value: "javascript" as const, label: "JavaScript" },
  { value: "go" as const, label: "Go" },
]

export default function LanguageSelect({
  value,
  onValueChange,
  placeholder = "Select language",
  disabled = false,
}: LanguageSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.value} value={lang.value}>
            {lang.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
