<script lang="ts">
  export let component, nameModal;
</script>

<dialog id={`modal-${nameModal}`} style="background-color: rgba(0, 0, 0, 0);">
  <svelte:component this={component} />
</dialog>
