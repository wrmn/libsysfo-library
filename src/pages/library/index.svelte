<script>
  import { Page, Block, Row, Col, Button, BlockTitle } from "framework7-svelte";
  import { userData } from "../../js/store";
  import { Map } from "@beyonk/svelte-mapbox";

  import ReportPopup from "../../components/popupComponent/reportPopup.svelte";
  import MainHeader from "../../components/mainComponent/mainHeader.svelte";
  import Gallery from "../../components/otherComponent/gallery.svelte";
  import Marker from "./map/_Marker.svelte";
  import LibraryImage from "../../components/inputComponent/libraryImage.svelte";
  import LibraryGeneral from "../../components/inputComponent/libraryGeneral.svelte";

  const mapboxToken = import.meta.env.VITE_MAPBOX_KEY;
  let mapComponent;
  let markerComponent;
  let zoom = 11.5;
  let center = { lat: -0.9345808, lng: 100.37 };

  let generalEdit,
    popupEditImage = false;
</script>

<ReportPopup bind:popupOpened={popupEditImage}>
  <span slot="form">
    <LibraryImage />
  </span>
</ReportPopup>

<Page name="library">
  <MainHeader />
  <BlockTitle>General</BlockTitle>
  <Block strong>
    {#if !generalEdit}
      <Row>
        <Col width={100} medium={50}>
          <div
            class="img-main"
            on:click={() => {
              popupEditImage = !popupEditImage;
            }}
          >
            <img
              src={$userData.libraryImage}
              alt=""
              width="100%"
              class="lib-hero-image"
            />
            <h1 class="centered">Edit Image</h1>
          </div>
        </Col>
        <Col width={100} medium={50}>
          <h1 class="make-capital">
            {$userData.libraryName}
          </h1>
          <a round class="link external" href={$userData.webpage}>
            {$userData.webpage}
          </a>
          <h3>
            {$userData.libraryAddress}
          </h3>
          {$userData.description}
        </Col>

        <Col width={80} />
        <Col width={20}>
          <Button
            fill
            on:click={() => {
              generalEdit = !generalEdit;
            }}>Edit</Button
          >
        </Col>
      </Row>
    {:else}
      <!--  name, webpage, address, description -->
      <LibraryGeneral bind:generalEdit />
    {/if}
  </Block>
  <BlockTitle>Gallery</BlockTitle>
  <Block strong>
    <Row>
      <Col width={60} />
      <Col width={40}>
        <Button fill>Edit Gallery</Button>
      </Col>
    </Row>
    <br />
    <Gallery photos={$userData.contentImages} />
  </Block>

  <div
    on:mouseenter={() => {
      mapComponent.resize();
      mapComponent.flyTo({
        center: $userData.coordinate,
        zoom: 13,
      });
      markerComponent.refreshMarker();
    }}
  >
    <BlockTitle>Location</BlockTitle>
    <Block strong>
      <Row>
        <Col width={60} />
        <Col width={40}>
          <Button fill>Edit Location</Button>
        </Col>
      </Row>
      <div class="map-wrap">
        <!-- NOTE: enable this code to show map -->
        <!-- <Map
          bind:this={mapComponent}
          accessToken={mapboxToken}
          style="mapbox://styles/warmoa/cl3wwp1qa000414mqrf1cx8b4"
          {center}
          bind:zoom
        >
          <Marker marker={$userData.coordinate} bind:this={markerComponent} />
        </Map> -->
      </div>
    </Block>
  </div>
</Page>

<style>
  .lib-hero-image {
    height: 50vh;
    max-height: 500px;
    width: 100%;
    object-fit: scale-down;
    object-position: center;
  }

  .lib-hero-image:hover {
    filter: saturate(0%) brightness(50%);
  }

  .map-wrap {
    width: 100%;
    height: 70vh;
  }
  .centered {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
  }

  .img-main:hover {
    color: rgba(255, 255, 255, 1);
    cursor: pointer;
  }
  .img-main {
    position: relative;
    transition: 500ms linear;
    text-align: center;
    color: rgba(0, 0, 0, 0);
  }
</style>
