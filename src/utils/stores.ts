import { writable } from "svelte/store";

export const user_store = writable({})
export const messages_store = writable([])
export const curr_server_store = writable({})
export const server_list = writable([])
export const channel_list = writable([])
export const current_loc = writable("")
export const last_visited_channel_store = writable({})
export const context_menu = writable({})
export const context_menu_states = writable({})
export const socket = writable<WebSocket>()
export const instant_notif = writable({})
export const new_server = writable({})
