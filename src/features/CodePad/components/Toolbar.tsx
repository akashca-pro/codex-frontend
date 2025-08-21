import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Play, Download, Users, Settings, Moon, Sun, Zap } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface Language {
  id: string
  name: string
  extension: string
  color: string
}

const languages: Language[] = [
  { id: "javascript", name: "JavaScript", extension: "js", color: "bg-yellow-500" },
  { id: "typescript", name: "TypeScript", extension: "ts", color: "bg-blue-500" },
  { id: "python", name: "Python", extension: "py", color: "bg-green-500" },
  { id: "java", name: "Java", extension: "java", color: "bg-orange-500" },
]

interface IDEToolbarProps {
  language: string
  onLanguageChange: (language: string) => void
  theme: string
  onThemeChange: (theme: string) => void
  onRun: () => void
  onDownload: () => void
  onCollaboration: () => void
  isRunning?: boolean
  fontSize : number;
  onFontSizeChange: (size: number) => void;
  intelliSense : boolean
  onToggleIntelliSense : () => void

}

export default function IDEToolbar({
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  onRun,
  onDownload,
  onCollaboration,
  isRunning = false,
  fontSize,
  onFontSizeChange,
  intelliSense,
  onToggleIntelliSense
}: IDEToolbarProps) {
  const navigate = useNavigate();
  const selectedLanguage = languages.find((lang) => lang.id === language)

  const handleCollaboration = () => {
    onCollaboration()
    toast.info("Real-time collaboration feature coming soon!")
  }

  return (
    <motion.div
      className="flex items-center justify-between px-4 py-2 bg-card/30 backdrop-blur-sm border-b border-gray-800"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-2)} // navigate back
          className="h-8 gap-2"
        >
          ← Back
        </Button>
        {/* Language Selector */}
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-[140px] h-8 bg-background/50">
            <SelectValue>
              {selectedLanguage && (
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${selectedLanguage.color}`} />
                  <span className="text-sm">{selectedLanguage.name}</span>
                </div>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.id} value={lang.id}>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${lang.color}`} />
                  <span>{lang.name}</span>
                  <Badge variant="secondary" className="ml-auto text-xs">
                    .{lang.extension}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6" />

        {/* Action Buttons */}
        <div className="flex items-center gap-1">  
          <Button variant="default" size="sm" onClick={onRun} disabled={isRunning} className="h-8 gap-2">
            {isRunning ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              >
                <Zap className="h-4 w-4" />
              </motion.div>
            ) : (
              <Play className="h-4 w-4" />
            )}
            {isRunning ? "Running..." : "Run"}
          </Button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1">
          
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleIntelliSense}
        className={`h-8 gap-2 border-b-2 ${
          intelliSense ? "border-orange-500" : "border-transparent"
        }`}
      >
        IntelliSense
      </Button>

          {/* Font slider */}
        <div className="flex items-center gap-2 w-52 px-1">
          <span className="text-xs text-muted-foreground">Font</span>
          <Slider
            value={[fontSize]}
            onValueChange={(value) => onFontSizeChange(value[0])}
            min={12}
            max={24}
            step={1}
            className="flex-1"
          />
          <span className="text-xs">{fontSize}px</span>
        </div>     

        <Tooltip>
          <TooltipTrigger asChild >
            <Button variant="ghost" size="sm" onClick={handleCollaboration} className="h-8 gap-2">
              <Users className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Collaboration</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild >
          <Button variant="ghost" size="sm" onClick={onDownload} className="h-8 gap-2">
            <Download className="h-4 w-4" />
          </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download Project</p>
          </TooltipContent>
        </Tooltip>

        <Separator orientation="vertical" className="h-6" />

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onThemeChange(theme === "vs-dark" ? "vs-light" : "vs-dark")}
          className="h-8 w-8 p-0"
        >
          {theme === "vs-dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>

        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}
