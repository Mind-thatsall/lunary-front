import DOMPurify from "dompurify";

export function formattedHTML(userInput: string) {

  let escaped = escapeCharacter(userInput)
  console.log(escaped)

  let formatted = escaped.replace(/\*\*(.*?)\*\*/g, "<span class='font-bold'>$1</span>")
    .replace(/\*(.*?)\*/g, "<span class='text-italic'>$1</span>")
    .replace(/--(.*?)--/g, "<del>$1</del>")
    .replace(/__(.*?)__/g, "<u>$1</u>")
    .replace(/#(.*?)#/g, "<span class='text-4xl'>$1</span>")
    .replace(/\n/g, "<br>")

  let sanitized = DOMPurify.sanitize(formatted)


  return sanitized;
}


function escapeCharacter(userInput: string) {
  return userInput.replace(/([<>\/&]|&lt;|&gt;|&amp;)/g, "<span>$1</span>");
}
