<script>
  import {
    Row,
    Col,
    Card,
    CardContent,
    List,
    ListItem,
    AccordionContent,
    Searchbar,
    theme,
    f7,
    Button,
  } from "framework7-svelte";
  import { isoToDmy } from "../../js/utility";
  import { borrowsResult, userDetail } from "../../js/store";
  import { borrowStatus, borrowDetailTable } from "../../js/storeTable";
  import { getUser } from "../../js/api/user";
  import { onMount } from "svelte";
  import UserPopup from "./userPopup.svelte";

  let calendarRange, status, sortCategory;
  let statusFilter = Object.keys(borrowStatus);
  let timeFilter = [new Date("05/08/2017"), new Date()];
  let showResult = [];
  let desc = true;
  let popupOpened = false;
  let field = "title";
  export let callApi;
  export let viewUser = true;

  onMount(async () => {
    f7.dialog.preloader();
    borrowsResult.set(await callApi);
    f7.dialog.close();
    showResult = $borrowsResult;
    calendarRange = f7.calendar.create({
      inputEl: "#demo-calendar-range",
      dateFormat: { day: "2-digit", month: "long", year: "numeric" },
      rangePicker: true,
      on: {
        close: () => {
          timeFilter = calendarRange.getValue();
          resultFilter();
        },
      },
    });
  });

  export const refresh = async (renew) => {
    f7.dialog.preloader();
    borrowsResult.set(await renew);
    f7.dialog.close();
  };

  const resultFilter = () => {
    showResult = $borrowsResult.filter(
      (d) =>
        new RegExp("\\b" + statusFilter.join("\\b|\\b") + "\\b").test(
          d.status
        ) &&
        new Date(d.createdAt).getTime() >= timeFilter[0].getTime() &&
        new Date(d.createdAt).getTime() <=
          timeFilter[1].getTime() + 24 * 60 * 60 * 1000
    );
  };

  const resultSort = () => {
    let sortable = showResult;
    showResult = sortable.sort((a, b) => {
      let fa = a[field],
        fb = b[field];
      if (desc) {
        fa = b[field];
        fb = a[field];
      }
      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });
  };
</script>

<UserPopup bind:popupOpened />

<Card>
  <CardContent>
    <List>
      <Row>
        <Col width={5} />
        <Col width={90}>
          <Searchbar
            searchContainer=".search-list"
            searchIn=".item-title"
            disableButton={!theme.aurora}
          />
        </Col>
        <Col width={5} />

        <Col width={100} medium={33}>
          <Row>
            <Col width={20}>
              <Button
                iconF7="arrow_up_arrow_down"
                on:click={() => {
                  desc = !desc;
                  resultSort();
                }}
              />
            </Col>
            <Col width={80}>
              <ListItem
                title="Sort by"
                bind:this={sortCategory}
                smartSelect
                smartSelectParams={{
                  openIn: "popover",
                  on: {
                    close: () => {
                      field = sortCategory.smartSelectInstance().getValue();
                      resultSort();
                    },
                  },
                }}
              >
                <select
                  name="sort-by"
                  value=""
                  on:change={() => {
                    sortCategory.smartSelectInstance().close();
                  }}
                >
                  <option value="title">Book Title</option>
                  <option value="userName">User</option>
                  <option value="createdAt">Request Date</option>
                  <option value="takedAt">Taked Date</option>
                  <option value="returnedAt">Return Date</option>
                </select>
              </ListItem>
            </Col>
          </Row>
        </Col>

        <Col width={100} medium={33}>
          <ListItem
            title="Status"
            smartSelect
            bind:this={status}
            smartSelectParams={{
              openIn: "popover",
              on: {
                close: () => {
                  statusFilter = status.smartSelectInstance().getValue();
                  resultFilter();
                },
              },
            }}
          >
            <select name="status" multiple value={Object.keys(borrowStatus)}>
              {#each Object.keys(borrowStatus) as k}
                <option value={k}>
                  {k.replace(/\w\S*/g, (w) =>
                    w.replace(/^\w/, (c) => c.toUpperCase())
                  )}
                </option>
              {/each}
            </select>
          </ListItem>
        </Col>
        <Col width={100} medium={33}>
          <div class="list no-hairlines-md inline-labels">
            <div class="item-content item-input">
              <div class="item-inner">
                <div class="item-title item-label">Date</div>
                <div class="item-input-wrap">
                  <input
                    type="text"
                    placeholder="Select date range"
                    readonly="readonly"
                    id="demo-calendar-range"
                  />
                  <span
                    class="input-clear-button"
                    on:click={() => {
                      timeFilter = [new Date("05/08/2017"), new Date()];
                      resultFilter();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </List>
  </CardContent>
</Card>
<Card>
  <CardContent>
    <div class="data-table make-capital">
      {#if $borrowsResult.length == 0}
        There is no borrow data yet.
      {:else}
        <List class="searchbar-not-found">
          <ListItem title="Nothing found" />
        </List>
        <List
          accordionList
          accordionOpposite
          class="search-list searchbar-found"
        >
          {#each showResult as p}
            <ListItem
              accordionItem
              title={p.title}
              footer={`${isoToDmy(p.createdAt, "dd-mm-yyyy")} - ${p.userName}`}
              header={p.serialNumber}
              badgeColor={borrowStatus[p.status].color}
              badge={p.status}
            >
              <AccordionContent>
                <div class="data-table make-capital">
                  <table class="borrow-detail-view">
                    <thead>
                      {#each borrowDetailTable as d}
                        {#if p[d.data]}
                          <tr>
                            <td class="label-cell">{d.title}</td>
                            <td class="numeric-cell">:</td>
                            <td class="label-cell">
                              {d.time
                                ? isoToDmy(p[d.data], "hh:MM:ss dd-mmmm-yyyy")
                                : p[d.data]}
                            </td>
                          </tr>
                        {/if}
                      {/each}
                    </thead>
                  </table>
                  <div class="data-action">
                    <Row>
                      <Col width={50}>
                        <Button outline href={`/book/detail/${p.collectionId}`}>
                          View Book
                        </Button>
                      </Col>
                      {#if viewUser}
                        <Col width={50}>
                          <Button
                            outline
                            on:click={async () => {
                              f7.dialog.preloader();
                              userDetail.set({});
                              userDetail.set(await getUser(p.userId));
                              f7.dialog.close();
                              popupOpened = true;
                            }}
                          >
                            View User
                          </Button>
                        </Col>
                      {/if}
                    </Row>
                  </div>
                </div>
              </AccordionContent>
            </ListItem>
          {/each}
        </List>
      {/if}
    </div>
  </CardContent>
</Card>

<style>
  .data-table .data-action {
    width: 50%;
    min-width: 500px;
    margin: auto;
  }
  .borrow-detail-view {
    width: 50%;
    min-width: 250px;
    margin: auto;
  }
</style>
