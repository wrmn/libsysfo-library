<script>
  import {
    Page,
    Navbar,
    NavTitle,
    Badge,
    Link,
    List,
    ListItem,
    NavRight,
    Searchbar,
    theme,
    CardContent,
    Card,
    f7,
  } from "framework7-svelte";
  import { getPapers } from "../../js/api/paper";
  import { papersList } from "../../js/store";
  import { onMount } from "svelte";
  import { capitalize } from "../../js/utility";

  onMount(async () => {
    f7.dialog.preloader();
    papersList.set(await getPapers());
    f7.dialog.close();
  });
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
      searchIn=".item-title, .item-subtitle, .item-type"
      class="searchbar-demo"
      disableButton={!theme.aurora}
      expandable
    />
  </Navbar>
  <Card>
    <CardContent>
      <List class="searchbar-not-found">
        <ListItem title="Nothing found" />
      </List>
      <List class="search-list searchbar-found" mediaList>
        {#each $papersList as paper}
          <ListItem
            title={capitalize(paper.title)}
            link={`/paper/detail/${paper.id}/`}
            popupClose
            subtitle={capitalize(paper.type)}
            text={capitalize(paper.subject.join(", "))}
          >
            {#if paper.access}
              <div class="item-stats">
                <Badge color="green" tooltip="Availability" />
                Accessible
              </div>
            {/if}
          </ListItem>
        {/each}
      </List>
    </CardContent>
  </Card>
</Page>
