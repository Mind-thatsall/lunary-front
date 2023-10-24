<script lang="ts">
  import {
    curr_server_store,
    channel_list,
    BACKEND_URL,
    current_loc,
    server_list,
    user_store,
    socket,
  } from "../utils/stores";
  import { openingMenu } from "../utils/contextmenu";
  import Channel from "./Channel.svelte";
  import SectionHeader from "./SectionHeader.svelte";

  let currentLocation: string[];

  let server_id: string;
  let current_channel_id = "";
  let modal: HTMLDialogElement;
  let isOwner = false;

  function dropdown(ev: Event) {
    let target = ev.currentTarget as HTMLInputElement;
    const channelsOfSection = document.getElementsByClassName(
      `channel-${target.name}`
    );
    for (let i = 0; i < channelsOfSection.length; i++) {
      channelsOfSection[i].classList.toggle("hidden");
    }
  }

  async function fetchServerInformations() {
    try {
      const response = await fetch(
        `${$BACKEND_URL}/api/channels/${server_id}`,
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

      channel_list.set(data);
    } catch (error) {
      console.error(error);
    }
  }

  $: if ($current_loc || $socket) {
    isOwner = $curr_server_store.owner === $user_store.id;
    currentLocation = $current_loc.slice(1).split("/");
    if (currentLocation[0] === "bulle") {
      if (server_id !== currentLocation[1] && currentLocation[1] !== "") {
        localStorage.setItem("last_server", currentLocation[1]);
        server_id = currentLocation[1];
        //fetchServerInformations();
        if ($socket) {
          const body = {
            type: "change_server",
            server_id: server_id,
          };
          $socket.send(JSON.stringify(body));
        }
      }

      if (currentLocation[2] !== "" && currentLocation[2]) {
        current_channel_id = currentLocation.at(-1);
      } else {
        window.history.back();
      }
    } else {
      server_id = localStorage.getItem("last_server");
      //fetchServerInformations();
    }
  }
</script>

<img
  src={$curr_server_store.banner}
  alt=""
  id="server_image"
  class="box-border border-[4px] w-full h-44 flex-shrink-0 object-cover rounded-lg border-bulle-900/10"
/>
<div
  class="flex flex-col justify-between h-full"
  on:contextmenu={(e) =>
    openingMenu(e, {
      type: "channels",
      is_owner: isOwner,
    })}
  role="table"
>
  <section>
    <SectionHeader header_title={$curr_server_store.name} />
    <div class="flex flex-col pt-2">
      {#each $channel_list as categories}
        <input
          type="checkbox"
          id={`section-${categories.groupName}`}
          class="hidden"
          on:change={dropdown}
          name={categories.groupName}
        />
        <label
          id={`section-${categories.groupName}`}
          for={`section-${categories.groupName}`}
          on:contextmenu={(e) =>
            openingMenu(e, {
              type: "category",
              category: categories.groupName,
              is_owner: isOwner,
            })}
          class="cursor-pointer text-bulle-700 pl-1 hover:text-bulle-900 transition-colors"
          >{categories.groupName}</label
        >
        {#if categories.channels}
          {#each categories.channels as channel}
            <Channel
              channel_id={channel.channelId}
              channel_name={channel.name}
              {current_channel_id}
              {server_id}
              section_name={categories.groupName}
              {isOwner}
            />
          {/each}
        {/if}
      {/each}
    </div>
  </section>
</div>
