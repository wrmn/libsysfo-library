<script>
  import { Page, Block, Row, Col, Button, BlockTitle } from "framework7-svelte";
  import { userData } from "../../js/store";
  import { Map } from "@beyonk/svelte-mapbox";

  import MainHeader from "../../components/mainComponent/mainHeader.svelte";
  import Gallery from "../../components/menuComponent/gallery.svelte";
  import Marker from "./map/_Marker.svelte";

  const mapboxToken = import.meta.env.VITE_MAPBOX_KEY;
  let mapComponent;
  let zoom = 11.5;
  let center = { lat: -0.9345808, lng: 100.37 };
</script>

<Page name="library">
  <MainHeader />
  <BlockTitle>General</BlockTitle>
  <Block strong>
    <Row>
      <Col width={100} medium={50}>
        <img
          src={$userData.libraryImage}
          alt=""
          width="100%"
          class="lib-hero-image"
        />
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
    </Row>
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
        <Map
          bind:this={mapComponent}
          accessToken={mapboxToken}
          style="mapbox://styles/warmoa/cl3wwp1qa000414mqrf1cx8b4"
          {center}
          bind:zoom
        >
          <Marker marker={$userData.coordinate} />
        </Map>
      </div>
    </Block>
  </div>
</Page>

<style>
  .lib-hero-image {
    height: 50vh;
    max-height: 500px;
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
  .map-wrap {
    width: 100%;
    height: 70vh;
  }
</style>
