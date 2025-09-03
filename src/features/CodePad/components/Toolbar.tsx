import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Users, } from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import Timer from "@/features/problems/problemDetails/components/Timer"
import { MonacoThemes } from "@/utils/monacoThemes"

interface Language {
  id: string
  name: string
  extension: string
  color: string
}

const languages: Language[] = [
  { id: "javascript", name: "JavaScript", extension: "js", color: "bg-yellow-500" },
  { id: "python", name: "Python", extension: "py", color: "bg-green-500" },
  { id: "go", name: "Golang", extension: "go", color: "bg-blue-500" },
]

interface IDEToolbarProps {
  language: string
  onLanguageChange: (language: string) => void
  onDownload?: () => void
  onCollaboration: () => void
  fontSize : number;
  onFontSizeChange: (size: number) => void;
  intelliSense : boolean
  onToggleIntelliSense : () => void
  goBackLink : string;
  editorTheme : string;
  onThemeChange: (theme: string) => void
}

export default function IDEToolbar({
  language,
  onLanguageChange,
  onDownload,
  onCollaboration,
  fontSize,
  onFontSizeChange,
  intelliSense,
  onToggleIntelliSense,
  goBackLink,
  editorTheme,
  onThemeChange,
}: IDEToolbarProps) {
  const navigate = useNavigate();
  const selectedLanguage = languages.find((lang) => lang.id === language)

  const handleCollaboration = () => {
    onCollaboration()
    toast.info("Real-time collaboration feature coming soon!")
  }

  const themeKeys = Object.keys(MonacoThemes);

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
          onClick={() => navigate(goBackLink)} 
          className="h-8 gap-2"
        >
          ← Back
        </Button>
        <Separator orientation="vertical" className="h-6" />

        {/* Theme Selector */}
        <Select value={editorTheme} onValueChange={onThemeChange}>
          <SelectTrigger className="w-[160px] h-8 bg-background/50">
            <SelectValue placeholder="Select Theme" />
          </SelectTrigger>
          <SelectContent className="border-none">
            {themeKeys.map((theme) => (
              <SelectItem key={theme} value={theme}>
                {theme}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <Timer/>
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
          <SelectContent className="border-none">
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

        {onDownload && <Tooltip>
          <TooltipTrigger asChild >
          <Button variant="ghost" size="sm" onClick={onDownload} className="h-8 gap-2">
            <Download className="h-4 w-4" />
          </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download Project</p>
          </TooltipContent>
        </Tooltip>}
        <Separator orientation="vertical" className="h-6" />
      </div>
    </motion.div>
  )
}
