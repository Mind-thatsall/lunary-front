<script lang="ts">
  import { onMount } from "svelte";
  import ImageCropper from "./ImageCropper.svelte";
  import { uploadFile } from "../utils/s3";

  let modal: HTMLDialogElement;
  let imageCropServerBanner;

  async function createServer(ev: Event) {
    ev.preventDefault();

    const fileServerBanner = await imageCropServerBanner.getCroppedImage(
      "server_banner"
    );

    const serverId = await uploadFile(fileServerBanner, "server", "banner", 1);

    if (serverId) {
      const form = new FormData(
        document.getElementById("server-form") as HTMLFormElement
      );

      const body = {
        server_id: serverId,
        banner: `https://d2b2cq6cks3j1i.cloudfront.net/server_banner/banner_${serverId}_v1.webp`,
        description: form.get("server_desc"),
        name: form.get("server_name"),
        status: form.get("server_type"),
      };

      try {
        const response = await fetch(
          "http://localhost:3000/api/create_server",
          {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error(response.statusText);
        }
      } catch (error) {
        console.error(error);
      } finally {
        closeModal();
      }
    }
  }

  function closeModal() {
    modal.close();
  }

  onMount(() => {
    modal = document.getElementById("modal-server") as HTMLDialogElement;
  });
</script>

<div
  class="w-[300px] h-[465px] bg-bullebg-100 rounded-xl flex flex-col justify-between p-4 border-1 border-bulle-900/10"
>
  <ImageCropper
    width="w-[268px]"
    height="h-[176px]"
    type="server_banner"
    output_width="268"
    bind:this={imageCropServerBanner}
  />
  <form
    method="post"
    class="flex flex-col items-center justify-between gap-3 h-full pt-5"
    on:submit={createServer}
    id="server-form"
  >
    <input
      type="text"
      name="server_name"
      id="server-name"
      placeholder="Server Name"
      class="w-full p-2 rounded-lg bg-bulle-900/10 border-1 border-bulle-900/10 focus-visible:outline-none focus-visible:border-bulle-900/40 focus-visible:bg-bulle-900/20 transition-colors text-bulle-900"
    />
    <input
      type="text"
      name="server_desc"
      id="server-desc"
      placeholder="Server Description"
      class="w-full p-2 rounded-lg bg-bulle-900/10 border-1 border-bulle-900/10 focus-visible:outline-none focus-visible:border-bulle-900/40 focus-visible:bg-bulle-900/20 transition-colors text-bulle-900"
    />
    <div class="py-2">
      <p class="text-bulle-900 text-xl font-semibold">Friends or community ?</p>
      <div class="m-auto w-fit text-base">
        <input
          type="radio"
          id="checkbox-friends"
          name="server_type"
          value="private"
        />
        <label class="text-bulle-900" for="checkbox-friends">Friends</label>
        <input
          type="radio"
          id="checkbox-community"
          name="server_type"
          value="public"
        />
        <label class="text-bulle-900" for="checkbox-community">Community</label>
      </div>
    </div>
    <button type="submit" class="text-xl bg-bulle-900 w-full py-2 rounded-lg"
      >Create !</button
    >
  </form>
</div>
