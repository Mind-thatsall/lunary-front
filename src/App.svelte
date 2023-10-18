<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import Home from "./pages/Home.svelte";
  import UserHome from "./pages/UserHome.svelte";
  import Bulle from "./pages/Bulle.svelte";
  import Navbar from "./components/Navbar.svelte";
  import Userbar from "./components/Userbar.svelte";
  import Signin from "./pages/Signin.svelte";
  import Signup from "./pages/Signup.svelte";
  import Profile from "./pages/Profile.svelte";
  import RouteAuth from "./components/RouteAuth.svelte";
  import RouteNoAuth from "./components/RouteNoAuth.svelte";
  import AuraEffect from "./components/AuraEffect.svelte";
  import { onMount } from "svelte";
  import {
    LeaveServer,
    updateServersState,
    fetchAllInformations,
  } from "./utils/fetch";
  import {
    user_store,
    messages_store,
    context_menu,
    server_list,
    channel_list,
  } from "./utils/stores";
  import { current_loc } from "./utils/stores";
  import ContextMenu from "./components/ContextMenu.svelte";
  import { checkKey } from "./utils/other";

  let loadingUser = true;
  let Message;

  function closeContextMenu(e: MouseEvent) {
    const contextMenu = document.getElementById("contextmenu");
    if (!contextMenu.classList.contains("hidden")) {
      contextMenu.classList.add("hidden");
    }
    context_menu.update(() => ({
      type: "default",
    }));
  }

  async function loadproto() {
    const root = await protobuf.load("/src/protobuf/user_message.proto");
    Message = root.lookupType("messagepackage.ServerMessage");
  }

  onMount(async () => {
    await fetchAllInformations();
    loadingUser = false;

    loadproto().catch((err) => console.log(err));
    if ($user_store.id) {
      let ws = new WebSocket(
        `ws://localhost:3000/ws/connect/${$user_store.id}`
      );

      ws.binaryType = "arraybuffer";

      ws.onopen = () => {
        ws.onmessage = (message) => {
          const data = new Uint8Array(message.data);
          const decodedMessage = Message.decode(data);
          console.log(decodedMessage);

          switch (decodedMessage.type) {
            case "message":
              const currentLoc = $current_loc.slice(1).split("/");
              const currentChannel = currentLoc.at(-1);
              if (decodedMessage.userMessage.channelId === currentChannel) {
                messages_store.update((messages) => [
                  ...messages,
                  decodedMessage.userMessage,
                ]);
              }
              break;
            case "server_deletion":
              server_list.update((servers) =>
                servers.filter(
                  (server) =>
                    server.serverId !== decodedMessage.serverDeletion.id
                )
              );
              break;
            case "user_leaving":
              server_list.update((servers) =>
                servers.filter(
                  (server) =>
                    server.serverId !== decodedMessage.serverDeletion.id
                )
              );
              break;
            case "channel_creation":
              channel_list.update((categories) => {
                const category = categories[decodedMessage.newChannel.group];
                console.log(category);

                if (category.channels) {
                  category.channels.push(decodedMessage.newChannel.channel);
                } else {
                  category.channels = [decodedMessage.newChannel.channel];
                }

                categories[decodedMessage.newChannel.group] = category;

                return categories;
              });
              break;
            case "server_join":
              server_list.update((servers) => [
                ...servers,
                decodedMessage.serverJoin.server,
              ]);
              break;
            case "channel_deletion":
              channel_list.update((categories) => {
                const category =
                  categories[decodedMessage.channelDeletion.category].channels;

                const updatedCategory = category.filter(
                  (channel) =>
                    channel.channelId !==
                    decodedMessage.channelDeletion.channelId
                );

                categories[decodedMessage.channelDeletion.category].channels =
                  updatedCategory;

                return categories;
              });
              break;
          }
        };
      };
    }

    setInterval(() => {
      updateServersState;
    }, 20000);

    document.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
    document.addEventListener("click", closeContextMenu);
    document.addEventListener("keydown", checkKey);
  });

  let hidesOnRoutes = ["/", "/signin", "/signup"];
</script>

{#if !hidesOnRoutes.includes($current_loc)}
  <AuraEffect />
{/if}
<ContextMenu />
<Router>
  <Route path="/" component={Home} />
  {#if loadingUser}
    Loading...
  {:else}
    <Navbar />
    <RouteNoAuth path="/signup" component={Signup} />
    <RouteNoAuth path="/signin" component={Signin} />
    <RouteAuth path="/posts" component={UserHome} />
    <RouteAuth path="/bulle/:name/:channel_id" component={Bulle} />
    <RouteAuth path="/me" component={Bulle} />
    <RouteAuth path="/me/:channelid" component={Bulle} />
    <Userbar />
  {/if}
</Router>
