<script lang="ts">
  export let component;
</script>

<dialog id="modal-server">
  <svelte:component this={component} />
</dialog>

<style>
  #modal-server {
    background-color: rgba(0, 0, 0, 0);
  }
</style>
