<script lang="ts">
  import user_icon from "../assets/server_icon_test.png";

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

<div class="flex gap-4 px-10 mb-10 w-full">
  <img
    src={user_icon}
    alt=""
    class=" flex-shrink-0 w-14 h-14 object-cover rounded-2xl"
  />
  <div>
    <div class="flex mb-1 gap-2">
      <p class="font-medium text-bulle-900">{message.sender.username}</p>
      <p class="text-bulle-700">{convertToLocaleDate(message.createdAt)}</p>
    </div>
    <p class="text-base">{message.content}</p>
  </div>
</div>
