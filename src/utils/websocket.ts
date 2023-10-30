import { navigate } from "svelte-routing/src/history";
import { server_list, new_server, user_store, channel_list, messages_store, socket, last_visited_channel_store, current_loc, instant_notif, curr_server_store, curr_server_users_store } from "./stores";
import { get } from "svelte/store";

let Message;

async function loadproto() {
  const root = await protobuf.load("/src/protobuf/user_message.proto");
  Message = root.lookupType("messagepackage.ServerMessage");
}

export function connect() {
  loadproto().catch((err) => console.log(err));
  let ws = new WebSocket(`wss://127.0.0.1/ws/connect`);

  ws.binaryType = "arraybuffer";


  ws.onopen = () => {
    const currentLoc = get(current_loc).slice(1).split('/');
    let body = {};
    if (currentLoc[0].includes("bulle") && currentLoc[1]) {
      body = {
        type: "initial",
        pos: currentLoc[1],
      };
    } else {
      body = {
        type: "initial",
        pos: "me",
      };
    }
    ws.send(JSON.stringify(body));
    ws.onmessage = (message) => {
      const data = new Uint8Array(message.data);
      const decodedMessage = Message.decode(data);
      console.log(decodedMessage);

      switch (decodedMessage.type) {
        case "initial":
          user_store.set(decodedMessage.initialLoad.user);
          server_list.set(decodedMessage.initialLoad.servers);
          if (body.pos !== "me") {
            channel_list.set(decodedMessage.initialLoad.server.categories);
            curr_server_users_store.set(decodedMessage.initialLoad.server.users)
          }
          socket.set(ws);
          last_visited_channel_store.set(
            decodedMessage.initialLoad.serverStates.map
          );

        case "message":
          const currentLoc = get(current_loc).slice(1).split('/');
          const currentChannel = currentLoc.at(-1);
          if (decodedMessage.userMessage.channelId === currentChannel) {
            messages_store.update((messages) => [
              ...messages,
              decodedMessage.userMessage,
            ]);
          }

          let user = get(user_store)
          if (decodedMessage.userMessage.sender.id !== user.id) {
            instant_notif.update(() => decodedMessage.userMessage.sender)
            const notifbox = document.getElementById("notification-box")
            const notifmessage = document.getElementById("notification-message")
            notifbox.style.height = "10rem"
            notifmessage.style.opacity = "1"
            setTimeout(() => {
              notifbox.style.height = "4.5626rem"
              notifmessage.style.opacity = "0"
            }, 2000)
          }

          break;
        case "server_deletion":
          server_list.update((servers) =>
            servers.filter(
              (server) => server.serverId !== decodedMessage.serverDeletion.id
            )
          );

          const currServer = get(curr_server_store)
          if (currServer.serverId === decodedMessage.serverDeletion.id) {
            const serverList = get(server_list)
            const firstServer = serverList[0].serverId;
            const lastChannel = get(last_visited_channel_store)
            navigate(
              `/bulle/${firstServer}/${lastChannel[firstServer]}`
            );
          }
          break;
        case "user_leaving":
          server_list.update((servers) =>
            servers.filter(
              (server) => server.serverId !== decodedMessage.serverDeletion.id
            )
          );
          break;
        case "channel_creation":
          channel_list.update((categories) => {
            const category = categories.find(
              (category) =>
                category.groupName === decodedMessage.newChannel.group
            );

            category.channels.push(decodedMessage.newChannel.channel);

            return categories;
          });
          break;
        case "server_join":
          server_list.update((servers) => [
            ...servers,
            decodedMessage.serverJoin.server,
          ]);
          break;
        case "server_creation":
          new_server.set(decodedMessage.serverJoin.server)
          break;
        case "channel_deletion":
          channel_list.update((categories) => {
            let category = categories.find(
              (category) =>
                category.groupName === decodedMessage.channelDeletion.category
            );

            const filteredArr = category.channels.filter(
              (channel) =>
                channel.channelId !== decodedMessage.channelDeletion.channelId
            );

            category.channels = filteredArr;

            return categories;
          });


          if (get(current_loc).split("/").at(-1) === decodedMessage.channelDeletion.channelId) {
            const firstChannel = get(channel_list)[0].channels[0].channelId;
            navigate(`/bulle/${get(curr_server_store).serverId}/${firstChannel}`);
          }
          break;
        case "change_server":
          channel_list.set(decodedMessage.changeServer.server.categories);
          curr_server_users_store.set(decodedMessage.initialLoad.server.users)
          break;
      }
    };
  }
}
