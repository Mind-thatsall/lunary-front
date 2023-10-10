<script lang="ts">
  import ChatInput from "../components/ChatInput.svelte";
  import ChatElement from "../components/ChatElement.svelte";
  import {
    messages_store,
    socket,
    last_visited_channel_store,
  } from "../utils/stores";
  import { onDestroy, onMount } from "svelte";
  import { useLocation } from "svelte-routing";
  import type { Unsubscriber } from "svelte/store";
  import { afterUpdate } from "svelte";

  let Message;
  let loc = useLocation();
  let currentChannel: string;
  let currentServer: string;
  let unsubscribe: Unsubscriber;
  let container: HTMLElement;

  async function loadproto() {
    const root = await protobuf.load("/src/protobuf/user_message.proto");
    Message = root.lookupType("messagepackage.UserMessage");
  }

  async function fetchMessagesOfChannel() {
    try {
      const response = await fetch(
        `http://localhost:3000/api/messages/${currentChannel}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();

      if (!response.ok) {
        console.error(response.statusText);
      }

      console.log(data);
      if (data !== null) {
        messages_store.set(data);
      } else {
        messages_store.set([]);
      }
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  $: {
    if ($socket) {
      $socket.onmessage = (message) => {
        const data = new Uint8Array(message.data);
        const decodedMessage = Message.decode(data);
        console.log(decodedMessage);

        if (decodedMessage.channelid === currentChannel) {
          messages_store.update((messages) => [...messages, decodedMessage]);
        }
      };
    }
  }

  afterUpdate(() => {
    if ($messages_store) {
      container.scrollTo(0, container.scrollHeight);
    }
  });

  onMount(() => {
    unsubscribe = loc.subscribe((val) => {
      let locSplit = val.pathname.split("/");

      if (currentServer !== locSplit.at(-2)) {
        currentServer = locSplit.at(-2);
      }

      if (currentChannel !== locSplit.at(-1)) {
        currentChannel = locSplit.at(-1);
        fetchMessagesOfChannel();
      }

      last_visited_channel_store.update((state) => ({
        ...state,
        [currentServer]: currentChannel,
      }));
    });

    loadproto().catch((err) => console.log(err));
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<main
  id="message_parent_container"
  class="relative flex-grow h-screen scrollbar-hide"
>
  <div class="flex-grow flex flex-col justify-end overflow-hidden h-full">
    <div
      bind:this={container}
      id="message_box"
      class="overflow-y-scroll py-14 scrollbar-hide"
    >
      {#if $messages_store}
        {#each $messages_store as message}
          <ChatElement role="Admin" {message} />
        {/each}
      {:else}
        <p>No messages in this channel yet</p>
      {/if}
    </div>
  </div>
  <ChatInput />
</main>
