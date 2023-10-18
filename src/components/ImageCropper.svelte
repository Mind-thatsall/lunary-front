<script lang="ts">
  import { onMount } from "svelte";
  import { user_store } from "../utils/stores";

  let file: File;
  let avatar: HTMLDivElement;
  let avatarBounds: DOMRect;
  let image: HTMLImageElement;
  let imageBounds: DOMRect;
  let disabled = false;

  let initialX = 0; // X position when mouse button pressed
  let initialY = 0; // Y position when mouse button pressed
  let xOffset = 0; // How much has the image been translated in X
  let yOffset = 0; // How much has the image been translated in Y
  let posX = 0;
  let posY = 0;
  let scale = 1;
  let maxScale = 0;
  let minScale = 0;
  let dragImg = false;

  export let width, height, type, output_width;

  function processImage(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (evt) {
        image.src = evt.target.result;

        image.onload = () => {
          scale = 1;
          xOffset = 0;
          yOffset = 0;
          initialX = 0;
          initialY = 0;
          image.style.left = `0px`;
          image.style.top = `0px`;
          image.style.transform = `scale(${scale})`;
          disabled = true;

          adjustImageSize(image, output_width);
        };
      };
      reader.readAsDataURL(file);
    }
  }

  export function adjustImageSize(imgElement, OUTPUT_WIDTH) {
    // Get natural dimensions of image
    const { naturalWidth, naturalHeight } = imgElement;

    // Calculate aspect ratio
    scale = OUTPUT_WIDTH / naturalWidth;
    minScale = scale;

    const oldTransformOrigin = imgElement.style.transformOrigin;

    // Temporarily adjust transform origin to "top left"
    imgElement.style.transformOrigin = "top left";

    // Apply scaling
    imgElement.style.transform = `scale(${scale})`;

    // Offset for shift caused by scale change
    xOffset = -((1 - scale) * (naturalWidth / 2));
    yOffset = -((1 - scale) * (naturalHeight / 2));

    imgElement.style.left = `${xOffset}px`;
    imgElement.style.top = `${yOffset}px`;

    // Restore old transform origin
    imgElement.style.transformOrigin = oldTransformOrigin;
  }

  function mousemoveHandler(ev: MouseEvent) {
    if (dragImg) {
      posX = ev.clientX - initialX;
      posY = ev.clientY - initialY;

      xOffset = posX;
      yOffset = posY;

      image.style.left = `${xOffset}px`;
      image.style.top = `${yOffset}px`;
    }
  }

  function resizeImage(sourceCanvas, targetWidth, targetHeight) {
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = targetWidth;
    tempCanvas.height = targetHeight;
    tempCtx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);
    return tempCanvas;
  }

  export function getCroppedImage(type) {
    // Get the image

    if (!file) return;

    const imgElement = document.getElementById(
      `${type}_img_cropper`
    ) as HTMLImageElement;
    const avatar = document.getElementById(`${type}_cropper`) as HTMLDivElement;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    let { naturalWidth, naturalHeight } = imgElement;
    const imageBounds = imgElement.getBoundingClientRect();
    const avatarBounds = avatar.getBoundingClientRect();
    console.log(imgElement, avatar.getBoundingClientRect());

    const OUTPUT_WIDTH = avatarBounds.width;
    const OUTPUT_HEIGHT = avatarBounds.height;

    // Calculate the position of the image relative to the crop area
    const cropX =
      (avatarBounds.x - imageBounds.x) * (naturalWidth / imageBounds.width);
    const cropY =
      (avatarBounds.y - imageBounds.y) * (naturalHeight / imageBounds.height);
    const cropWidth = OUTPUT_WIDTH * (naturalWidth / imageBounds.width);
    const cropHeight = OUTPUT_HEIGHT * (naturalHeight / imageBounds.height);

    canvas.width = cropWidth;
    canvas.height = cropHeight;

    // Draw the cropped portion of the image onto the canvas
    ctx.drawImage(
      imgElement,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    const RESIZE_WIDTH = 267;
    const RESIZE_HEIGHT = 176;

    const resizedCanvas = resizeImage(canvas, RESIZE_WIDTH, RESIZE_HEIGHT);

    return new Promise((resolve, reject) => {
      resizedCanvas.toBlob(
        (blob) => {
          if (blob === null) {
            reject(new Error("Failed to create blob."));
            return;
          }

          let objectURL = URL.createObjectURL(blob);

          if (type === "banner") {
            user_store.update((val) => {
              return { ...val, banner: objectURL };
            });
          } else if (type === "avatar") {
            user_store.update((val) => {
              return { ...val, avatar: objectURL };
            });
          }

          let file = new File([blob], "test.webp", { type: "image/webp" });
          resolve(file);
        },
        "image/webp",
        1
      );
    });
  }

  function adjustImage() {
    avatarBounds = avatar.getBoundingClientRect();
    imageBounds = image.getBoundingClientRect();
    const originalImageWidth = image.clientWidth;
    const originalImageHeight = image.clientHeight;
    const imageOverflowWidth = (imageBounds.width - originalImageWidth) / 2;
    const imageOverflowHeight = (imageBounds.height - originalImageHeight) / 2;
    image.classList.add("transition-all");

    if (avatarBounds.left < imageBounds.left) {
      image.style.left = `${imageOverflowWidth}px`;
      xOffset = xOffset - (imageBounds.left - avatarBounds.left);
    } else if (avatarBounds.right > imageBounds.right) {
      image.style.left = `${
        -(imageBounds.width - avatarBounds.width) + imageOverflowWidth
      }px`;
      xOffset = xOffset + (avatarBounds.right - imageBounds.right);
    }

    if (avatarBounds.top < imageBounds.top) {
      image.style.top = `${imageOverflowHeight - 2}px`;
      yOffset = yOffset - (imageBounds.top - avatarBounds.top);
      yOffset = yOffset - (yOffset - imageOverflowHeight);
    } else if (avatarBounds.bottom > imageBounds.bottom) {
      image.style.top = `${
        -(imageBounds.height - avatarBounds.height) + imageOverflowHeight
      }px`;

      yOffset = yOffset + (avatarBounds.bottom - imageBounds.bottom);
    }

    setTimeout(() => {
      image.classList.remove("transition-all");
    }, 200);
  }

  function mouseupHandler() {
    initialX = initialX - xOffset;
    initialY = initialY + yOffset;
    dragImg = false;

    adjustImage();
  }

  function mousedownHandler(ev: MouseEvent) {
    ev.preventDefault();

    initialX = ev.clientX - xOffset;
    initialY = ev.clientY - yOffset;
    console.log(xOffset);

    dragImg = true;
  }

  let wheelEventEndTimeout = null;

  function mousewheelHandler(ev: WheelEvent) {
    ev.preventDefault();

    if (ev.deltaY < 0) {
      scale += 0.01;
    } else {
      scale -= 0.01;
    }
    scale = Math.min(Math.max(minScale, scale), 3);

    image.style.transform = `scale(${scale})`;

    avatarBounds = avatar.getBoundingClientRect();
    imageBounds = image.getBoundingClientRect();

    clearTimeout(wheelEventEndTimeout);
    wheelEventEndTimeout = setTimeout(() => {
      adjustImage();
    }, 100);
  }

  onMount(() => {
    image = document.getElementById(`${type}_img_cropper`) as HTMLImageElement;
    avatar = document.getElementById(`${type}_cropper`) as HTMLDivElement;

    image.addEventListener("mousedown", mousedownHandler);
    image.addEventListener("mouseup", mouseupHandler);
    image.addEventListener("mousemove", mousemoveHandler);
    image.addEventListener("mouseleave", mouseupHandler);
    image.addEventListener("wheel", mousewheelHandler);
  });
</script>

<input
  type="file"
  name={`choose_${type}`}
  id={`choose_${type}`}
  bind:files={file}
  accept="image/*"
  on:change={processImage}
  hidden
  {disabled}
/>
<label for={`choose_${type}`}>
  <div
    class={`${width} ${height} relative overflow-hidden border-1 border-bulle-500 bg-bullebg-100`}
    id={`${type}_cropper`}
  >
    <div class={`${width}`}>
      <img
        src=""
        alt=""
        id={`${type}_img_cropper`}
        class="relative h-full w-auto max-h-none max-w-none"
      />
    </div>
  </div>
</label>

<!-- component


    const bannerAspect = OUTPUT_WIDTH / OUTPUT_HEIGHT;

    let sourceAspect = naturalWidth / naturalHeight;

    let sourceWidth, sourceHeight, canvasWidth, canvasHeight;
    if (sourceAspect > bannerAspect) {
      canvasHeight = naturalHeight;
      canvasWidth = canvasHeight * bannerAspect;
    } else {
      canvasWidth = naturalWidth;
      canvasHeight = canvasWidth / bannerAspect;
    }

    sourceWidth = canvasWidth / scale;
    sourceHeight = canvasHeight / scale;

    sourceWidth =
      sourceWidth < avatarBounds.width
        ? sourceWidth + (avatarBounds.width - sourceWidth)
        : sourceWidth;

    sourceHeight =
      sourceHeight < avatarBounds.height
        ? sourceHeight + (avatarBounds.height - sourceHeight)
        : sourceHeight;

    canvas.width = sourceWidth;
    canvas.height = sourceHeight;

    // calculate the offset
    xOffset = xOffset * (naturalWidth / imageBounds.width);
    yOffset = yOffset * (naturalHeight / imageBounds.height);

    // calculate the source starting point considering the offset
    let sourceX = (naturalWidth - sourceWidth) / 2;
    sourceX -= xOffset;

    let sourceY;
    if (type === "banner") {
      sourceY = -(imageBounds.top * (naturalHeight / imageBounds.height));
    } else {
      sourceY = (naturalWidth - sourceWidth) / 2;
    }

 -->
