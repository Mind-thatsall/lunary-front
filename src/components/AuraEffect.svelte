<script>
  import { curr_server_store } from "../utils/stores";

  let changing = false;
  let bannerImage = $curr_server_store.banner;

  $: {
    if ($curr_server_store.banner !== bannerImage) {
      changing = true;
      setTimeout(() => {
        changing = false;
        bannerImage = $curr_server_store.banner;
      }, 150);
    }
  }
</script>

<div
  class={`pointer-events-none h-screen w-screen overflow-hidden absolute ${
    changing ? "opacity-0" : "opacity-100"
  } transition-opacity-aura `}
>
  <svg
    width="1262"
    height="571"
    viewBox="0 0 1262 571"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="absolute -right-[80px] -top-[80px]"
    id="server_light"
  >
    <defs>
      <pattern
        id="image-pattern"
        width="1"
        height="1"
        patternContentUnits="objectBoundingBox"
      >
        <image
          xlink:href={bannerImage}
          x="0"
          y="0"
          width="1"
          height="1"
          preserveAspectRatio="none"
        />
      </pattern>
    </defs>
    <path
      d="M1262 0H0.5L178 121L650.5 203L847.5 288.5L905 414L1262 570.5V0Z"
      fill="url(#image-pattern)"
    />
  </svg>
</div>

<style>
  #server_light {
    filter: blur(100px);
    z-index: -1;
    opacity: 55%;
  }

  .transition-opacity-aura {
    transition-property: opacity;
    transition-timing-function: ease-in-out;
    transition-duration: 150ms;
  }
</style>
