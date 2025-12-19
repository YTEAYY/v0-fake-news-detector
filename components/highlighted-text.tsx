import type { JSX } from "react"

interface HighlightedTextProps {
  text: string
  highlights: {
    exaggeration: string[]
    sourceless: string[]
    emotional: string[]
  }
}

export function HighlightedText({ text, highlights }: HighlightedTextProps) {
  // Create a combined list of all highlights with their types
  const allHighlights: { word: string; type: "exaggeration" | "sourceless" | "emotional" }[] = [
    ...highlights.exaggeration.map((word) => ({ word, type: "exaggeration" as const })),
    ...highlights.sourceless.map((word) => ({ word, type: "sourceless" as const })),
    ...highlights.emotional.map((word) => ({ word, type: "emotional" as const })),
  ]

  // Sort by length (longest first) to handle overlapping matches
  allHighlights.sort((a, b) => b.word.length - a.word.length)

  // Function to get color class based on type
  const getColorClass = (type: "exaggeration" | "sourceless" | "emotional") => {
    switch (type) {
      case "exaggeration":
        return "bg-red-200 dark:bg-red-900/40 text-red-900 dark:text-red-200 px-1 rounded"
      case "sourceless":
        return "bg-orange-200 dark:bg-orange-900/40 text-orange-900 dark:text-orange-200 px-1 rounded"
      case "emotional":
        return "bg-yellow-200 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-200 px-1 rounded"
    }
  }

  // Build highlighted text with HTML markup
  const highlightedText = text
  const matches: { start: number; end: number; type: "exaggeration" | "sourceless" | "emotional" }[] = []

  // Find all matches
  allHighlights.forEach(({ word, type }) => {
    let index = 0
    while ((index = highlightedText.indexOf(word, index)) !== -1) {
      // Check if this position is already covered
      const isOverlapping = matches.some((m) => index >= m.start && index < m.end)

      if (!isOverlapping) {
        matches.push({
          start: index,
          end: index + word.length,
          type,
        })
      }
      index += word.length
    }
  })

  // Sort matches by start position
  matches.sort((a, b) => a.start - b.start)

  // Build the result with highlights
  const result: JSX.Element[] = []
  let lastIndex = 0

  matches.forEach((match, idx) => {
    // Add text before highlight
    if (match.start > lastIndex) {
      result.push(<span key={`text-${idx}`}>{text.slice(lastIndex, match.start)}</span>)
    }

    // Add highlighted text
    result.push(
      <mark key={`mark-${idx}`} className={getColorClass(match.type)}>
        {text.slice(match.start, match.end)}
      </mark>,
    )

    lastIndex = match.end
  })

  // Add remaining text
  if (lastIndex < text.length) {
    result.push(<span key="text-end">{text.slice(lastIndex)}</span>)
  }

  return <div className="whitespace-pre-wrap leading-relaxed">{result}</div>
}
