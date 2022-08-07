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
  import { getPapers } from "../../js/api/paper";
  import { paperSearchList } from "../../js/store";
  import { isoToDmy } from "../../js/utility";

  let calendarRange,
    dateInput,
    category,
    timeFilter = [new Date("05/08/2017"), new Date()],
    all = true;

  let keyword,
    searchState,
    searching = false,
    paperid;

  const timeData = ["from", "to"];

  onMount(() => {
    calendarRange = f7.calendar.create({
      inputEl: "#paper-range",
      dateFormat: { day: "2-digit", month: "long", year: "numeric" },
      rangePicker: true,
      on: {
        close: () => {
          timeFilter = calendarRange.getValue();
        },
      },
    });
  });

  const actionPapers = () => {
    var query = new URLSearchParams();
    let path = "paper?";
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

  const actionPaper = () => {
    if (paperid) {
      getReport(`paper/${paperid}`);
    } else {
      f7.dialog.alert("please select paper", "");
    }
  };
</script>

<List accordionList>
  <ListItem accordionItem title="Multiple Papers" accordionItemOpened>
    <AccordionContent>
      <List>
        <BlockTitle>Category</BlockTitle>
        <ListItem
          radio
          radioIcon="start"
          title="All"
          name="categories-radio"
          on:change={() => {
            all = true;
          }}
        />
        <ListItem
          radio
          radioIcon="start"
          title="Specific"
          name="categories-radio"
          on:change={() => {
            all = false;
          }}
        />
        <ListItem
          title="Category"
          smartSelect
          bind:disabled={all}
          bind:this={category}
          smartSelectParams={{
            openIn: "popover",
          }}
        >
          <select name="category" multiple value={[""]}>
            <option value="thesis">Thesis</option>
            <option value="journal">Journal</option>
            <option value="other document">Other Document</option>
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
                  id="paper-range"
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
        <Button fill on:click={actionPapers}>Get Report</Button>
      </List>
    </AccordionContent>
  </ListItem>
  <ListItem accordionItem title="Single paper">
    <AccordionContent>
      <List noHairlinesMd>
        <ListInput
          label="Paper"
          floatingLabel
          type="text"
          placeholder="Title keyword"
          bind:value={keyword}
          on:blur={() => {
            setTimeout(function () {}, 200);
          }}
          on:focus={() => {
            setTimeout(function () {}, 200);
          }}
          on:input={() => {
            paperid = undefined;
            searching = true;
            clearTimeout(searchState);
            searchState = setTimeout(async () => {
              searching = false;
              if (typeof keyword == "string" && keyword.length > 0) {
                paperSearchList.set(await getPapers(keyword));
              } else {
              }
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
              {#each $paperSearchList as b}
                <ListItem
                  title={`${b.title}`}
                  subtitle={b.type}
                  link="#"
                  on:click={() => {
                    paperid = b.id;
                    keyword = b.title;
                    paperSearchList.set([]);
                  }}
                />
              {/each}
            {/if}
          </List>
        </ListItem>
        <Button fill on:click={actionPaper}>Get Report</Button>
      </List>
    </AccordionContent>
  </ListItem>
</List>
