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
  } from "../utils/stores";
  import logo from "../assets/Lunary.svg";
  import Modal from "./Modal.svelte";
  import CreateServer from "./CreateServer.svelte";

  let loc = useLocation();
  let currentLoc: string;
  let unsubscribe: Unsubscriber;
  let servers = [];
  let serversLen = 0;
  let currentServerId: string;
  let modal: HTMLDialogElement;

  async function fetchServersOfUsers() {
    try {
      const response = await fetch("http://localhost:3000/api/user/servers", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (!response.ok) {
        console.error(response.statusText);
      }

      server_list.set(data);
      if ($server_list) {
        serversLen = $server_list.length;
      }
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  function openModal() {
    modal.showModal();
  }

  onMount(() => {
    modal = document.getElementById("modal-server") as HTMLDialogElement;

    unsubscribe = loc.subscribe((val) => {
      if ($current_loc === "/bulle/" || $current_loc === "/bulle") {
      } else {
        currentLoc = val.pathname.slice(1);
        let currentLocSplit = currentLoc.split("/");
        currentServerId = currentLocSplit.at(-2);
        current_loc.set(val.pathname);

        if (currentLocSplit[0] === "bulle") {
          if (serversLen > 0) {
            const currServer = $server_list.find(
              (server) => server.serverId === currentServerId
            );

            curr_server_store.update(() => {
              return currServer;
            });
          }
        }
      }
    });

    fetchServersOfUsers().then((servers) => {
      currentServerId = localStorage.getItem("last_server");

      if (servers) {
        const currServer = servers.find(
          (server) => server.serverId === currentServerId
        );
        curr_server_store.update(() => {
          return currServer;
        });
      }
    });
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<div
  class="h-screen width-bar flex-shrink-0 select-none relative border-r-1 border-bulle-900/10 overflow-y-auto scrollbar-hide"
>
  <h1 class="flex items-center gap-3 py-5 px-8 fixed top-0 left-0">
    <img src={logo} alt="" />
    <div class="flex items-end gap-1">
      <p id="brand_name" class="text-4xl font-bold">Lunary</p>
      <span class="text-base text-bulle-500">/chats</span>
    </div>
  </h1>
  <section>
    <div class="px-8 pt-20 pb-8 flex flex-col gap-3 overflow-y-auto">
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
      <button
        class="self-center w-24 h-10 text-2xl cursor-pointer hover:border-bulle-900/40 hover:bg-bulle-900/20 transition-colors rounded-lg border-1 border-bulle-900/10 bg-bulle-900/10 flex justify-center items-center active:bg-bulle-900/25"
        on:click={openModal}
      >
        +
      </button>
    </div>
  </section>
  <Modal component={CreateServer} nameModal="server" />
</div>

<style>
  .width-bar {
    width: 300px;
  }

  #brand_name {
    background: linear-gradient(
      180deg,
      #8593a6 42.29%,
      rgba(87, 96, 108, 0.76) 66.46%,
      rgba(13, 14, 16, 0) 108.75%
    );
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
</style>
