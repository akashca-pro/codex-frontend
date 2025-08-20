import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import LanguageSelect from "../LanguageSelect"
import type { LanguageType, StarterCodeType } from "../../../validation/schema"

interface StarterCodeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValue?: StarterCodeType
  onSave: (value: StarterCodeType) => void
}

export function StarterCodeModal({ open, onOpenChange, initialValue, onSave }: StarterCodeModalProps) {
  const [language, setLanguage] = useState<LanguageType>("javascript")
  const [code, setCode] = useState("")

  useEffect(() => {
    if (open && initialValue) {
      setLanguage(initialValue.language)
      setCode(initialValue.code)
    } else if (open && !initialValue) {
      setLanguage("javascript")
      setCode("")
    }
  }, [open, initialValue])

  const handleSave = () => {
    onSave({ language, code })
    onOpenChange(false)
  }

  const handleCancel = () => {
    // Reset state when canceling
    if (initialValue) {
      setLanguage(initialValue.language)
      setCode(initialValue.code)
    } else {
      setLanguage("javascript")
      setCode("")
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl overflow-y-auto scrollbar-hide ">
        <DialogHeader>
          <DialogTitle>{initialValue ? "Edit Starter Code" : "Add Starter Code"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <LanguageSelect value={language} onValueChange={setLanguage} />

          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter starter code..."
            className="font-mono text-sm min-h-[120px]"
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}