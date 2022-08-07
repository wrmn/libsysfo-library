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
    Button,
    Searchbar,
    Link,
    theme,
  } from "framework7-svelte";
  import { onMount } from "svelte";
  import { getCollections } from "../../js/api/collection";
  import { booksList } from "../../js/store";
  import { bookStatus } from "../../js/storeTable";
  import { capitalize } from "../../js/utility";

  onMount(async () => {
    f7.dialog.preloader();
    booksList.set(await getCollections());
    if ($booksList.length < 1) {
      f7.dialog.alert("No book collection found", "");
    }
    f7.dialog.close();
  });
</script>

<Page>
  <Navbar backLink="Back" backLinkUrl="/book/" backLinkForce>
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
  {#if $booksList.length < 1}
    <h1>Add Book Collection</h1>

    <Button
      fill
      iconIos="f7:plus"
      iconAurora="f7:plus"
      iconMd="material:add"
      tooltip="New Collection"
      href="/book/add/"
    />
  {/if}
  <List mediaList class="search-list searchbar-found">
    {#each $booksList as book}
      <ListItem
        header={book.status.sn}
        title={capitalize(book.title)}
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
