<script>
  import { link } from "svelte-routing";
  import server_icon_test from "../assets/server_icon_test.png";
  import {
    last_visited_channel_store,
    curr_server_store,
  } from "../utils/stores";

  let isCurrentServer = false;
  export let server_id, server_title, server_description, server_logo;

  $: if ($curr_server_store) {
    isCurrentServer = $curr_server_store.server_id === server_id;
  }
</script>

<a
  href={`/bulle/${server_id}/${$last_visited_channel_store[server_id]}`}
  use:link
  class={`group flex items-center ${
    isCurrentServer
      ? "bg-bulle-900/10 border-bulle-900/10 hover:bg-bulle-900/10 hover:border-bulle-900/10"
      : "bg-bulle-900/0 border-bulle-900/0 hover:border-bulle-900/5 hover:bg-bulle-900/5"
  } border-1 transition-colors px-4 py-3 rounded-xl`}
>
  <img
    src={server_logo === "" ? server_icon_test : server_logo}
    alt={server_title + "'s logo"}
    class={`h-16 w-16 mr-5 flex-shrink-0 object-cover transition-all ${
      isCurrentServer ? "rounded-lg" : "rounded-2xl"
    } group-hover:rounded-lg`}
  />
  <div class="">
    <h3 class="font-semibold text-base">{server_title}</h3>
    <p class="text-bulle-700 leading-4 text-sm">{server_description}</p>
  </div>
</a>

<style>
</style>
