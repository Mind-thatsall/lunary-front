<script lang="ts">
  import { link } from "svelte-routing";
  import icon_textual from "../assets/icon_text_channel.svg";
  import { openingMenu } from "../utils/contextmenu";

  export let server_id,
    channel_id,
    current_channel_id,
    channel_name,
    section_name,
    isOwner;

  let inChannel: boolean;

  $: if (current_channel_id) {
    inChannel = current_channel_id === channel_id;
  }
</script>

<a
  href={`/bulle/${server_id}/${channel_id}`}
  use:link
  on:contextmenu={(e) =>
    openingMenu(e, {
      type: "channel",
      category: section_name,
      channel_id: channel_id,
      server_id: server_id,
      is_owner: isOwner,
    })}
  class={`channel-${section_name} mb-1 text-lg leading-8  py-1 px-3 rounded-lg ${
    inChannel
      ? "bg-bulle-900/10 text-bulle-900 hover:bg-bulle-900/20"
      : "bg-bulle-900/0 text-bulle-700 hover:bg-bulle-900/10"
  } transition-colors flex items-center gap-3 font-medium`}
  ><img src={icon_textual} alt="" class="h-5 w-5" /> {channel_name}</a
>
