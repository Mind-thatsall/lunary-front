<script lang="ts">
  import Post from "../components/Post.svelte";
</script>

<main
  class="flex-grow border-l-2 border-bulle-500 border-r-2 h-screen overflow-y-auto scrollbar-hide"
>
  <Post />
  <Post />
  <Post />
  <Post />
  <Post />
  <Post />
</main>

<style>
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
