<script lang="ts">
  import { onMount, tick } from "svelte";
  import { user_store, current_loc } from "../utils/stores";
  import upload from "../assets/upload.svg";
  import emoji from "../assets/emoji.svg";

  let currentChannel = "";
  let currentServer = "";
  let content = "";

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
        const response = await fetch(
          `http://localhost:3000/api/new_message/${currentServer}/${currentChannel}`,
          {
            method: "POST",
            body: JSON.stringify(body),
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error("Error on send message: ", response.statusText);
        }
      } catch (error) {
        console.error("Error on send message: ", error);
      }

      content = "";
      chat_input.style.height = "62px";
    }
  }

  $: if ($current_loc) {
    let locSplit = $current_loc.split("/");
    currentChannel = locSplit.at(-1);
    currentServer = locSplit.at(-2);
  }

  function resizeChatInput(textarea, chatInput) {
    textarea.style.width = chatInput.clientWidth - 70 * 2 + "px";
  }

  onMount(() => {
    const textarea = document.getElementById("textarea");
    const chat_input_container = document.getElementById(
      "chat-input-container"
    );

    textarea.style.width = chat_input_container.clientWidth - 70 * 2 + "px";
    console.log(chat_input_container.clientWidth);

    window.onresize = () => resizeChatInput(textarea, chat_input_container);
  });
</script>

<div
  id="chat-input-container"
  class="w-full flex absolute bottom-2 gap-2 max-w-full"
>
  <span
    class="flex items-center justify-center bg-bulle-900/10 h-[62px] w-[62px] rounded-lg border-bulle-900/10 border-1 backdrop-blur-xl hover:bg-bulle-900/20 hover:border-bulle-900/40 hover:cursor-pointer transition-colors"
    ><img src={upload} alt="" /></span
  >
  <form action="#" class="flex-grow relative">
    <span
      class="absolute inset-0 z-[2] flex items-center text-lg px-[1.55rem] text-bulle-700 pointer-events-none select-none"
      style={content !== "" ? "visibility: hidden;" : "visible"}
    >
      Send a message...
    </span>
    <div
      on:input={autoResize}
      on:keydown={sendMessage}
      class="focus-visible:border-bulle-900/40 transition-colors resize-none rounded-lg max-h-72 py-4 min-h-[62px] max-w-full w-full h-14 border-1 border-bulle-900/10 px-6 backdrop-blur-xl bg-bulle-900/10 focus-visible:outline-none text-lg overflow-y-auto scrollbar-hide placeholder:text-bulle-700"
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
      tabindex="0"
    />
  </form>
  <span
    class="flex items-center justify-center bg-bulle-900/10 h-[62px] w-[62px] rounded-lg border-bulle-900/10 border-1 hover:bg-bulle-900/20 hover:border-bulle-900/40 hover:cursor-pointer transition-colors"
    ><img src={emoji} alt="" /></span
  >
</div>

<style>
  #textarea {
    white-space: pre-wrap;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }
</style>
