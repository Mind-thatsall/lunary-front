<script lang="ts">
  import SectionHeader from "./SectionHeader.svelte";
  import { link } from "svelte-routing";
  import { current_loc, curr_server_store } from "../utils/stores";
  import server_image from "../assets/server_icon_test.png";
  import { user_store } from "../utils/stores";

  let currentLocation: string[];

  let server_id: string;
  let channels = [];

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

      console.log(data);
      channels = data;
    } catch (error) {
      console.error(error);
    }
  }
  $: if ($current_loc) {
    currentLocation = $current_loc.slice(1).split("/");

    if (currentLocation[0] === "bulle") {
      if (server_id !== currentLocation[1]) {
        localStorage.setItem("last_server", currentLocation[1]);
        server_id = currentLocation[1];

        fetchServerInformations();
      }
    } else {
      server_id = localStorage.getItem("last_server");
    }
  }
</script>

<div
  class="width-bar flex-shrink-0 pt-4 pb-2 px-4 flex flex-col gap-4 relative"
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
    class="box-border border-[4px] w-full h-44 object-cover rounded-lg border-bulle-900/10"
  />
  <div class="flex flex-col justify-between h-full">
    <section>
      <SectionHeader header_title={$curr_server_store.name} />
      <div class="flex flex-col pt-4 pl-8">
        {#each channels as channel}
          <a
            href={`/bulle/${server_id}/${channel.channel_id}`}
            use:link
            class="text-lg leading-8">{channel.name}</a
          >
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
            {$user_store.username}
          </p>
          <p class="text-bulle-700">okzmo</p>
        </div>
      </div>
      <div>A E S</div>
    </div>
  </div>
</div>

<style>
  .width-bar {
    width: 300px;
  }
</style>
