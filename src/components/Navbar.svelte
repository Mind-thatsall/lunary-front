<script lang="ts">
  import ServerBox from "./ServerBox.svelte";
  import { navigate, useLocation } from "svelte-routing";
  import { onDestroy, onMount } from "svelte";
  import type { Unsubscriber } from "svelte/store";
  import {
    server_list,
    curr_server_store,
    current_loc,
    user_store,
    BACKEND_URL,
  } from "../utils/stores";
  import Modal from "./Modal.svelte";
  import CreateServer from "./CreateServer.svelte";

  let loc = useLocation();
  let currentLoc: string;
  let unsubscribe: Unsubscriber;
  let serversLen = 0;
  let currentServerId: string;
  let modal: HTMLDialogElement;
  let navbar: HTMLElement;
  let contextMenu: HTMLElement;

  function openModal() {
    modal.showModal();
  }

  function showNavbar(ev: MouseEvent) {
    if (!contextMenu.classList.contains("hidden")) {
      if (document.querySelector("#navbar:hover") !== null) {
        navbar.classList.remove("hover:left-0");
        navbar.classList.remove("-left-[5.25rem]");
        navbar.classList.add("left-0");
      }
    } else {
      navbar.classList.remove("left-0");
      navbar.classList.add("hover:left-0");
      if (ev.clientX < 325) {
        navbar.classList.remove("-left-[10%]");
        navbar.classList.add("-left-[5.25rem]");
      } else {
        navbar.classList.remove("-left-[5.25rem]");
        navbar.classList.add("-left-[10%]");
      }
    }
  }

  $: if ($current_loc) {
    currentLoc = $current_loc.slice(1);
    let currentLocSplit = currentLoc.split("/");
    currentServerId = currentLocSplit.at(-2);

    if (currentLocSplit[0] === "bulle") {
      if ($server_list.length > 0) {
        const currServer = $server_list.find(
          (server) => server.serverId === currentServerId
        );

        curr_server_store.update(() => {
          return currServer;
        });
      }
    }
  }

  onMount(() => {
    modal = document.getElementById("modal-server") as HTMLDialogElement;

    contextMenu = document.getElementById("contextmenu");
    navbar = document.getElementById("navbar");
    document.addEventListener("mousemove", showNavbar);
  });
</script>

<div
  id="navbar"
  class={`${
    document.querySelector("#navbar:hover") !== null ? "" : "hover:left-0"
  }  -left-[10%] absolute w-[6rem] pl-3 rounded-[1.25rem] top-1/2 -translate-y-1/2 z-10 h-[45.3125rem] flex-shrink-0 select-none overflow-y-auto scrollbar-hide`}
>
  <nav
    class="w-full py-2 px-2 rounded-[1.25rem] bg-bulle-900/10 z-10 h-full backdrop-blur-2xl flex-shrink-0 select-none border-1 border-bulle-900/10 overflow-y-auto scrollbar-hide"
  >
    <section>
      <div class="pb-8 flex items-center flex-col gap-3 overflow-y-auto">
        {#if $server_list}
          {#each $server_list as server}
            <ServerBox
              server_id={server.serverId}
              server_title={server.name}
              server_description={server.description}
              server_logo={server.banner}
              server_owner={server.owner === $user_store.id}
            />
          {/each}
        {:else}
          <p>nothin</p>
        {/if}
        <hr class="bg-bulle-900 opacity-10 rounded-lg w-full" />
        <button
          class="self-center h-16 w-16 text-2xl cursor-pointer hover:border-bulle-900/40 hover:bg-bulle-900/20 transition-colors rounded-2xl border-1 border-bulle-900/10 bg-bulle-900/10 flex justify-center items-center active:bg-bulle-900/25"
          on:click={openModal}
        >
          +
        </button>
      </div>
    </section>
    <Modal component={CreateServer} nameModal="server" />
  </nav>
</div>

<style>
  #navbar {
    transition: left 0.25s ease-in-out;
  }
</style>
