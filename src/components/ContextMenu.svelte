<script lang="ts">
  import { onMount } from "svelte";
  import {
    context_menu,
    curr_server_store,
    server_list,
    last_visited_channel_store,
    context_menu_states,
    current_loc,
    channel_list,
    user_store,
  } from "../utils/stores";
  import { navigate } from "svelte-routing";

  let serverIdDeleted = "";
  let channelIdDeleted = "";
  let messageContext: boolean;

  $: {
    if ($context_menu.type) {
      if ($context_menu.type.includes("message")) {
        messageContext = $context_menu.type.includes("message");
      } else {
        messageContext = false;
      }
    }
  }

  async function joinServer() {
    const body = {
      invitation_id: "Hellen",
      user: $user_store,
    };

    try {
      const response = await fetch("https://127.0.0.1/api/join_server", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      return true;
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteServerPOST() {
    serverIdDeleted = $context_menu_states.server_id;
    console.log($context_menu_states);

    const body = {
      server_id: $context_menu_states.server_id,
    };

    try {
      const response = await fetch("https://127.0.0.1/api/delete_server", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      return true;
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteServer() {
    const response = await deleteServerPOST();

    if (response) {
      if ($curr_server_store.serverId === serverIdDeleted) {
        const firstServer = $server_list[0].serverId;
        navigate(
          `/bulle/${firstServer}/${$last_visited_channel_store[firstServer]}`
        );
      }
    }
  }

  async function leaveServerPOST() {
    serverIdDeleted = $context_menu_states.server_id;

    const body = {
      server_id: $context_menu_states.server_id,
    };

    try {
      const response = await fetch("https://127.0.0.1/api/leave_server", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      return true;
    } catch (error) {
      console.error(error);
    }
  }

  async function leaveServer() {
    const response = await leaveServerPOST();

    if (response) {
      if ($curr_server_store.serverId === serverIdDeleted) {
        const firstServer = $server_list[0].serverId;
        navigate(
          `/bulle/${firstServer}/${$last_visited_channel_store[firstServer]}`
        );
      }
    }
  }

  async function deleteChannelPOST() {
    channelIdDeleted = $context_menu_states.channel_id;

    const body = {
      server_id: $context_menu_states.server_id,
      channel_id: $context_menu_states.channel_id,
      category: $context_menu_states.category,
    };

    try {
      const response = await fetch("https://127.0.0.1/api/delete_channel", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      return true;
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteChannel() {
    const response = await deleteChannelPOST();

    if (response) {
      if ($current_loc.split("/").at(-1) === channelIdDeleted) {
        const firstChannel = $channel_list[0].channels[0].channelId;
        navigate(`/bulle/${$curr_server_store.serverId}/${firstChannel}`);
      }
    }
  }

  function editMessage() {}

  function addCategory() {
    console.log($context_menu_states);
  }

  function openModal(modalName: string) {
    const modal = document.getElementById(
      `modal-${modalName}`
    ) as HTMLDialogElement;
    modal.showModal();
  }
</script>

<div
  id="contextmenu"
  class="z-50 absolute hidden w-44 px-2 py-2 h-auto bg-bullebg-100/10 backdrop-blur-md rounded-lg border-bulle-900/10 border-1"
>
  {#if $context_menu.type === "channels" && $context_menu_states.is_owner}
    <div id="server-context" class="flex flex-col gap-1">
      <button
        on:click={() => openModal("category")}
        class="text-base font-medium text-bulle-900 transition-colors hover:bg-bulle-700 hover:text-alerttext w-full rounded-md text-left pl-3 py-1"
        >Create Category</button
      >
      <button
        on:click={() => openModal("channel")}
        class="text-base font-medium text-bulle-900 transition-colors hover:bg-bulle-700 hover:text-alerttext w-full rounded-md text-left pl-3 py-1"
        >Create Channel</button
      >
    </div>
  {:else if $context_menu.type === "category" && $context_menu_states.is_owner}
    <div id="server-context" class="flex flex-col gap-1">
      <button
        on:click={() => openModal("channel")}
        class="text-base font-medium text-bulle-900 transition-colors hover:bg-bulle-700 hover:text-alerttext w-full rounded-md text-left pl-3 py-1"
        >Create Channel</button
      >
      <button
        class="text-base font-medium text-alert hover:bg-alert transition-colors hover:text-alerttext w-full rounded-md text-left pl-3 py-1"
        >Delete Category</button
      >
    </div>
  {:else if $context_menu.type === "channel"}
    <div id="server-context" class="flex flex-col gap-1">
      <button
        on:click={addCategory}
        class="text-base font-medium text-bulle-900 transition-colors hover:bg-bulle-700 hover:text-alerttext w-full rounded-md text-left pl-3 py-1"
        >Channel Settings</button
      >
      {#if $context_menu_states.is_owner}
        <button
          class="text-base font-medium text-alert hover:bg-alert transition-colors hover:text-alerttext w-full rounded-md text-left pl-3 py-1"
          on:click={deleteChannel}>Delete Channel</button
        >
      {/if}
    </div>
  {:else if messageContext}
    <div id="server-context" class="flex flex-col gap-1">
      <button
        on:click={editMessage}
        class="text-base font-medium text-bulle-900 transition-colors hover:bg-bulle-700 hover:text-alerttext w-full rounded-md text-left pl-3 py-1"
        >Copy Text</button
      >
      {#if $context_menu_states.is_owner}
        <button
          on:click={editMessage}
          class="text-base font-medium text-bulle-900 transition-colors hover:bg-bulle-700 hover:text-alerttext w-full rounded-md text-left pl-3 py-1"
          >Edit Message</button
        >
        <button
          class="text-base font-medium text-alert hover:bg-alert transition-colors hover:text-alerttext w-full rounded-md text-left pl-3 py-1"
          >Delete Message</button
        >
      {/if}
    </div>
  {:else if $context_menu.type === "server-owner" || $context_menu.type === "server-user"}
    <div id="server-context" class="flex flex-col gap-1">
      <button
        class="text-base font-medium text-bulle-900 transition-colors hover:bg-bulle-700 hover:text-alerttext w-full rounded-md text-left pl-3 py-1"
        >Server Settings</button
      >
      <button
        on:click={joinServer}
        class="text-base font-medium text-bulle-900 transition-colors hover:bg-bulle-700 hover:text-alerttext w-full rounded-md text-left pl-3 py-1"
        >Join Server</button
      >
      <button
        on:click={$context_menu.type === "server-owner"
          ? deleteServer
          : leaveServer}
        class="text-base font-medium text-alert hover:bg-alert transition-colors hover:text-alerttext w-full rounded-md text-left pl-3 py-1"
        >{$context_menu.type === "server-owner"
          ? "Delete server"
          : "Leave server"}</button
      >
    </div>
  {/if}
</div>
