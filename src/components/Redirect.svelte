<script>
  import { onMount } from "svelte";
  import { navigate } from "svelte-routing";

  export let to;

  onMount(() => {
    if (to === "previous") {
      window.history.back();
    } else {
      navigate(to, {
        replace: true,
      });
    }
  });
</script>
