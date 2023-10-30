<script lang="ts">
  import { onMount, tick } from "svelte";
  import {
    user_store,
    current_loc,
    curr_server_users_store,
  } from "../../utils/stores";
  import AddEmojiSvg from "./AddEmojiSVG.svelte";
  import AddElementSvg from "./AddElementSVG.svelte";
  import { writable } from "svelte/store";

  let currentChannel = "";
  let currentServer = "";
  let url = "";
  let content = "";
  let mentions = [];
  let mentionsRoles = [];
  let showSuggestions = false;
  let typing = false;
  let userInputMention = "";
  const ignoredKeys = [
    "Delete",
    "Enter",
    "Meta",
    "Control",
    "Alt",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "Backspace",
    "Escape",
    "CapsLock",
    "Tab",
    "Shift",
  ];
  let currentSpan; // Create the initial span
  let currentLine;

  async function autoResize(ev: Event) {
    let target = ev.target as HTMLTextAreaElement;
    await tick();

    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
  }

  // Utility function to create a new span
  function createLine() {
    const div = document.createElement("div");
    div.className = "w-full h-7";
    const textarea = document.getElementById("textarea");
    textarea.appendChild(div);
    return div;
  }
  function createSpan(line: HTMLElement) {
    const span = document.createElement("span");
    span.className = "h-full min-w-[1px] inline-block";
    line.appendChild(span);
    return span;
  }

  function setCaretPosition(element) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  async function sendMessage(ev: KeyboardEvent) {
    const chat_input = document.getElementById(
      "textarea"
    ) as HTMLTextAreaElement;
    typing = true;
    ev.preventDefault();

    if (ev.key === "@") {
      currentSpan = createSpan(currentLine);
      currentSpan.innerText += "@";
      showSuggestions = true;
    } else if (showSuggestions && !ignoredKeys.includes(ev.key)) {
      userInputMention += ev.key;
      currentSpan.innerText += ev.key;
    } else if (ev.key === "Backspace" && showSuggestions) {
      if (userInputMention === "") {
        showSuggestions = false;
      } else {
        userInputMention = userInputMention.slice(0, -1);
        currentSpan.innerText = currentSpan.innerText.slice(0, -1);
      }
    } else if (ev.key === "Backspace") {
      if (currentSpan.innerText.length === 0) {
        let previousSpan = currentSpan.previousSibling;

        if (previousSpan) {
          currentLine.removeChild(currentSpan);
          currentSpan = previousSpan;
          previousSpan = currentSpan.previousSibling;
          if (previousSpan) {
            currentLine.removeChild(currentSpan);
            currentSpan = previousSpan;
          }
        } else {
          let previousLine = currentLine.previousSibling;
          if (previousLine) {
            chat_input.removeChild(currentLine);
            currentLine = previousLine;
            currentSpan =
              currentLine.childNodes[currentLine.childNodes.length - 1];
          }
        }
      } else {
        currentSpan.innerText = currentSpan.innerText.slice(0, -1);
      }
    } else if (ev.shiftKey && ev.key === "Enter") {
      currentLine = createLine();
      currentSpan = createSpan(currentLine);
    } else if (!ignoredKeys.includes(ev.key)) {
      currentSpan.innerText += ev.key;
    }

    console.log(chat_input.children[0].children[0].innerHTML === "");
    if (chat_input.children[0].children[0].innerHTML === "") {
      typing = false;
    }

    setCaretPosition(chat_input);
    if (ev.key === "Enter" && showSuggestions && !ev.shiftKey) {
      let validMention = $curr_server_users_store.find(
        (user) => user.displayName === userInputMention
      );
      if (validMention) {
        currentSpan.classList.add("bg-bulle-900/10");
        currentSpan = createSpan(currentLine);
        currentSpan.innerText += " ";
        userInputMention = "";
        showSuggestions = false;
        mentions.push(validMention.id);
        setCaretPosition(chat_input);
      }
    } else if (ev.key === "Enter" && !ev.shiftKey) {
      ev.preventDefault();

      const body = {
        content: content,
        sender: $user_store,
        mentions: mentions,
        mentionsRoles: mentionsRoles,
      };

      try {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(body),
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("Error on send message: ", response.statusText);
        }
      } catch (error) {
        console.error("Error on send message: ", error);
      }

      currentSpan = createSpan(currentLine);
      chat_input.style.height = "72px";
    }
    autoResize(ev);
  }

  $: if ($current_loc) {
    let locSplit = $current_loc.slice(1).split("/");
    currentChannel = locSplit.at(-1);
    if (locSplit[0] === "bulle") {
      currentServer = locSplit.at(-2);
      url = `${
        import.meta.env.VITE_API_URL
      }/api/new_message/${currentServer}/${currentChannel}`;
    } else {
      url = `${import.meta.env.VITE_API_URL}/api/new_dm/${currentChannel}`;
    }
  }

  function resizeChatInput(textarea, chatInput) {
    textarea.style.width = chatInput.clientWidth - 86 * 2 + "px";
  }

  function handlePaste(e: Event) {
    // prevent the paste event default behavior
    e.preventDefault();
    console.log(e);

    const textarea = document.getElementById("textarea");

    // get text representation of clipboard
    if (e.clipboardData || (e.originalEvent && e.originalEvent.clipboardData)) {
      content = (e.originalEvent || e).clipboardData.getData("text/plain");
    } else if (window.clipboardData) {
      content = window.clipboardData.getData("Text");
    }

    // get the current selection
    let selection = window.getSelection();

    // check if any selection exists (this may not be the case if your div is currently empty)
    if (selection.rangeCount > 0) {
      // create a new Range object
      let range = selection.getRangeAt(0);

      // delete the current selection (if any)
      range.deleteContents();

      // create a new TextNode with the pasted text
      let textNode = document.createTextNode(content);

      // insert the new node at the beginning of the Range
      range.insertNode(textNode);

      // create new range for placing the cursor
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // if no selection exists, simply append the text at the end
      textarea.appendChild(document.createTextNode(content));
    }

    // place cursor after inserted text
    autoResize(e);
  }

  onMount(() => {
    currentLine = createLine();
    currentSpan = createSpan(currentLine);
  });
