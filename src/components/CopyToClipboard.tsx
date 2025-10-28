import { Copy } from "lucide-react"
import { toast } from "sonner"

interface CopyToClipboardProps {
  text: string
  label?: string
}

const CopyToClipboard: React.FC<CopyToClipboardProps> = ({ text, label }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    toast.info(`${label || "Text"} copied to clipboard!`,{position : 'bottom-right'})
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-muted transition"
      title={`Copy ${label || "text"}`}
    >
      <Copy className="w-4 h-4 text-muted-foreground" />
    </button>
  )
}

export default CopyToClipboard
