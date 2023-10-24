<script>
  import { link } from "svelte-routing";
  import server_icon_test from "../assets/server_icon_test.png";
  import { openingMenu } from "../utils/contextmenu";
  import {
    last_visited_channel_store,
    curr_server_store,
  } from "../utils/stores";

  let isCurrentServer = false;
  export let server_id,
    server_title,
    server_description,
    server_logo,
    server_owner;

  let context = {
    type: server_owner ? "server-owner" : "server-user",
    server_id: server_id,
  };

  $: if ($curr_server_store) {
    isCurrentServer = $curr_server_store.serverId === server_id;
  }
</script>

<a
  href={`/bulle/${server_id}/${$last_visited_channel_store[server_id]}`}
  tabindex="0"
  use:link
  on:contextmenu={(e) => openingMenu(e, context)}
  class={`group flex items-center transition-colors focus-visible:outline-none`}
  data-context-element="server"
>
  <img
    src={server_logo === "" ? server_icon_test : server_logo}
    alt={server_title + "'s logo"}
    class={`h-16 w-16 flex-shrink-0 object-cover transition-all ${
      isCurrentServer
        ? "border-bulle-900/40 group-hover:border-bulle-900/50 focus-visible:border-bulle-900/50 rounded-[0.625rem]"
        : "border-bulle-900/0 group-hover:border-bulle-900/20 focus-visible:border-bulle-900/20 rounded-3xl"
    } group-hover:rounded-[0.625rem] border-2 pointer-events-none`}
  />
</a>