</script>

<div
  id="chat-input-container"
  class="w-full flex flex-col absolute bottom-0 max-w-full border-t-1 bg-bullebg-100/10 backdrop-blur-xl border-bulle-900/10 transition-all"
>
  {#if showSuggestions}
    {#each $curr_server_users_store as user}
      {#if user.displayName.startsWith(userInputMention)}
        <div>{user.displayName}</div>
      {/if}
    {/each}
  {/if}
  <div class="flex w-full">
    <button
      class="flex-shrink-0 chat-input-buttons select-none flex items-center justify-center h-[72px] w-[72px] hover:cursor-pointer transition-colors"
      ><AddElementSvg /></button
    >
    <form action="#" class="flex-grow relative">
      <span
        class="font-normal absolute inset-0 z-[2] flex items-center text-lg px-[1.05rem] text-bulle-700 pointer-events-none select-none"
        style={typing ? "visibility: hidden;" : "visible"}
      >
        Send a message...
      </span>
      <div
        on:keydown={sendMessage}
        on:paste={handlePaste}
        class="transition-colors resize-none py-6 flex items-center leading-[28px] flex-col justify-center max-h-72 min-h-[72px] max-w-full w-full px-4 focus-visible:outline-none text-lg overflow-y-auto scrollbar-hide placeholder:text-bulle-700"
        contenteditable
        id="textarea"
        aria-label="Send a message in ..."
        aria-multiline="true"
        aria-placeholder="Send a message in ..."
        spellcheck="true"
        autocorrect="off"
        aria-invalid="false"
        role="textbox"
        tabindex="2"
      />
    </form>
    <button
      class="flex-shrink-0 chat-input-buttons select-none flex items-center justify-center h-[72px] w-[72px] hover:cursor-pointer transition-colors"
      ><AddEmojiSvg /></button
    >
  </div>
</div>

<style>
  #textarea {
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: break-word;
  }
</style>
