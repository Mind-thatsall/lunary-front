<script lang="ts">
  import { link } from "svelte-routing";

  export let link_name: string;
  export let current_loc: string;
  export let font_size: string;
  let capitalizedLink = link_name.charAt(0).toUpperCase() + link_name.slice(1);
</script>

<a
  href={`/${link_name}`}
  class={`${font_size} ${
    current_loc === link_name
      ? "text-bulle-900 font-semibold"
      : "text-bulle-700"
  } hover:text-bulle-900 transition-colors`}
  use:link>{capitalizedLink}</a
>
