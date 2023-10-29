<script lang="ts">
  import { current_loc, instant_notif } from "../../utils/stores";
  import { user_store } from "../../utils/stores";
  import Modal from "../Modal.svelte";
  import CreateChannel from "../ContextMenu/CreateChannel.svelte";
  import CreateCategory from "../ContextMenu/CreateCategory.svelte";
  import ServerMenu from "./ServerMenu.svelte";
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
    id="notification-box"
    class="align-bottom absolute border-t-1 border-bulle-900/10 w-full h-[4.5626rem] bottom-0 left-0 overflow-hidden"
  >
    <div
      id="notification-message"
      class="w-full absolute h-[5rem] bottom-[5.15rem] flex flex-col justify-between items-center"
    >
      <p class="h-full w-full flex justify-center items-center">
        New message from {$instant_notif.displayName}
      </p>
      <div class="relative w-full">
        <p
          class="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bullebg-100 px-4"
        >
          NOTIFICATION
        </p>
        <hr class="mx-4 self-start" />
      </div>
    </div>
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

  #notification-box {
    transition: height 0.45s ease-in-out;
  }
  #notification-message {
    transition: opacity 0.45s ease-in-out;
  }
</style>
