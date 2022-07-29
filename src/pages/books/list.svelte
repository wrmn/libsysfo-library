<script>
  import {
    Page,
    Navbar,
    NavRight,
    NavTitle,
    List,
    ListItem,
    Badge,
    f7,
    Searchbar,
    Link,
    theme,
  } from "framework7-svelte";
  import { onMount } from "svelte";
  import { getCollections } from "../../js/api/collection";
  import { booksList } from "../../js/store";
  import { bookStatus } from "../../js/storeTable";

  f7.dialog.preloader();

  onMount(async () => {
    booksList.set(await getCollections());
    f7.dialog.close();
  });
</script>

<Page>
  <Navbar backLink="Back" backLinkUrl="/">
    <NavTitle class="make-capital">Book Collection</NavTitle>
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
        href="/book/add/"
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
  <List class="searchbar-not-found">
    <ListItem title="Nothing found" />
  </List>
  <List mediaList class="search-list searchbar-found">
    {#each $booksList as book}
      <ListItem
        header={book.status.sn}
        title={book.title.replace(/\w\S*/g, (w) =>
          w.replace(/^\w/, (c) => c.toUpperCase())
        )}
        link={`/book/detail/${book.id}/`}
        popupClose
        subtitle={book.category}
        text={book.description}
      >
        <div class="item-stats">
          <Badge
            color={book.status.availability == 1
              ? "green"
              : book.status.availability == 2
              ? "blue"
              : "red"}
            tooltip="Availability"
          />
          {book.status.availability == 1
            ? "Available"
            : book.status.availability == 2
            ? "Read Only"
            : "Not Available"}
          <Badge
            color={bookStatus[book.status.status].color}
            tooltip="Condition"
          />
          {bookStatus[book.status.status].text}
        </div>
        <img slot="media" src={book.image} width="80" alt="" />
      </ListItem>
    {/each}
  </List>
</Page>
