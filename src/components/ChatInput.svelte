<script lang="ts">
  import { onMount, tick } from "svelte";
  import { user_store, current_loc } from "../utils/stores";
  import AddEmojiSvg from "./AddEmojiSVG.svelte";
  import AddElementSvg from "./AddElementSVG.svelte";

  let currentChannel = "";
  let currentServer = "";
  let url = "";
  let URL_BASE = "https://127.0.0.1/api/";
  let content = "";
  let sendToFriend = false;

  async function autoResize(ev: Event) {
    let target = ev.target as HTMLTextAreaElement;
    await tick();

    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
  }

  async function sendMessage(ev: KeyboardEvent) {
    const chat_input = document.getElementById(
      "textarea"
    ) as HTMLTextAreaElement;

    if (ev.key === "Enter" && !ev.shiftKey) {
      ev.preventDefault();
      const body = {
        content: content,
        sender: $user_store,
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

      content = "";
      chat_input.style.height = "72px";
    }
  }

  $: if ($current_loc) {
    let locSplit = $current_loc.slice(1).split("/");
    currentChannel = locSplit.at(-1);
    if (locSplit[0] === "bulle") {
      currentServer = locSplit.at(-2);
      url = URL_BASE + `new_message/${currentServer}/${currentChannel}`;
    } else {
      url = URL_BASE + `new_dm/${currentChannel}`;
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
    const textarea = document.getElementById("textarea");
    const chat_input_container = document.getElementById(
      "chat-input-container"
    );
  });
</script>

<div
  id="chat-input-container"
  class="w-full flex absolute bottom-0 max-w-full border-t-1 bg-bullebg-100/10 backdrop-blur-xl border-bulle-900/10"
>
  <button
    class="flex-shrink-0 chat-input-buttons select-none flex items-center justify-center h-[72px] w-[72px] hover:cursor-pointer transition-colors"
    ><AddElementSvg /></button
  >
  <form action="#" class="flex-grow relative">
    <span
      class="font-normal absolute inset-0 z-[2] flex items-center text-lg px-[1.05rem] text-bulle-700 pointer-events-none select-none"
      style={content !== "" ? "visibility: hidden;" : "visible"}
    >
      Send a message...
    </span>
    <div
      on:input={autoResize}
      on:keydown={sendMessage}
      on:paste={handlePaste}
      class="transition-colors resize-none max-h-72 py-5 min-h-[72px] max-w-full w-full h-14 px-4 focus-visible:outline-none text-lg overflow-y-auto scrollbar-hide placeholder:text-bulle-700"
      contenteditable
      id="textarea"
      aria-label="Send a message in ..."
      aria-multiline="true"
      aria-placeholder="Send a message in ..."
      bind:textContent={content}
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

<style>
  #textarea {
    white-space: pre-wrap;
    word-break: break-word;
    overflow-wrap: break-word;
  }
</style>
