<script>
  import {
    Popup,
    Page,
    Navbar,
    NavRight,
    Link,
    Card,
    CardContent,
  } from "framework7-svelte";

  export let popupOpened = false;
</script>

<Popup
  class="demo-popup"
  opened={popupOpened}
  onPopupClosed={() => (popupOpened = false)}
>
  <Page>
    <Navbar>
      <NavRight>
        <Link popupClose iconF7="xmark" iconSize="35px" />
      </NavRight>
    </Navbar>
    <Card>
      <CardContent>
        <slot name="form" />
      </CardContent>
    </Card>
  </Page>
</Popup>
