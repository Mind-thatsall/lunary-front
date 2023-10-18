<script lang="ts">
  import { onMount } from "svelte";
  import {
    channel_list,
    curr_server_store,
    context_menu,
    context_menu_states,
  } from "../utils/stores";

  let modal: HTMLDialogElement;
  let selectedRadioButton = "textual";

  async function createChannel(ev: Event) {
    ev.preventDefault();
    console.log("create ! ");

    const form = new FormData(
      document.getElementById("channel-form") as HTMLFormElement
    );

    console.log($channel_list[$context_menu_states.category]);
    const body = {
      category: $context_menu_states.category,
      channel: {
        serverId: $curr_server_store.serverId,
        group: $channel_list[$context_menu_states.category].groupId,
        name: form.get("channel_name"),
        status: "public",
        type: form.get("channel_type"),
      },
    };

    try {
      const response = await fetch("http://localhost:3000/api/create_channel", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error(response.statusText);
      }
    } catch (error) {
      console.error(error);
    } finally {
      closeModal();
    }
  }

  function closeModal() {
    modal.close();
  }

  onMount(() => {
    modal = document.getElementById("modal-channel") as HTMLDialogElement;
  });
</script>

<div
  class="w-[28rem] h-auto bg-bullebg-100 rounded-xl flex flex-col justify-between p-4 border-1 border-bulle-900/10"
>
  <p class="text-bulle-900 text-lg font-medium">Create a new channel !</p>
  <form
    method="post"
    class="flex flex-col justify-between gap-3 h-full pt-2"
    on:submit={createChannel}
    id="channel-form"
  >
    <div class="py-2 w-full">
      <p class="text-bulle-700 font-bold mb-1 text-sm">CHANNEL TYPE</p>
      <div class="m-auto w-full text-base flex flex-col gap-2">
        <label
          class={`transition-colors border-1 text-bulle-900 flex justify-between items-center ${
            selectedRadioButton === "textual"
              ? "bg-bulle-900/20 border-bulle-900/20"
              : "bg-bulle-900/10 border-bulle-900/10"
          }  rounded-lg w-full px-3 py-2`}
          for="checkbox-text"
        >
          <div>
            <p class="text-base text-bulle-900">Text</p>
            <p class="text-sm text-bulle-700">
              To chat with your friends and send them pictures etc.
            </p>
          </div>
          <input
            type="radio"
            id="checkbox-text"
            name="channel_type"
            value="textual"
            bind:group={selectedRadioButton}
          />
        </label>

        <label
          class={`transition-colors border-1 text-bulle-900 flex justify-between items-center ${
            selectedRadioButton === "voice"
              ? "bg-bulle-900/20 border-bulle-900/20"
              : "bg-bulle-900/10 border-bulle-900/10"
          }  rounded-lg w-full px-3 py-2`}
          for="checkbox-voice"
        >
          <div>
            <p class="text-base text-bulle-900">Voice</p>
            <p class="text-sm text-bulle-700">To talk with your friends.</p>
          </div>
          <input
            type="radio"
            id="checkbox-voice"
            name="channel_type"
            value="voice"
            bind:group={selectedRadioButton}
          />
        </label>
      </div>
    </div>

    <div>
      <p class="text-bulle-700 font-bold mb-1 text-sm">CHANNEL NAME</p>
      <input
        type="text"
        name="channel_name"
        id="channel-name"
        placeholder="New channel"
        class="w-full p-2 rounded-lg bg-bulle-900/10 border-1 border-bulle-900/10 placeholder:text-bulle-700 focus-visible:outline-none focus-visible:border-bulle-900/40 focus-visible:bg-bulle-900/20 transition-colors text-bulle-900"
      />
    </div>
    <button type="submit" class="text-xl bg-bulle-900 w-full py-2 rounded-lg"
      >Create !</button
    >
  </form>
</div>
