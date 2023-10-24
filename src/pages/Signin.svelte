<script lang="ts">
  import { user_store } from "../utils/stores";
  import bg from "../assets/bg-login.jpg";
  import { navigate } from "svelte-routing";

  async function Login(ev: Event) {
    ev.preventDefault();
    let data;

    try {
      const form = new FormData(
        document.getElementById("login-form") as HTMLFormElement
      );

      const body = {
        email: form.get("email"),
        password: form.get("password"),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        user_agent: navigator.userAgent,
      };

      const response = await fetch("https://127.0.0.1/api/user/login", {
        method: "POST",
        body: JSON.stringify(body),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error(error);
    } finally {
      user_store.set(data);
      navigate("/me");
    }
  }
</script>

<div id="bg-login" class="w-screen h-screen flex justify-center items-center">
  <div
    class="flex gap-6 w-[48.25rem] h-[32.875rem] bg-bullebg-100/90 rounded-2xl border-1 border-bulle-900/20 p-5"
  >
    <form
      on:submit={Login}
      method="post"
      class="flex flex-col w-full gap-4 px-6 justify-center items-center"
      id="login-form"
    >
      <h1 class="font-black text-4xl self-start">Sign In</h1>
      <div class="my-2 flex flex-col gap-2 w-full">
        <div>
          <label for="email" class="text-sm text-bulle-700 font-bold ml-1"
            >EMAIL
          </label>
          <input
            class="focus-visible:outline-none focus-visible:border-accent transition-colors w-full px-3 py-2 rounded-lg bg-bulle-900/10 border-1 border-bulle-900/10 placeholder:text-bulle-500 mt-1"
            type="email"
            name="email"
            placeholder="E.g. john.doe@example.com"
          />
        </div>
        <div>
          <label for="email" class="text-sm text-bulle-700 font-bold ml-1"
            >PASSWORD</label
          >
          <input
            class="focus-visible:outline-none focus-visible:border-accent transition-colors w-full px-3 py-2 rounded-lg bg-bulle-900/10 border-1 border-bulle-900/10 placeholder:text-bulle-500 mt-1"
            type="password"
            name="password"
            placeholder="Password"
          />
        </div>
        <div class="w-full flex justify-between px-2">
          <div>
            <input type="checkbox" name="remember" id="remember" />
            <label for="remember">Remember Me</label>
          </div>
          <a href="/" class="text-accent underline">Forgot Password</a>
        </div>
      </div>
      <div class="w-full flex flex-col items-center">
        <button
          class="bg-accent text-bullebg-100 py-2 rounded-lg font-extrabold w-full"
          type="submit">Sign In</button
        >
        <div class="flex gap-1 mt-2">
          <p class="text-base">Not Registered Yet?</p>
          <a href="/signup" class="text-accent text-base underline"
            >Create An Account</a
          >
        </div>
      </div>
    </form>
    <img class="w-[21rem] h-full rounded-lg" src={bg} alt="" />
  </div>
</div>

<style>
  #bg-login {
    background-image: url("../assets/bg-login.jpg");
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>
