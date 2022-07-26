<script>
  import {
    Page,
    Navbar,
    List,
    ListInput,
    ListItem,
    f7,
    Fab,
    Icon,
    Block,
    Row,
    Col,
    Preloader,
    Button,
  } from "framework7-svelte";
  import {
    searchBooks,
    getBook,
    newCollection,
    getCollections,
  } from "../../js/api/collection";
  import { booksSearchList, bookResult, booksList } from "../../js/store";
  import { bookDetailTable, bookAvailability } from "../../js/storeTable";
  import BookInput from "../../components/inputComponent/book.svelte";
  import { onMount } from "svelte";

  let isHide = true;
  let searching = false;
  let addingBook = false;
  let keyword, searchState, availability, bookForm;
  let collectionCount = 1;
  let collection = [{ sn: "", availability: 1 }];

  onMount(() => {
    booksSearchList.set([]);
    bookResult.set({});
    collectionCount = 1;
    collection = [{ sn: "", availability: 1 }];
  });

  const reqSuccess = async () => {
    booksList.set(await getCollections());
    booksSearchList.set([]);
    bookResult.set({});
    collectionCount = 1;
    collection = [{ sn: "", availability: 1 }];
  };
</script>

<Page>
  <Navbar title="Add New Book Collection" backLink="Back" />
  <List noHairlinesMd>
    {#if !addingBook}
      <ListInput
        type="text"
        placeholder="Keyword"
        info="Search book here"
        bind:value={keyword}
        clearButton
        on:blur={() => {
          setTimeout(function () {
            isHide = true;
          }, 200);
        }}
        on:focus={() => {
          setTimeout(function () {
            isHide = false;
          }, 200);
        }}
        on:input={() => {
          booksSearchList.set([]);
          isHide = false;
          searching = true;
          clearTimeout(searchState);
          searchState = setTimeout(async () => {
            searching = false;
            if (typeof keyword == "string" && keyword.length > 0) {
              booksSearchList.set(await searchBooks(keyword));
            } else {
              isHide = true;
            }
          }, 1000);
        }}
      />
    {/if}
  </List>
  <div class:hide={isHide} class="list-container">
    <List mediaList>
      {#if searching}
        <ListItem>
          <Preloader color="multi" />
        </ListItem>
      {:else}
        {#each $booksSearchList as b}
          <ListItem
            link="#"
            title={b.title}
            subtitle={b.author}
            on:click={async () => {
              f7.dialog.preloader();
              bookResult.set(await getBook(b.slug));
              f7.dialog.close();
              isHide = true;
            }}
          >
            <img slot="media" src={b.image} width="80" alt="" />
          </ListItem>
        {/each}
        {#if typeof keyword == "string" && keyword.length > 0}
          <ListItem
            title="Add new"
            link="#"
            on:click={() => {
              addingBook = true;
              bookResult.set({});
            }}
          >
            <Icon slot="media" f7="plus" />
          </ListItem>
        {/if}
      {/if}
    </List>
  </div>
  <Row>
    <Col width={100} medium={50}>
      <Block strong>
        {#if $bookResult.image}
          <h2>Book Description</h2>

          <Row>
            <Col width={100} medium={30}>
              <img
                src={$bookResult.image}
                alt=""
                width="100%"
                class="lib-hero-image"
              />
            </Col>
            <Col width={100} medium={70} class="make-capital">
              <h1>
                {$bookResult.title ? $bookResult.title : ""}
              </h1>
              <h3>
                {$bookResult.category}
              </h3>
              <table>
                <thead>
                  {#each $bookDetailTable as d}
                    <tr>
                      <td width={150} class="label-cell">{d.Title}</td>
                      <td width={20} class="numeric-cell">:</td>
                      <td class="numeric-cell"
                        >{$bookResult[d.data] ? $bookResult[d.data] : "-"}</td
                      >
                    </tr>
                  {/each}
                </thead>
              </table>
            </Col>
          </Row>
          <Row>
            {$bookResult.description}
          </Row>
        {:else if addingBook}
          <Row>
            <Col width={80}>
              <h2>New Book</h2>
            </Col>
            <Col width={10}>
              <Button
                iconF7="xmark"
                tooltip="cancel"
                on:click={() => {
                  keyword = "";
                  addingBook = false;
                }}
              />
            </Col>
          </Row>
          <BookInput bind:this={bookForm} />
        {:else}
          Search book title or input new book
        {/if}
      </Block>
    </Col>
    <Col width={100} medium={50}>
      <Block strong>
        <Row>
          <Col width={80}>
            <h2>Library Collection</h2>
          </Col>
          <Col width={10}>
            <Button
              iconF7="plus"
              fill
              on:click={() => {
                collectionCount += 1;
                collection.push({ sn: "", availability: 1 });
              }}
            />
          </Col>
          <Col width={10}>
            {#if collectionCount > 1}
              <Button
                iconF7="minus"
                on:click={() => {
                  if (collectionCount > 1) {
                    collectionCount -= 1;
                    collection.pop();
                  }
                }}
              />
            {/if}
          </Col>
        </Row>
        <List>
          {#each Array(collectionCount) as _, i}
            {i + 1}
            <ListInput
              label="Serial Number"
              type="text"
              placeholder="Serial Number"
              bind:value={collection[i].sn}
            />
            <ListItem
              title="Availability"
              smartSelect
              bind:this={availability}
              smartSelectParams={{ openIn: "popover" }}
            >
              <select
                name="status"
                value={`${collection[i].availability}`}
                on:change={() => {
                  availability.smartSelectInstance().close();
                  collection[i].availability = parseInt(
                    availability.smartSelectInstance().getValue()
                  );
                }}
              >
                {#each Object.keys(bookAvailability) as key}
                  <option value={key}>{bookAvailability[key].text}</option>
                {/each}
              </select>
            </ListItem>
          {/each}
        </List>
      </Block>
    </Col>
  </Row>
  <Fab
    position="center-bottom"
    text="Save"
    on:click={() => {
      f7.dialog.alert("save changes?", "", async () => {
        let state = true;
        collection.forEach((e) => {
          if (e.sn.length < 1) {
            state = false;

            f7.dialog.alert("serial number can't be empty", "");
          }
        });
        if (state && collection.length >= 1) {
          if (addingBook) {
            const bookData = bookForm.getData();
            let msg = [];
            Object.keys(bookData).forEach((key) => {
              if (bookData[key] == "" || bookData[key] == 0) {
                msg.push(key);
              }
            });
            if (msg.length > 0) {
              const fields = msg.join(", ");
              f7.dialog.alert(`${fields} can't be empty`);
            } else {
              f7.dialog.preloader();

              const resp = await newCollection({
                book: bookData,
                collection,
              });

              if (resp.status && resp.status == 200) {
                reqSuccess();
              }
            }
          } else if ($bookResult.slug) {
            f7.dialog.preloader();

            const resp = await newCollection({
              slug: $bookResult.slug,
              collection,
            });
            if (resp.status && resp.status == 200) {
              reqSuccess();
            }
          } else {
            f7.dialog.close();
            f7.dialog.alert("Please select book", "");
            return;
          }

          f7.dialog.close();
        }
      });
    }}
  >
    <Icon f7="arrow_down_square" />
  </Fab>
</Page>

<style>
  .list-container {
    padding-left: 30px;
    margin-top: -60px;
    height: 300px;
    position: absolute;
    z-index: 99;
    overflow: auto;
  }

  .hide {
    visibility: hidden;
  }
</style>
