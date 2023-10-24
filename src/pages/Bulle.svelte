<script lang="ts">
  import ChatInput from "../components/ChatInput.svelte";
  import ChatElement from "../components/ChatElement.svelte";
  import {
    messages_store,
    last_visited_channel_store,
    BACKEND_URL,
    user_store,
    server_list,
    channel_list,
    current_loc,
    socket,
  } from "../utils/stores";
  import { onDestroy, onMount } from "svelte";
  import { useLocation } from "svelte-routing";
  import type { Unsubscriber } from "svelte/store";
  import { afterUpdate } from "svelte";
  import {
    LeaveServer,
    updateServersState,
    fetchAllInformations,
  } from "../utils/fetch";
  import { checkKey } from "../utils/other";

  let loc = useLocation();
  let currentChannel: string;
  let currentServer: string;
  let unsubscribe: Unsubscriber;
  let container: HTMLElement;
  let hideInput = false;
  let Message;

  async function fetchMessagesOfChannel() {
    try {
      const response = await fetch(
        `${$BACKEND_URL}/api/messages/${currentChannel}`,
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

  afterUpdate(() => {
    if ($messages_store) {
      container.scrollTo(0, container.scrollHeight);
    }
  });

  async function loadproto() {
    const root = await protobuf.load("/src/protobuf/user_message.proto");
    Message = root.lookupType("messagepackage.ServerMessage");
  }

  onMount(async () => {
    //await fetchAllInformations();

    loadproto().catch((err) => console.log(err));
    let ws = new WebSocket(`wss://127.0.0.1/ws/connect`);

    ws.binaryType = "arraybuffer";

    ws.onopen = () => {
      const currentLoc = $current_loc.slice(1).split("/");
      let body = {};
      if (currentLoc[0].includes("bulle") && currentLoc[1]) {
        body = {
          type: "initial",
          pos: currentLoc[1],
        };
      } else {
        body = {
          type: "initial",
          pos: "me",
        };
      }
      ws.send(JSON.stringify(body));
      ws.onmessage = (message) => {
        const data = new Uint8Array(message.data);
        const decodedMessage = Message.decode(data);
        console.log(decodedMessage);

        switch (decodedMessage.type) {
          case "initial":
            user_store.set(decodedMessage.initialLoad.user);
            server_list.set(decodedMessage.initialLoad.servers);
            if (body.pos !== "me") {
              channel_list.set(decodedMessage.initialLoad.server.categories);
            }
            socket.set(ws);
          case "message":
            const currentLoc = $current_loc.slice(1).split("/");
            const currentChannel = currentLoc.at(-1);
            if (decodedMessage.userMessage.channelId === currentChannel) {
              messages_store.update((messages) => [
                ...messages,
                decodedMessage.userMessage,
              ]);
            }
            break;
          case "server_deletion":
            server_list.update((servers) =>
              servers.filter(
                (server) => server.serverId !== decodedMessage.serverDeletion.id
              )
            );
            break;
          case "user_leaving":
            server_list.update((servers) =>
              servers.filter(
                (server) => server.serverId !== decodedMessage.serverDeletion.id
              )
            );
            break;
          case "channel_creation":
            channel_list.update((categories) => {
              const category = categories.find(
                (category) =>
                  category.groupName === decodedMessage.newChannel.group
              );

              category.channels.push(decodedMessage.newChannel.channel);

              return categories;
            });
            break;
          case "server_join":
            server_list.update((servers) => [
              ...servers,
              decodedMessage.serverJoin.server,
            ]);
            break;
          case "channel_deletion":
            channel_list.update((categories) => {
              let category = categories.find(
                (category) =>
                  category.groupName === decodedMessage.channelDeletion.category
              );

              const filteredArr = category.channels.filter(
                (channel) =>
                  channel.channelId !== decodedMessage.channelDeletion.channelId
              );

              category.channels = filteredArr;

              return categories;
            });
            break;
          case "change_server":
            channel_list.set(decodedMessage.changeServer.server.categories);
            break;
        }
      };
    };

    setInterval(() => {
      updateServersState;
    }, 20000);

    unsubscribe = loc.subscribe((val) => {
      let locSplit = val.pathname.slice(1).split("/");

      if (locSplit[0] === "bulle") {
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
      } else if (locSplit[0] === "me") {
        if (locSplit[1]) {
          currentChannel = locSplit.at(-1);
          fetchMessagesOfChannel();
          hideInput = false;
        } else {
          hideInput = true;
        }
      }
    });
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
  {#if !hideInput}
    <ChatInput />
  {/if}
</main>
