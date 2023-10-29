<script lang="ts">
  import { onMount } from "svelte";

  let modal: HTMLDialogElement;

  async function createCategory(ev: Event) {
    ev.preventDefault();
  }

  onMount(() => {
    modal = document.getElementById("modal-category") as HTMLDialogElement;
  });
</script>

<div
  class="w-[300px] h-[465px] bg-bullebg-100 rounded-xl flex flex-col justify-between p-4 border-1 border-bulle-900/10"
>
  <p>Create a new category !</p>
  <form
    method="post"
    class="flex flex-col items-center justify-between gap-3 h-full pt-5"
    on:submit={createCategory}
    id="category-form"
  >
    <input
      type="text"
      name="category_name"
      id="category-name"
      placeholder="category Name"
      class="w-full p-2 rounded-lg bg-bulle-900/10 border-1 border-bulle-900/10 focus-visible:outline-none focus-visible:border-bulle-900/40 focus-visible:bg-bulle-900/20 transition-colors text-bulle-900"
    />
    <button type="submit" class="text-xl bg-bulle-900 w-full py-2 rounded-lg"
      >Create !</button
    >
  </form>
</div>
