<script>
  import { Row, Col, PhotoBrowser } from "framework7-svelte";
  import { darkTheme } from "../../js/store";
  let pageDark;

  export let photos = [];
</script>

<PhotoBrowser
  photos={photos.length > 0 ? photos : []}
  theme={$darkTheme ? "dark" : "light"}
  type="popup"
  pageBackLinkText="Back"
  bind:this={pageDark}
/>
<Row>
  {#each photos as link, i}
    <Col width="50" medium="25">
      <div on:click={() => pageDark.open(i)} class="image-container">
        <img src={link} alt="" />
      </div>
    </Col>
  {/each}
</Row>

<style>
  .image-container {
    width: 100%;
    height: 210px;
  }

  .image-container > img {
    height: 200px;
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
</style>
