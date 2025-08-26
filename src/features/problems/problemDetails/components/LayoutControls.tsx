import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SplitSquareHorizontal, SplitSquareVertical, Maximize2, Users, StickyNote } from "lucide-react"

interface LayoutControlsProps {
  layout: "horizontal" | "vertical" | "editor-only"
  onLayoutChange: (layout: "horizontal" | "vertical" | "editor-only") => void
  onToggleNotes: () => void
  onToggleCollaboration: () => void
  showNotes: boolean
}

export default function LayoutControls({
  layout,
  onLayoutChange,
  onToggleNotes,
  onToggleCollaboration,
  showNotes,
}: LayoutControlsProps) {
  return (
    <TooltipProvider>
      <Card className="p-2 bg-card/50 backdrop-blur-sm border-gray-800">
        <div className="flex items-center gap-1">
          {/* Layout Controls */}
          <div className="flex items-center gap-1 pr-2 border-r border-gray-800">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={layout === "horizontal" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onLayoutChange("horizontal")}
                  className="h-8 w-8 p-0"
                >
                  <SplitSquareHorizontal className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Horizontal Split</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={layout === "vertical" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onLayoutChange("vertical")}
                  className="h-8 w-8 p-0"
                >
                  <SplitSquareVertical className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Vertical Split</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={layout === "editor-only" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onLayoutChange("editor-only")}
                  className="h-8 w-8 p-0"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Editor Only</TooltipContent>
            </Tooltip>
          </div>

          {/* Feature Controls */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={showNotes ? "default" : "ghost"}
                  size="sm"
                  onClick={onToggleNotes}
                  className="h-8 w-8 p-0"
                >
                  <StickyNote className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Toggle Notes</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={onToggleCollaboration} className="h-8 w-8 p-0">
                  <Users className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Collaboration (Coming Soon)</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  )
}
