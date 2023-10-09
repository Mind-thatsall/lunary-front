<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import Home from "./pages/Home.svelte";
  import UserHome from "./pages/UserHome.svelte";
  import Tailwind from "./lib/Tailwind.svelte";
  import Bulle from "./pages/Bulle.svelte";
  import Navbar from "./components/Navbar.svelte";
  import Userbar from "./components/Userbar.svelte";
  import Signin from "./pages/Signin.svelte";
  import Signup from "./pages/Signup.svelte";
  import Profile from "./pages/Profile.svelte";
  import RouteAuth from "./components/RouteAuth.svelte";
  import RouteNoAuth from "./components/RouteNoAuth.svelte";
  import AuraEffect from "./components/AuraEffect.svelte";
  import { onDestroy, onMount } from "svelte";
  import { updateServersState, fetchAllInformations } from "./utils/fetch";
  import { user_store, socket } from "./utils/stores";
  import { current_loc } from "./utils/stores";

  let loadingUser = true;

  onMount(async () => {
    await fetchAllInformations();
    loadingUser = false;

    if ($user_store.id) {
      let ws = new WebSocket(
        `ws://localhost:3000/ws/connect/${$user_store.id}`
      );

      ws.binaryType = "arraybuffer";

      ws.onopen = () => {
        socket.set(ws);
      };
    }

    setInterval(() => {
      updateServersState;
    }, 20000);
  });

  let hidesOnRoutes = ["/", "/signin", "/signup"];
</script>

<Tailwind />

{#if !hidesOnRoutes.includes($current_loc)}
  <AuraEffect />
{/if}
<Router>
  <Route path="/" component={Home} />
  {#if loadingUser}
    Loading...
  {:else}
    <Navbar />
    <RouteNoAuth path="/signup" component={Signup} />
    <RouteNoAuth path="/signin" component={Signin} />
    <RouteAuth path="/posts" component={UserHome} />
    <RouteAuth path="/bulle/:name" component={Bulle} />
    <RouteAuth path="/bulle/:name/:channel_id" component={Bulle} />
    <RouteAuth path="/profile" component={Profile} />
    <RouteAuth path="/profile/:user_id" component={Profile} />
    <Userbar />
  {/if}
</Router>
