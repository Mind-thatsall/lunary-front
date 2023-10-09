<script lang="ts">
  import ImageCropper from "../components/ImageCropper.svelte";
  import UserProfileIllustrations from "../components/UserProfileIllustrations.svelte";
  import { user_store } from "../utils/stores";
  import { updateUserFilesInBackend, uploadFile } from "../utils/s3";

  let editing = false;
  let about_me = "I like feet";
  let username = "mind";
  let isLoadingCropping = false;

  let newVersionBanner: number;
  let newVersionAvatar: number;

  let imageCropAvatar;
  let imageCropBanner;

  function getVersionOfMedia(media: string) {
    let mediaDirty = media.split("_").pop();
    mediaDirty = mediaDirty.replace(".webp", "");
    const mediaClean = mediaDirty.slice(1, mediaDirty.length);

    return Number(mediaClean);
  }

  async function onEdit(ev: Event) {
    editing = ev.target.checked;

    if (!editing) {
      newVersionBanner = getVersionOfMedia($user_store.banner) + 1;
      newVersionAvatar = getVersionOfMedia($user_store.avatar) + 1;

      isLoadingCropping = true;
      const fileAvatar = await imageCropAvatar.getCroppedImage("avatar");
      const fileBanner = await imageCropBanner.getCroppedImage("banner");
      isLoadingCropping = false;

      if (fileBanner) {
        const success = await uploadFile(
          fileBanner,
          "banner",
          newVersionBanner
        );

        if (success) {
          const { url } = await updateUserFilesInBackend(
            "banner",
            newVersionBanner
          );
          user_store.update((val) => {
            return { ...val, banner: url };
          });
        }
      }

      if (fileAvatar) {
        const success = await uploadFile(
          fileAvatar,
          "avatar",
          newVersionAvatar
        );

        if (success) {
          const { url } = await updateUserFilesInBackend(
            "avatar",
            newVersionAvatar
          );
          user_store.update((val) => {
            return { ...val, avatar: url };
          });
        }
      }
    }
  }
</script>

<div class="flex-grow border-r-1 border-l-1 border-bulle-500 h-screen">
  <div class="relative">
    <input
      type="checkbox"
      name=""
      id=""
      class="absolute z-[3] right-3 top-3"
      on:change={onEdit}
    />
    <span
      class="w-full height-banner pointer-events-none absolute top-0 left-0 bg-gradient-to-t from-bullebg-100 to-transparent z-[2] border-b-1 border-bulle-500"
    />
    {#if !editing && !isLoadingCropping}
      <UserProfileIllustrations
        width="w-full"
        height="h-64"
        type="banner"
        image={$user_store.banner}
        borders=""
      />
    {:else}
      <ImageCropper
        width="w-[1195px]"
        height="h-64"
        type="banner"
        bind:this={imageCropBanner}
        output_width="1195"
      />
    {/if}
    <div class="absolute bottom-0 z-[3] flex items-center gap-7">
      {#if !editing && !isLoadingCropping}
        <UserProfileIllustrations
          width="w-28"
          height="h-28"
          type="avatar"
          image={$user_store.avatar}
          borders="border-b-1 border-t-1 border-r-1"
        />
        <div>
          <p class="text-2xl font-bold">{username}</p>
          <p class="text-base text-bulle-700">mind-thatsall</p>
        </div>
      {:else}
        <ImageCropper
          width="w-28"
          height="h-28"
          type="avatar"
          bind:this={imageCropAvatar}
          output_width="112"
        />
        <div class="w-fit">
          <input
            type="text"
            class="bg-bullebg-0 text-2xl font-bold focus-visible:outline-none w-auto"
            bind:value={username}
          />
          <p class="text-base text-bulle-700">mind-thatsall</p>
        </div>
      {/if}
    </div>
  </div>
  <div class="flex">
    <div class="flex-grow">
      <section class="">
        <div class="w-full border-bulle-500 border-b-1 border-r-1">
          <p class="border-bulle-500 border-r-1 w-fit py-2 px-5">About me</p>
        </div>
        {#if !editing}
          <p class="p-9 border-r-1 border-bulle-500">{about_me}</p>
        {:else}
          <input
            type="text"
            class="p-9 border-r-1 border-bulle-500 w-full bg-bullebg-100 focus-visible:outline-none"
            bind:value={about_me}
          />
        {/if}
      </section>
      <section class="">
        <div class="w-full border-bulle-500 border-b-1 border-r-1 border-t-1">
          <p class="border-bulle-500 border-r-1 w-fit py-2 px-5">
            Latest Activities
          </p>
        </div>
      </section>
    </div>

    <div>
      <section class="w-72">
        <div class="w-full border-bulle-500 border-b-1">
          <p class="border-bulle-500 border-r-1 w-fit py-2 px-5">Socials</p>
        </div>
      </section>
      <section class="">
        <div class="w-full border-bulle-500 border-b-1">
          <p class="border-bulle-500 border-r-1 w-fit py-2 px-5">
            Active Bulles
          </p>
        </div>
      </section>
    </div>
  </div>
</div>

<style>
  .height-banner {
    height: max(180px, min(15vw, 256px));
  }
</style>
