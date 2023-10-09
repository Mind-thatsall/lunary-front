<script lang="ts">
  export let width, height, type, image, borders;
</script>

<div
  class={`${width} height-${type} overflow-hidden ${borders} border-bulle-500 bg-bullebg-100`}
  id={`${type}`}
>
  <div>
    <img
      src={image}
      alt=""
      id={`${type}_img`}
      class="relative h-full w-full object-fill select-none"
      draggable="false"
    />
  </div>
</div>

<style>
  .height-banner {
    height: max(180px, min(15vw, 256px));
  }

  .height-avatar {
    height: 7rem;
  }
</style>
