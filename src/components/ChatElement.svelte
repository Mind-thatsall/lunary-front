<script lang="ts">
  import user_icon from "../assets/server_icon_test.png";

  export let username: string, role: string, message_content: string;
</script>

<div class="flex gap-4 px-10 mb-10">
  <img
    src={user_icon}
    alt=""
    class=" flex-shrink-0 w-14 h-14 object-cover rounded-2xl"
  />
  <div>
    <div class="flex mb-1 gap-2">
      <p class="text-white">{username}</p>
    </div>
    <p class="text-base">{message_content}</p>
  </div>
</div>
