import { useEffect, useState } from "react"

const TypewriterTitle = () => {
  const [text, setText] = useState("")
  const fullText = "CodeX"
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)
  const [typingSpeed, setTypingSpeed] = useState(150) // Slowed down

  useEffect(() => {
    const handleTyping = () => {
      const updatedText = isDeleting
        ? fullText.substring(0, text.length - 1)
        : fullText.substring(0, text.length + 1)

      setText(updatedText)

      if (!isDeleting && updatedText === fullText) {
        setTimeout(() => setIsDeleting(true), 1500) // Pause before deleting
      } else if (isDeleting && updatedText === "") {
        setIsDeleting(false)
        setLoopNum(loopNum + 1)
      }

      setTypingSpeed(isDeleting ? 120 : 200) //  Slower
    }

    const timer = setTimeout(handleTyping, typingSpeed)
    return () => clearTimeout(timer)
  }, [text, isDeleting, loopNum, typingSpeed])

  return (
    <div
      className="text-orange-600 text-3xl font-bold w-[100px] text-nowrap"
      style={{ minHeight: "2.5rem" }} // Prevent shifting
    >
      {text}
      <span className="blinking-cursor">|</span>
    </div>
  )
}

export default TypewriterTitle
