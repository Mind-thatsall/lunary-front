<script lang="ts">
  import { user_store } from "../utils/stores";

  async function Login(ev: Event) {
    ev.preventDefault();

    const form = new FormData(
      document.getElementById("login-form") as HTMLFormElement
    );

    const response = await fetch("http://localhost:3000/api/user/login", {
      method: "POST",
      body: form,
      credentials: "include",
    });

    const data = await response.json();

    user_store.set(data);
  }
</script>

<div>login</div>
<form on:submit={Login} method="post" class="flex flex-col" id="login-form">
  <input type="email" name="email" placeholder="Email" />
  <input type="password" name="password" placeholder="Password" />
  <button type="submit">Sign In</button>
</form>
