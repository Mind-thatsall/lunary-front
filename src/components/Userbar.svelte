<script lang="ts">
  import {
    current_loc,
    curr_server_store,
    channel_list,
    server_list,
    BACKEND_URL,
  } from "../utils/stores";
  import { user_store } from "../utils/stores";
  import Modal from "./Modal.svelte";
  import CreateChannel from "./CreateChannel.svelte";
  import CreateCategory from "./CreateCategory.svelte";
  import ServerMenu from "./ServerMenu.svelte";

  let server_id: string;
  let modal: HTMLDialogElement;
</script>

<div
  class="px-4 width-bar flex-shrink-0 pt-4 flex flex-col gap-4 relative select-none border-r-1 border-bulle-900/10"
>
  <input
    class="text-sm w-full py-3 px-5 rounded-lg bg-bulle-900/10 border-1 border-bulle-900/10 focus-visible:outline-none focus-visible:border-bulle-900/40 focus-visible:bg-bulle-900/20 transition-colors"
    type="text"
    placeholder="Search"
  />
  {#if $current_loc.slice(1).split("/")[0] === "bulle"}
    <ServerMenu />
  {:else}
    nothing
  {/if}
  <div
    class="align-bottom absolute border-t-1 border-bulle-900/10 w-full h-[4.5626rem] bottom-0 left-0"
  >
    <div
      class="px-4 absolute w-full flex items-center justify-between h-[4.5626rem] left-0 bottom-0"
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
