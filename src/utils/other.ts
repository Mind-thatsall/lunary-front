export function checkKey(e: KeyboardEvent) {
  let regex = /^[a-zA-Z0-9!#&]$/;
  const textarea = document.getElementById("textarea")
  if (regex.test(e.key)) {
    textarea.focus()
  } else if (e.key === "Escape") {
    textarea.blur()
  }


}
