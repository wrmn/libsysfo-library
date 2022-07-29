<script>
  import {
    Page,
    Navbar,
    NavTitle,
    Link,
    NavRight,
    Searchbar,
    theme,
  } from "framework7-svelte";
</script>

<Page>
  <Navbar backLink="Back" backLinkUrl="/paper/" backLinkForce>
    <NavTitle class="make-capital">Paper Collection</NavTitle>
    <NavRight>
      <Link
        searchbarEnable=".searchbar-demo"
        iconIos="f7:search"
        iconAurora="f7:search"
        iconMd="material:search"
        tooltip="Search"
      />
      <Link
        iconIos="f7:plus"
        iconAurora="f7:plus"
        iconMd="material:add"
        tooltip="New Collection"
        href="/paper/add/"
      />
    </NavRight>

    <Searchbar
      searchContainer=".search-list"
      searchIn=".item-title, .item-subtitle, .item-text, .item-stats, .item-header"
      class="searchbar-demo"
      disableButton={!theme.aurora}
      expandable
    />
  </Navbar>
  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odio exercitationem facere
  dolores, qui nemo repellat vero dolor aspernatur quas enim maiores recusandae possimus
  sunt voluptates voluptatem aut nesciunt laudantium modi.
</Page>
