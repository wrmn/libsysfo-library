<script>
  import { Navbar, NavRight, NavLeft, Link, NavTitle } from "framework7-svelte";
  import { notificationCount, userData } from "../../js/store";
</script>

<Navbar sliding={false}>
  <NavLeft>
    <Link
      iconIos="f7:menu"
      iconAurora="f7:menu"
      iconMd="material:menu"
      panelOpen="left"
    />
  </NavLeft>
  <NavTitle class="make-capital"
    >{$userData.libraryName ? $userData.libraryName : ""}</NavTitle
  >
  <NavRight>
    <Link
      iconIos="f7:bell_fill"
      iconAurora="f7:bell_fill"
      iconMd="material:notifications"
      badge={$notificationCount}
      badgeColor="red"
      panelOpen="right"
    />
  </NavRight>
</Navbar>
