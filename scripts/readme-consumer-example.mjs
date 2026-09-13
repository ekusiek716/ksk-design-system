/** Only explicitly marked, copyable quickstart examples are executable. */
export function readReadmeConsumerExample(markdown, kind) {
  const start = `<!-- consumer-example:${kind}:start -->`
  const end = `<!-- consumer-example:${kind}:end -->`
  if (markdown.split(start).length !== 2 || markdown.split(end).length !== 2) {
    throw new Error(`README requires exactly one ${kind} consumer example`)
  }
  const startIndex = markdown.indexOf(start)
  const endIndex = markdown.indexOf(end)
  if (endIndex < startIndex) throw new Error(`README ${kind} consumer example markers are reversed`)
  const section = markdown.slice(startIndex + start.length, endIndex)
  const blocks = [...section.matchAll(/```(tsx|css)\r?\n([\s\S]*?)```/g)]
  if (blocks.length !== 1 || blocks[0][1] !== kind || !blocks[0][2].trim()) {
    throw new Error(`README ${kind} consumer example must contain one nonempty ${kind} block`)
  }
  return blocks[0][2]
}
