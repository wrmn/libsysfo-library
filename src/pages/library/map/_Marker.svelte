<script>
  import { getContext } from "svelte";
  import { contextKey } from "@beyonk/svelte-mapbox";

  export let marker = [0, 0];

  const { getMap, getMapbox } = getContext(contextKey);
  const map = getMap();
  const mapbox = getMapbox();
  const srcPoint = new mapbox.Marker();
  srcPoint.setLngLat(marker).addTo(map);

  export const refreshMarker = () => {
    srcPoint.setLngLat(marker);
  };
</script>
