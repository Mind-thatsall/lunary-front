<script lang="ts">
  import user_icon from "../assets/server_icon_test.png";
  import { formattedHTML } from "../utils/markdown";
  import { context_menu, user_store } from "../utils/stores";
  import { openingMenu } from "../utils/contextmenu";

  function convertToLocaleDate(utcTime) {
    let utcDate: Date;

    if (utcTime.seconds) {
      console.log(utcTime);
      utcDate = new Date(utcTime.seconds * 1000 + utcTime.nanos / 1000000);
    } else {
      utcDate = new Date(utcTime);
    }
    // If date is today
    const today = new Date();
    if (utcDate.toDateString() === today.toDateString()) {
      return (
        "Today at " +
        utcDate.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }

    let parts = {
      date: utcDate.toLocaleDateString(undefined, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
      }),
      time: utcDate.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        // second: '2-digit', // remove this line to exclude seconds
      }),
    };

    return `${parts.date} ${parts.time}`;
  }

  export let role, message;
</script>

<div
  role="button"
  tabindex="1"
  on:contextmenu={(e) =>
    openingMenu(e, {
      type: `message-${message.id}`,
      is_owner: message.sender.id === $user_store.id,
    })}
  class={`cursor-default flex gap-4 px-10 py-2 mb-5 last:mb-10 w-full ${
    $context_menu.type === `message-${message.id}` ? "bg-bullebg-200" : ""
  } focus-visible:outline-none focus-visible:border-2 focus-visible:border-bulle-900 border-2 focus-visible:rounded-lg border-bulle-900/0`}
>
  <img
    src={message.sender.avatar}
    alt=""
    class="select-none flex-shrink-0 w-14 h-14 object-cover rounded-2xl cursor-pointer"
  />
  <div>
    <div class="flex items-center mb-1 gap-2">
      <p class="font-semibold text-bulle-900 cursor-pointer hover:underline">
        {message.sender.displayName}
      </p>
      <p class="text-bulle-700 text-xs pt-[0.15rem] cursor-default">
        {convertToLocaleDate(message.createdAt)}
      </p>
    </div>
    <p class="text-chat font-normal">{@html formattedHTML(message.content)}</p>
  </div>
</div>

<style>
  .text-chat {
    font-size: 1.0625rem;
    line-height: 1.625rem;
  }
</style>
