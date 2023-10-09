<script lang="ts">
  import { Route, useLocation } from "svelte-routing";
  import { user_store } from "../utils/stores";
  import Redirect from "./Redirect.svelte";

  export let path: string;
  export let component: any;
</script>

<Route {path}>
  {#if !$user_store.id}
    <svelte:component this={component} />
  {:else}
    <Redirect to="previous" />
  {/if}
</Route>
