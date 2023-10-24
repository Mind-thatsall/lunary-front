<script lang="ts">
  import { onMount } from "svelte";
  import { useLocation } from "svelte-routing";
  import type { Unsubscriber } from "svelte/store";

  let loc = useLocation();
  let unsubscribe: Unsubscriber;

  onMount(() => {
    unsubscribe = loc.subscribe((val) => {
      console.log(val);
    });
  });
</script>

<h1>Hello world</h1>
