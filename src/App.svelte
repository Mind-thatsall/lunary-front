<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import Home from "./pages/Home.svelte";
  import UserHome from "./pages/UserHome.svelte";
  import Bulle from "./pages/Chat.svelte";
  import Navbar from "./components/Navbar/Navbar.svelte";
  import Userbar from "./components/ServerBar/Userbar.svelte";
  import Signin from "./pages/Signin.svelte";
  import Signup from "./pages/Signup.svelte";
  import AuraEffect from "./components/AuraEffect.svelte";
  import { onMount } from "svelte";
  import { context_menu } from "./utils/stores";
  import { current_loc } from "./utils/stores";
  import ContextMenu from "./components/ContextMenu/ContextMenu.svelte";
  import Locate from "./components/Locate.svelte";

  function closeContextMenu() {
    const contextMenu = document.getElementById("contextmenu");
    if (!contextMenu.classList.contains("hidden")) {
      contextMenu.classList.add("hidden");
    }
    context_menu.update(() => ({
      type: "default",
    }));
  }

  let hidesOnRoutes = ["/", "/signin", "/signup"];

  onMount(async () => {
    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
    document.addEventListener("click", closeContextMenu);
  });
</script>

{#if !hidesOnRoutes.includes($current_loc)}
  <AuraEffect />
{/if}
<ContextMenu />
<Router>
  <Locate />
  <Route path="/" component={Home} />
  {#if !hidesOnRoutes.includes($current_loc)}
    <Navbar />
    <Userbar />
  {/if}
  <Route path="/signup" component={Signup} />
  <Route path="/signin" component={Signin} />
  <Route path="/posts" component={UserHome} />
  <Route path="/bulle/:name/:channel_id" component={Bulle} />
  <Route path="/me" component={Bulle} />
  <Route path="/me/:channelid" component={Bulle} />
</Router>
