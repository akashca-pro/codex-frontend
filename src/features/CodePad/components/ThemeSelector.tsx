import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shuffle } from "lucide-react"

export default function ThemeSelector({
  editorTheme,
  themeKeys,
  onThemeChange,
}) {
  const handleRandomTheme = () => {
    if (!themeKeys?.length) return;

    const randomTheme =
      themeKeys[Math.floor(Math.random() * themeKeys.length)];

    onThemeChange(randomTheme);
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={editorTheme} onValueChange={onThemeChange}>
        <SelectTrigger className="w-[110px] h-8 bg-background/50 [&>span+svg]:hidden">
          <SelectValue placeholder="Select Theme" />
        </SelectTrigger>

        <SelectContent className="border-none">
          {themeKeys.map((theme) => (
            <SelectItem key={theme} value={theme} className="truncate">
              {theme}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Random Theme Button */}
      <button
        type="button"
        onClick={handleRandomTheme}
        title="Random Theme"
        aria-label="Random Theme"
        className="h-8 w-8 flex items-center justify-center rounded-md bg-background/50 hover:bg-background/80 transition"
      >
        <Shuffle className="w-4 h-4" />
      </button>
    </div>
  );
}
