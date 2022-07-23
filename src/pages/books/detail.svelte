<script>
  import {
    f7,
    Block,
    BlockTitle,
    Page,
    Navbar,
    Badge,
    Row,
    Col,
    List,
    ListItem,
    Preloader,
    Button,
  } from "framework7-svelte";
  import { onMount } from "svelte";
  import {
    getCollections,
    getCollection,
    updateCollection,
  } from "../../js/api/collection";
  import { collectionData, booksList } from "../../js/store";
  import {
    bookDetailTable,
    collectionDetailTable,
    bookStatus,
    bookAvailability,
  } from "../../js/storeTable";

  let edit = false;
  const collection = {
    status: 1,
    availability: 1,
  };

  export let f7route;
  export let f7router;
  let id, condition, availability;

  f7.dialog.preloader();
  onMount(async () => {
    id = f7route.params["id"];
    collectionData.set(await getCollection(id));
    f7.dialog.close();
    collection.status = $collectionData.collection.status;
    collection.availability = $collectionData.collection.availability;
  });
</script>

<Page>
  {#if $collectionData.book}
    <Navbar
      title={$collectionData.book.title
        ? $collectionData.book.title
        : "Book Detail"}
      backLink="Back"
      onBackClick={() => f7router.back()}
    />
    <Block strong>
      {#if edit}
        <Row>
          <Col width={70}>
            <List>
              <ListItem
                title="Status"
                smartSelect
                bind:this={condition}
                smartSelectParams={{ openIn: "popover" }}
              >
                <select
                  name="status"
                  value={`${collection.status}`}
                  on:change={() => {
                    condition.smartSelectInstance().close();
                    collection.status = parseInt(
                      condition.smartSelectInstance().getValue()
                    );
                  }}
                >
                  {#each Object.keys(bookStatus) as key}
                    <option value={key}>{bookStatus[key].text}</option>
                  {/each}
                </select>
              </ListItem>

              <ListItem
                title="Availability"
                smartSelect
                bind:this={availability}
                smartSelectParams={{ openIn: "popover" }}
              >
                <select
                  name="status"
                  value={`${collection.availability}`}
                  on:change={() => {
                    availability.smartSelectInstance().close();
                    collection.availability = parseInt(
                      availability.smartSelectInstance().getValue()
                    );
                  }}
                >
                  {#each Object.keys(bookAvailability) as key}
                    <option value={key}>{bookAvailability[key].text}</option>
                  {/each}
                </select>
              </ListItem>
            </List>
          </Col>
          <Col width={30}>
            <Button
              fill
              iconF7="arrow_down_square"
              on:click={() => {
                f7.dialog.alert("save changes?", "", async () => {
                  const resp = await updateCollection(id, collection);
                  if (resp.status == 200) {
                    booksList.set(await getCollections());
                    collectionData.set(await getCollection(id));
                    edit = false;
                  }
                });
              }}>Save</Button
            >
          </Col>
        </Row>
      {:else}
        <Row>
          <Col width={60}>
            <table>
              <thead>
                {#each $collectionDetailTable as d}
                  <tr>
                    <td width={50} class="label-cell">{d.Title}</td>
                    <td width={20} class="numeric-cell">:</td>
                    <td class="numeric-cell">
                      {#if $collectionData.collection[d.data]}
                        <Badge
                          color={d.stats[$collectionData.collection[d.data]]
                            .color}
                          tooltip={d.data}
                        />
                        {d.stats[$collectionData.collection[d.data]].text}
                      {/if}
                    </td>
                  </tr>
                {/each}
              </thead>
            </table>
          </Col>
          <Col width={40}>
            <Button
              fill
              iconF7="square_pencil"
              on:click={() => {
                edit = true;
              }}>Edit Status</Button
            >
          </Col>
        </Row>
      {/if}
      <Row>
        <Col width={100} medium={30}>
          <img
            src={$collectionData.book.image
              ? $collectionData.book.image
              : "https://dummyimage.com/600x400/ababab/0011ff"}
            alt=""
            width="100%"
            class="lib-hero-image"
          />
        </Col>
        <Col width={100} medium={70} class="make-capital">
          <h1>
            {$collectionData.book.title}
          </h1>
          <h3>
            {$collectionData.book.category ? $collectionData.book.category : ""}
          </h3>
          {#if $collectionData.book.source == "gramedia"}
            <a
              round
              class="link external"
              href={`https://ebooks.gramedia.com/books/${$collectionData.book.slug}`}
            >
              {$collectionData.book.source}
            </a>
          {:else}
            {$collectionData.book.source}
          {/if}
          <table>
            <thead>
              {#each $bookDetailTable as d}
                <tr>
                  <td width={150} class="label-cell">{d.Title}</td>
                  <td width={20} class="numeric-cell">:</td>
                  <td class="numeric-cell"
                    >{$collectionData.book[d.data]
                      ? $collectionData.book[d.data]
                      : "-"}</td
                  >
                </tr>
              {/each}
            </thead>
          </table>
        </Col>
      </Row>
      <BlockTitle>Abstract</BlockTitle>

      <Block>
        {$collectionData.book.description}
      </Block>
    </Block>
  {:else}
    <Navbar
      title="Loading..."
      backLink="Back"
      onBackClick={() => f7router.back()}
    />
    <Block strong class="text-align-center">
      <Preloader color="multi" />
    </Block>
  {/if}
</Page>

<style>
  .lib-hero-image {
    height: 50vh;
    max-height: 500px;
    width: 100%;
    object-fit: contain;
    object-position: center;
  }
</style>
