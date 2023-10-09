<script lang="ts">
  import ServerBox from "./ServerBox.svelte";
  import { useLocation } from "svelte-routing";
  import { onDestroy, onMount } from "svelte";
  import type { Unsubscriber } from "svelte/store";
  import { curr_server_store, current_loc } from "../utils/stores";
  import logo from "../assets/logo.svg";

  let loc = useLocation();
  let currentLoc: string;
  let unsubscribe: Unsubscriber;
  let servers = [];
  let serversLen = 0;
  let currentServerId: string;

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

      servers = data;
      serversLen = servers.length;
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  async function createServer() {
    const body = {
      banner: "bannerurl",
      description: "cool server",
      name: "Bogoss",
      status: "private",
    };

    try {
      const response = await fetch("http://localhost:3000/api/create_server", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (!response.ok) {
        console.error(response.statusText);
      }

      servers = data;
      serversLen = servers.length;
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  onMount(() => {
    unsubscribe = loc.subscribe((val) => {
      currentLoc = val.pathname.slice(1);
      let currentLocSplit = currentLoc.split("/");
      currentServerId = currentLocSplit.at(-2);
      current_loc.set(val.pathname);

      if (currentLocSplit[0] === "bulle") {
        if (serversLen > 0) {
          const currServer = servers.find(
            (server) => server.server_id === currentServerId
          );

          console.log($curr_server_store);
          curr_server_store.update((val) => {
            return currServer;
          });
        }
      }
    });

    fetchServersOfUsers().then((servers) => {
      currentServerId = localStorage.getItem("last_server");

      const currServer = servers.find(
        (server) => server.server_id === currentServerId
      );

      curr_server_store.update((val) => {
        return currServer;
      });
    });
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<div class="h-full width-bar flex-shrink-0">
  <h1 class="flex items-center gap-3 text-4xl py-5 px-8 font-bold">
    <img src={logo} alt="" />Bulles
  </h1>
  <section>
    <div class="px-8 flex flex-col gap-3">
      {#each servers as server}
        <ServerBox
          server_id={server.server_id}
          server_title={server.name}
          server_description={server.description}
        />
      {/each}
      <button
        class="self-center w-24 h-10 text-2xl cursor-pointer hover:border-bulle-900/40 hover:bg-bulle-900/20 transition-colors rounded-lg border-1 border-bulle-900/10 bg-bulle-900/10 flex justify-center items-center active:bg-bulle-900/25"
        on:click={createServer}
      >
        +
      </button>
    </div>
  </section>
</div>

<style>
  .width-bar {
    width: max(289px, min(18vw, 350px));
  }
</style>
