import { context_menu, context_menu_states } from "./stores";


export function openingMenu(e: MouseEvent, element: Object) {
  e.preventDefault();
  e.stopPropagation();

  if (element) {
    context_menu.update(() => ({ type: element.type }));
    context_menu_states.update(() => ({ ...element }))
  } else {
    context_menu.update(() => ({ type: "default" }));
  }

  setTimeout(() => {
    const contextMenu = document.getElementById("contextmenu");
    if (contextMenu.children.length > 0) {

      if (contextMenu.classList.contains("hidden")) {
        contextMenu.classList.remove("hidden");
      }

      const menuWidth = contextMenu.offsetWidth
      const menuHeight = contextMenu.offsetHeight

      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      const clickX = e.clientX;
      const clickY = e.clientY;


      if ((menuWidth + clickX) > windowWidth) {
        const overflowX = (menuWidth + clickX) - windowWidth;
        contextMenu.style.left = (clickX - overflowX) - 10 + "px";
      } else {
        contextMenu.style.left = (clickX + window.pageXOffset) + "px";
      }

      if ((menuHeight + clickY) > windowHeight) {
        const overflowY = (menuHeight + clickY) - windowHeight;
        contextMenu.style.top = (clickY - overflowY) - 10 + "px";
      } else {
        contextMenu.style.top = (clickY + window.pageYOffset) + "px";
      }
    }

  })
}
