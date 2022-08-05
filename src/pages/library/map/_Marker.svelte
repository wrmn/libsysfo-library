<script>
  import { getContext } from "svelte";
  import { contextKey } from "@beyonk/svelte-mapbox";
  import { f7 } from "framework7-svelte";
  import { getData } from "../../../js/api/profile";
  import { userData } from "../../../js/store";
  import { updateLocation } from "../../../js/api/library";

  export let editState;

  const { getMap, getMapbox } = getContext(contextKey);
  const map = getMap();
  const mapbox = getMapbox();
  const srcPoint = new mapbox.Marker();
  srcPoint.setLngLat($userData.coordinate).addTo(map);

  export const refreshMarker = () => {
    srcPoint.setLngLat($userData.coordinate);
  };

  map.on("click", (e) => {
    if (editState) {
      const newLocation = [e.lngLat.lng, e.lngLat.lat];
      srcPoint.setLngLat(newLocation);
      f7.dialog.confirm("update location", "", () => {
        f7.dialog.preloader();
        setTimeout(async () => {
          const resp = await updateLocation({ coords: newLocation });
          f7.dialog.close();
          f7.dialog.alert(
            resp.description ? resp.description : "server timeout",
            "",
            async () => {
              if (resp.status && resp.status == 200) {
                getData();
                refreshMarker();
              }
            }
          );
        }, 500);
      });
    }
  });
</script>
