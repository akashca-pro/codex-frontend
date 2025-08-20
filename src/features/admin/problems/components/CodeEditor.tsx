import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code } from "lucide-react"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  placeholder?: string
  disabled?: boolean
  className?: string
}

export default function CodeEditor({
  value,
  onChange,
  language = "javascript",
  placeholder = "Enter your code here...",
  disabled = false,
  className = "",
}: CodeEditorProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Code className="h-4 w-4" />
          Code Editor ({language})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="min-h-[300px] font-mono text-sm resize-none"
        />
        <p className="text-xs text-muted-foreground mt-2">
         {language}
        </p>
      </CardContent>
    </Card>
  )
}
