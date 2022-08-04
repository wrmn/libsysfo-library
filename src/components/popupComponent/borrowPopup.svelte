<script>
  import { Popup, Page, Navbar, NavRight, Link } from "framework7-svelte";

  export let popupOpened = false;
</script>

<Popup
  class="demo-popup"
  opened={popupOpened}
  onPopupClosed={() => (popupOpened = false)}
>
  <Page>
    <Navbar title="Koleksi Buku">
      <NavRight>
        <Link popupClose iconF7="xmark" iconSize="35px" />
      </NavRight>
    </Navbar>
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur nihil deserunt
    vitae ipsum adipisci velit ullam accusantium tempora totam nam natus, possimus
    ipsam porro aspernatur odio dignissimos dolore incidunt ab?
  </Page>
</Popup>
