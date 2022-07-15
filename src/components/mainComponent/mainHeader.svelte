<script>
  import { Navbar, NavLeft, Link, NavTitle } from "framework7-svelte";
  import { userData } from "../../js/store";
</script>

<Navbar>
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
</Navbar>
