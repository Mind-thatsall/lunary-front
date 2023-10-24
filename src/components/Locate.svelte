<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { useLocation } from "svelte-routing";
  import type { Unsubscriber } from "svelte/motion";
  import { current_loc } from "../utils/stores";

  let loc = useLocation();
  let unsubscribe: Unsubscriber;

  onMount(() => {
    unsubscribe = loc.subscribe((val) => {
      current_loc.update(() => val.pathname);
    });
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>
