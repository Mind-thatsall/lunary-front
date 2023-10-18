import { user_store, last_visited_channel_store } from './stores'
import { get } from 'svelte/store';

export async function fetchUser(): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:3000/api/user/check", {
      method: "get",
      credentials: "include",
    });
    const data = await response.json();

    return data
  } catch (error) {
    console.log(error);
  }
}

export async function updateServersState() {
  const servers_state = get(last_visited_channel_store)

  try {
    const response = await fetch("http://localhost:3000/api/update_server_state", {
      method: "post",
      body: JSON.stringify(servers_state),
      credentials: "include",
      headers: {
        "Content-Type": "application/json"

      }
    });

    if (!response.ok) {
      throw new Error("Error while updating the server state")
    }
  } catch (error) {
    console.error(error)
  }

}


async function getServersState() {
  try {
    const response = await fetch("http://localhost:3000/api/get_last_servers_state", {
      method: "get",
      credentials: "include",
    });
    const data = await response.json();

    return data
  } catch (error) {
    console.log(error);
  }
}

export async function fetchAllInformations() {
  try {
    const user = await fetchUser();

    if (user) {
      user_store.set(user);
      const servers_state = await getServersState()
      if (servers_state) {
        last_visited_channel_store.set(servers_state);
      } else {
        throw new Error("Error when fetching the last servers state.")
      }
    } else {
      throw new Error("Error when fetching the user.")
    }
  } catch (error) {
    console.error(error)
  }
}


export async function LeaveServer(id: string, type: string) {
  const body = {
    server_id: id,
    type: type,
  }

  try {
    const response = await fetch("http://localhost:3000/api/leave_server", {
      method: "post",
      body: JSON.stringify(body),
      credentials: "include",
      headers: {
        "Content-Type": "application/json"

      }
    });

    if (!response.ok) {
      console.log(response.statusText)
    }
  } catch (error) {
    console.log(error);
  }

}
