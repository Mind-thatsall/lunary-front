<script lang="ts">
  import SectionHeader from "./SectionHeader.svelte";
  import {
    current_loc,
    curr_server_store,
    channel_list,
    server_list,
  } from "../utils/stores";
  import server_image from "../assets/server_icon_test.png";
  import { user_store } from "../utils/stores";
  import Channel from "./Channel.svelte";
  import { openingMenu } from "../utils/contextmenu";
  import Modal from "./Modal.svelte";
  import CreateChannel from "./CreateChannel.svelte";
  import CreateCategory from "./CreateCategory.svelte";

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
        `http://localhost:3000/api/channels/${server_id}`,
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
      console.log($channel_list);
      console.log($server_list);
    } catch (error) {
      console.error(error);
    }
  }
  $: if ($current_loc) {
    currentLocation = $current_loc.slice(1).split("/");

    if (currentLocation[0] === "bulle") {
      isOwner = $curr_server_store.owner === $user_store.id;

      if (server_id !== currentLocation[1] && currentLocation[1] !== "") {
        localStorage.setItem("last_server", currentLocation[1]);
        server_id = currentLocation[1];
        fetchServerInformations();
      }

      if (currentLocation[2] !== "" && currentLocation[2]) {
        current_channel_id = currentLocation.at(-1);
      } else {
        window.history.back();
      }
    } else {
      server_id = localStorage.getItem("last_server");
      fetchServerInformations();
    }
  }
</script>

<div
  class="width-bar flex-shrink-0 pt-4 pb-2 px-4 flex flex-col gap-4 relative select-none border-l-1 border-bulle-900/10"
>
  <input
    class="text-sm w-full py-3 px-5 rounded-lg bg-bulle-900/10 border-1 border-bulle-900/10 focus-visible:outline-none focus-visible:border-bulle-900/40 focus-visible:bg-bulle-900/20 transition-colors"
    type="text"
    placeholder="Search"
  />
  <img
    src={$curr_server_store.banner === ""
      ? server_image
      : $curr_server_store.banner}
    alt=""
    id="server_image"
    class="box-border border-[4px] w-full h-44 flex-shrink-0 object-cover rounded-lg border-bulle-900/10"
  />
  <div
    class="flex flex-col justify-between h-full"
    on:contextmenu={(e) =>
      openingMenu(e, {
        type: "channels",
        category: Object.keys($channel_list)[0],
        is_owner: isOwner,
      })}
    role="table"
  >
    <section>
      <SectionHeader header_title={$curr_server_store.name} />
      <div class="flex flex-col pt-2">
        {#each Object.keys($channel_list) as channelGroup}
          <input
            type="checkbox"
            id={`section-${channelGroup}`}
            class="hidden"
            on:change={dropdown}
            name={channelGroup}
          />
          <label
            id={`section-${channelGroup}`}
            for={`section-${channelGroup}`}
            on:contextmenu={(e) =>
              openingMenu(e, {
                type: "category",
                category: channelGroup,
                is_owner: isOwner,
              })}
            class="cursor-pointer text-bulle-700 pl-1 hover:text-bulle-900 transition-colors"
            >{channelGroup}</label
          >
          {#if $channel_list[channelGroup].channels}
            {#each $channel_list[channelGroup].channels as channel}
              <Channel
                channel_id={channel.channelId}
                channel_name={channel.name}
                {current_channel_id}
                {server_id}
                section_name={channelGroup}
                {isOwner}
              />
            {/each}
          {/if}
        {/each}
      </div>
    </section>
    <div
      class="flex items-center pl-2 pr-6 justify-between w-full h-[62px] bg-bulle-900/10 border-1 border-bulle-900/10 rounded-lg bottom-2 left-0"
    >
      <div
        class="flex gap-4 items-center hover:cursor-pointer hover:bg-bulle-900/10 border-1 border-bulle-900/0 hover:border-bulle-900/10 rounded-md pr-4 transition-colors"
      >
        <img src={$user_store.avatar} alt="" class="w-12 h-12 rounded-md" />
        <div class="leading-tight">
          <p>
            {$user_store.displayName}
          </p>
          <p class="text-bulle-700">{$user_store.username}</p>
        </div>
      </div>
      <div>A E S</div>
    </div>
  </div>
  <Modal component={CreateChannel} nameModal="channel" />
  <Modal component={CreateCategory} nameModal="category" />
</div>

<style>
  .width-bar {
    width: 300px;
  }
</style>
