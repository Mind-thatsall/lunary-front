import { writable } from "svelte/store";

export const user_store = writable({})
export const messages_store = writable([])
export const curr_server_store = writable({})
export const current_loc = writable("")
export const socket = writable<WebSocket>()
export const last_visited_channel_store = writable({})
