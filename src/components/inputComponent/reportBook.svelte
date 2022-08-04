<script>
  import {
    ListItem,
    List,
    ListInput,
    BlockTitle,
    f7,
    Button,
    AccordionContent,
    Preloader,
  } from "framework7-svelte";
  import { onMount } from "svelte";
  import { getReport } from "../../js/api";
  import { getCollections } from "../../js/api/collection";
  import { categories } from "../../js/storeTable";
  import { collectionSearchList } from "../../js/store";
  import { isoToDmy } from "../../js/utility";

  let calendarRange,
    dateInput,
    category,
    timeFilter = [new Date("05/08/2017"), new Date()],
    all = true;

  let keyword,
    searchState,
    searching = false,
    bookid;

  const timeData = ["from", "to"];

  onMount(() => {
    calendarRange = f7.calendar.create({
      inputEl: "#demo-calendar-range",
      dateFormat: { day: "2-digit", month: "long", year: "numeric" },
      rangePicker: true,
      on: {
        close: () => {
          timeFilter = calendarRange.getValue();
        },
      },
    });
  });

  const actionBooks = () => {
    var query = new URLSearchParams();
    let path = "book?";
    timeFilter.forEach((e, i) => {
      query.append(timeData[i], isoToDmy(e, "yyyymmdd"));
    });
    if (!all) {
      category
        .smartSelectInstance()
        .getValue()
        .forEach((e) => {
          query.append("category", e);
        });
    }
    dateInput.value = "";
    all = true;
    timeFilter = [new Date("05/08/2017"), new Date()];

    getReport(`${path}${query.toString()}`);
  };

  const actionBook = () => {
    getReport(`book/${bookid}`);
  };
</script>

<List accordionList>
  <ListItem accordionItem title="Multiple Books" accordionItemOpened>
    <AccordionContent>
      <List>
        <BlockTitle>Category</BlockTitle>
        <ListItem
          radio
          radioIcon="start"
          title="All"
          value="All"
          name="categories-radio"
          bind:checked={all}
          on:change={() => {
            all = !all;
          }}
        />
        <ListItem
          radio
          radioIcon="start"
          title="Specific"
          value="Specific"
          name="categories-radio"
          on:change={() => {
            all = !all;
          }}
        />
        <ListItem
          title="Category"
          smartSelect
          bind:disabled={all}
          bind:this={category}
          smartSelectParams={{
            openIn: "popup",
            searchbar: true,
            searchbarPlaceholder: "Search Category",
          }}
        >
          <select name="category" multiple value={[""]}>
            {#each categories as bookCategory}
              <option value={bookCategory}>{bookCategory}</option>
            {/each}
          </select>
        </ListItem>
        <BlockTitle>Date Created</BlockTitle>
        <div class="list no-hairlines-md inline-labels">
          <div class="item-content item-input">
            <div class="item-inner">
              <div class="item-title item-label">Date</div>
              <div class="item-input-wrap">
                <input
                  type="text"
                  placeholder="Select date range"
                  bind:this={dateInput}
                  readonly="readonly"
                  id="demo-calendar-range"
                />
                <span
                  class="input-clear-button"
                  on:click={() => {
                    timeFilter = [new Date("05/08/2017"), new Date()];
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <Button fill on:click={actionBooks}>Get Report</Button>
      </List>
    </AccordionContent>
  </ListItem>
  <ListItem accordionItem title="Single Book">
    <AccordionContent>
      <List noHairlinesMd>
        <ListInput
          label="Book"
          floatingLabel
          type="text"
          placeholder="Book Title or serial number"
          bind:value={keyword}
          on:blur={() => {
            setTimeout(function () {}, 200);
          }}
          on:focus={() => {
            setTimeout(function () {}, 200);
          }}
          on:input={() => {
            bookid = undefined;
            searching = true;
            clearTimeout(searchState);
            searchState = setTimeout(async () => {
              searching = false;
              if (typeof keyword == "string" && keyword.length > 0) {
                collectionSearchList.set(await getCollections(keyword));
              } else {
              }
              console.log(keyword);
            }, 1000);
          }}
        />
        <ListItem>
          <List mediaList>
            {#if searching}
              <ListItem>
                <Preloader color="multi" />
              </ListItem>
            {:else}
              {#each $collectionSearchList as b}
                <ListItem
                  link="#"
                  title={b.title}
                  subtitle={b.author}
                  text={b.status.sn}
                  on:click={() => {
                    bookid = b.id;
                    keyword = b.status.sn;
                    collectionSearchList.set([]);
                  }}
                >
                  <img slot="media" src={b.image} width="80" alt="" />
                </ListItem>
              {/each}
            {/if}
          </List>
        </ListItem>
        <Button fill on:click={actionBook}>Get Report</Button>
      </List>
    </AccordionContent>
  </ListItem>
</List>
