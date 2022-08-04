<script>
  import { Button, f7, List } from "framework7-svelte";
  import { updateImage } from "../../js/api/library";
  import { getData } from "../../js/api/profile";
  let input,
    files,
    container,
    image,
    showImage = false,
    body;
  function onChange() {
    const file = input.files[0];

    if (file) {
      showImage = true;

      const reader = new FileReader();
      reader.addEventListener("load", function () {
        body = reader.result.split(",")[1];
        image.setAttribute("src", reader.result);
      });
      reader.readAsDataURL(file);
      return;
    }

    showImage = false;
  }
</script>

<List>
  <div bind:this={container} class="text-align-center">
    {#if showImage}
      <img bind:this={image} src="" alt="Preview" class="lib-hero-image" />
    {/if}
  </div>
  <div class="parent-div text-align-center">
    <button class="button">Select Book Cover</button>
    <input
      bind:this={input}
      on:change={onChange}
      type="file"
      bind:value={files}
      accept="image/*"
    />
  </div>
  <Button
    fill
    onClick={async () => {
      if (body) {
        f7.dialog.preloader();
        setTimeout(async () => {
          const resp = await updateImage({ file: body });
          f7.dialog.close();
          f7.dialog.alert(
            resp.description ? resp.description : "server timeout",
            "",
            async () => {
              if (resp.status && resp.status == 200) {
                getData();
              }
            }
          );
        }, 500);
        return;
      }
      f7.dialog.alert("please select image first", "");
    }}>Save</Button
  >
</List>

<style>
  .parent-div {
    position: relative;
    overflow: hidden;
  }
  .parent-div input[type="file"] {
    left: 0;
    top: 0;
    opacity: 0;
    position: absolute;
    font-size: 90px;
  }
  .lib-hero-image {
    max-height: 250px;
    max-width: 80%;
    object-fit: scale-down;
    object-position: center;
  }
</style>
