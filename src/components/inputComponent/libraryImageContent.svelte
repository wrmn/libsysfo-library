<script>
  import { Button, f7, List } from "framework7-svelte";
  import { updateImageContent } from "../../js/api/library";
  import { getData } from "../../js/api/profile";
  let input,
    files,
    container,
    image,
    showImage = false,
    fileByte;

  export let imgIndex;
  function onChange() {
    const file = input.files[0];

    if (file) {
      showImage = true;

      const reader = new FileReader();
      reader.addEventListener("load", function () {
        fileByte = reader.result.split(",")[1];
        image.setAttribute("src", reader.result);
      });
      reader.readAsDataURL(file);
      return;
    }

    showImage = false;
  }

  const sendUpdate = (body) => {
    f7.dialog.preloader();
    setTimeout(async () => {
      const resp = await updateImageContent(body);
      f7.dialog.close();
      f7.dialog.alert(
        resp.description ? resp.description : "server timeout",
        "",
        async () => {
          if (resp.status && resp.status == 200) {
            getData();
            fileByte = undefined;
            showImage = false;
          }
        }
      );
    }, 500);
    return;
  };
</script>

<List>
  <div bind:this={container} class="text-align-center">
    {#if showImage}
      <img bind:this={image} src="" alt="Preview" class="lib-hero-image" />
    {/if}
  </div>
  <div class="parent-div text-align-center">
    <button class="button">Select Image</button>
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
    onClick={() => {
      if (fileByte) {
        sendUpdate({
          action: "edit",
          index: imgIndex,
          file: fileByte,
        });
      } else {
        f7.dialog.alert("please select image first", "");
      }
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
