<script>
  import {
    f7,
    Block,
    Page,
    Navbar,
    Badge,
    Row,
    Col,
    Card,
    CardHeader,
    CardContent,
    List,
    ListInput,
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
  import { userBorrow } from "../../js/api/user";
  import { collectionData, booksList } from "../../js/store";
  import {
    bookDetailTable,
    collectionDetailTable,
    bookStatus,
    bookAvailability,
  } from "../../js/storeTable";

  import Borrow from "../../components/otherComponent/borrow.svelte";

  let edit = false;
  const collection = {
    sn: "",
    status: 1,
    availability: 1,
  };

  export let f7router;
  export let id;
  let condition, availability;

  onMount(async () => {
    f7.dialog.preloader();

    collectionData.set({});
    collectionData.set(await getCollection(id));
    f7.dialog.close();
    collection.sn = $collectionData.collection.sn;
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
      backLink
      backLinkForce
      backLinkUrl="/book/list/"
    />
    <Row>
      <Col width={100} medium={50}>
        <Card class="demo-card-header-pic">
          <CardHeader valign="bottom">Collection Information</CardHeader>
          <CardContent>
            {#if edit}
              <Row>
                <Col width={70}>
                  <List>
                    <ListInput
                      label="Serial Number"
                      type="text"
                      placeholder="Serial number"
                      bind:value={collection.sn}
                    />
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
                          <option value={key}
                            >{bookAvailability[key].text}</option
                          >
                        {/each}
                      </select>
                    </ListItem>
                  </List>
                </Col>
                <Col width={30}>
                  <Button
                    fill
                    on:click={() => {
                      f7.dialog.confirm("save changes?", "", async () => {
                        const resp = await updateCollection(id, collection);
                        if (resp.status == 200) {
                          booksList.set(await getCollections());
                          collectionData.set(await getCollection(id));
                          edit = false;
                        }
                      });
                    }}>Save</Button
                  >
                  <Button
                    on:click={() => {
                      edit = false;
                    }}>cancel</Button
                  >
                </Col>
              </Row>
            {:else}
              <Row>
                <Col width={70}>
                  <table>
                    <thead>
                      {#each $collectionDetailTable as d}
                        <tr>
                          <td class="label-cell">{d.Title}</td>
                          <td width={20} class="numeric-cell">:</td>
                          <td class="numeric-cell">
                            {#if $collectionData.collection[d.data]}
                              {#if d.stats}
                                <Badge
                                  color={d.stats[
                                    $collectionData.collection[d.data]
                                  ].color}
                                  tooltip={d.data}
                                />
                                {d.stats[$collectionData.collection[d.data]]
                                  .text}
                              {:else}
                                {$collectionData.collection[d.data]}
                              {/if}
                            {/if}
                          </td>
                        </tr>
                      {/each}
                    </thead>
                  </table>
                </Col>
                <Col width={30}>
                  <Button
                    fill
                    on:click={() => {
                      edit = true;
                    }}>Edit Status</Button
                  >
                </Col>
              </Row>
            {/if}
          </CardContent>
        </Card>
        <Card class="demo-card-header-pic">
          <CardHeader valign="bottom">Book Information</CardHeader>
          <CardContent>
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
                  {$collectionData.book.category
                    ? $collectionData.book.category
                    : ""}
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
          </CardContent>
        </Card>

        <Card class="demo-card-header-pic">
          <CardHeader valign="bottom">Book Abstract</CardHeader>
          <CardContent>
            {$collectionData.book.description}
          </CardContent>
        </Card>
      </Col>
      <Col width={100} medium={50}>
        <Card class="demo-card-header-pic">
          <CardHeader valign="bottom">Alternative Collection</CardHeader>
          <CardContent>
            {#if $collectionData.alternativeCollection && $collectionData.alternativeCollection.length > 0}
              <table width="100%">
                <thead>
                  <tr>
                    {#each $collectionDetailTable as d}
                      <th class="label-cell">{d.Title}</th>
                    {/each}
                  </tr>
                  {#each $collectionData.alternativeCollection as c}
                    <tr>
                      {#each $collectionDetailTable as d}
                        <th class="label-cell">
                          {#if c[d.data]}
                            {#if d.stats}
                              <Badge
                                color={d.stats[c[d.data]].color}
                                tooltip={d.data}
                              />
                              {d.stats[c[d.data]].text}
                            {:else}
                              {c[d.data]}
                            {/if}
                          {/if}
                        </th>
                      {/each}
                      <th>
                        <Button
                          on:click={() => {
                            f7.dialog.preloader();
                            f7router.back();
                            setTimeout(function () {
                              f7router.navigate(`/book/detail/${c.id}/`);
                              f7.dialog.close();
                            }, 500);
                          }}>View Collection</Button
                        >
                      </th>
                    </tr>
                  {/each}
                </thead>
              </table>
            {:else}
              No Alternative Collection Found
            {/if}
          </CardContent>
        </Card>
        <Card class="demo-card-header-pic">
          <CardHeader class="no-border" valign="bottom">
            Borrow History
          </CardHeader>
          <CardContent>
            {#if $collectionData.borrow && $collectionData.borrow.length > 0}
              <Borrow
                callApi={userBorrow($collectionData.borrow)}
                viewBook={false}
                bind:f7router
              />
            {:else}
              There is no borrow yet
            {/if}
          </CardContent>
        </Card>
      </Col>
    </Row>
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
