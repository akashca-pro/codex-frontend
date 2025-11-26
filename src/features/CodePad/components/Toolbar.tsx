import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Download, } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import Timer from "@/features/problems/problemDetails/components/Timer"
import { MonacoThemes } from "@/utils/monacoThemes/index"
import { getLanguageIcon } from "@/utils/languageIcon"

interface Language {
  id: string
  name: string
}

const languages: Language[] = [
  { id: "javascript", name: "JavaScript" },
  { id: "python", name: "Python" },
  { id: "go", name: "Golang" },
]

interface IDEToolbarProps {
  language: string
  onLanguageChange: (language: string) => void
  onDownload?: () => void
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
  fontSize,
  onFontSizeChange,
  goBackLink,
  editorTheme,
  onThemeChange,
}: IDEToolbarProps) {
  const navigate = useNavigate();
  const selectedLanguage = languages.find((lang) => lang.id === language)
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
          <SelectTrigger className="w-[110px] h-8 bg-background/50 [&>span+svg]:hidden">
            <SelectValue placeholder="Select Theme" />
          </SelectTrigger>
          <SelectContent className="border-none">
            {themeKeys.map((theme) => (
              <SelectItem key={theme} value={theme} className="truncate" >
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
          <SelectTrigger className="w-[140px] h-8 bg-background/50 [&>span+svg]:hidden">
            <SelectValue>
              {selectedLanguage && (
                <div className="flex items-center gap-2">
                  <i className={getLanguageIcon(selectedLanguage.id)} ></i>
                  <span className="text-sm">{selectedLanguage.name}</span>
                </div>
                
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="border-none">
            {languages.map((lang) => (
              <SelectItem key={lang.id} value={lang.id}>
                <div className="flex items-center gap-2">
                  <i className={getLanguageIcon(lang.id)} ></i>
                  <span>{lang.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
          
      {/* <Button
        variant="ghost"
        size="sm"
        onClick={onToggleIntelliSense}
        className={`h-8 gap-2 border-b-2 ${
          intelliSense ? "border-orange-500" : "border-transparent"
        }`}
      >
        IntelliSense
      </Button> */}

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
