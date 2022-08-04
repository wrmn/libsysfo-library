<script>
  import { onDestroy, onMount } from "svelte";
  import {
    Row,
    Col,
    Card,
    CardContent,
    List,
    ListItem,
    AccordionContent,
    Popover,
    f7,
    Button,
    ListInput,
    Link,
  } from "framework7-svelte";
  import { isoToDmy, capitalize, sorting } from "../../js/utility";
  import { borrowsResult, userDetail } from "../../js/store";
  import { borrowStatus, borrowDetailTable } from "../../js/storeTable";
  import { getUser } from "../../js/api/user";
  import { borrowAction } from "../../js/api/borrow";

  import UserPopup from "../popupComponent/userPopup.svelte";

  const sortIcons = [
    { icon: "sort_up", desc: false },
    { icon: "sort_down", desc: true },
  ];

  let calendarRange,
    status,
    sortCategory,
    statusFilter = Object.keys(borrowStatus),
    timeFilter = [new Date("05/08/2017"), new Date()],
    showResult = [],
    desc = true,
    popupOpened = false,
    field = "createdAt",
    keyword = "";

  export let callApi,
    viewUser = true,
    viewBook = true,
    viewFilter = true,
    f7router;

  onMount(async () => {
    calendarRange = f7.calendar.create({
      inputEl: "#borrow-calendar-range",
      dateFormat: { day: "2-digit", month: "long", year: "numeric" },
      rangePicker: true,
      on: {
        close: () => {
          timeFilter = calendarRange.getValue();
          resultFilter();
        },
      },
    });
    borrowsResult.set([]);
    f7.dialog.preloader();
    borrowsResult.set(await callApi);
    showResult = resultSort($borrowsResult);
    f7.dialog.close();
  });

  onDestroy(() => {
    borrowsResult.set([]);
  });

  const resultFilter = () => {
    const keyFilter = new RegExp(keyword, "i"),
      statsFilter = new RegExp("\\b" + statusFilter.join("\\b|\\b") + "\\b"),
      startFilter = timeFilter[0].getTime(),
      endFilter = timeFilter[1].getTime() + 24 * 60 * 60 * 1000;
    showResult = resultSort(
      $borrowsResult.filter((d) => {
        const createdAt = new Date(d.createdAt).getTime();
        return (
          (keyFilter.test(d.title) ||
            keyFilter.test(d.serialNumber) ||
            keyFilter.test(d.userName)) &&
          statsFilter.test(d.status) &&
          createdAt >= startFilter &&
          createdAt <= endFilter
        );
      })
    );
  };

  const resultSort = (arr) => arr.sort((a, b) => sorting(a, b, field, desc));

  const sendAction = async (body) => {
    const response = await borrowAction(body);

    f7.dialog.alert(response.description, "", () => {
      if (response.status == 200) {
        f7router.back();
      }
    });
  };
</script>

{#if viewUser}
  <UserPopup bind:popupOpened />
{/if}

{#if viewFilter}
  <Popover class="popover-searchbar" backdrop={false} closeOnEscape>
    <List>
      <ListInput
        label="Search"
        floatingLabel
        type="text"
        placeholder="Insert Keyword"
        bind:value={keyword}
        on:change={() => {
          resultFilter();
        }}
        clearButton
      />
    </List>
  </Popover>
  <Card>
    <CardContent>
      <List>
        <Row>
          <Col width={100} medium={30}>
            <Row>
              <Col width={100} medium={10}>
                <Link
                  iconF7="search"
                  tooltip="search"
                  iconSize={30}
                  class="padding"
                  popoverOpen=".popover-searchbar"
                />
              </Col>
              <Col width={10}>
                {#each sortIcons as s}
                  {#if s.desc == desc}
                    <Link
                      iconF7={s.icon}
                      tooltip="sort"
                      iconSize={30}
                      class="padding"
                      on:click={() => {
                        desc = !desc;
                        showResult = resultSort(showResult);
                      }}
                    />
                  {/if}
                {/each}
              </Col>
              <Col width={90} medium={80}>
                <ListItem
                  title="Sort by"
                  bind:this={sortCategory}
                  smartSelect
                  smartSelectParams={{
                    openIn: "popover",
                    on: {
                      close: () => {
                        field = sortCategory.smartSelectInstance().getValue();
                        showResult = resultSort(showResult);
                      },
                    },
                  }}
                >
                  <select
                    name="sort-by"
                    value="createdAt"
                    on:change={() => {
                      sortCategory.smartSelectInstance().close();
                    }}
                  >
                    <option value="title">Book Title</option>
                    <option value="userName">User</option>
                    <option value="createdAt">Request Date</option>
                  </select>
                </ListItem>
              </Col>
            </Row>
          </Col>

          <Col width={100} medium={30}>
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
                    {capitalize(k)}
                  </option>
                {/each}
              </select>
            </ListItem>
          </Col>
          <Col width={100} medium={30}>
            <div class="list no-hairlines-md inline-labels">
              <div class="item-content item-input">
                <div class="item-inner">
                  <div class="item-title item-label">Date</div>
                  <div class="item-input-wrap">
                    <input
                      type="text"
                      placeholder="Select date range"
                      readonly="readonly"
                      id="borrow-calendar-range"
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
{/if}

<Card>
  <CardContent>
    {#if $borrowsResult.length == 0}
      There is no borrow data yet.
    {:else if showResult.length == 0}
      Data not found.
    {:else}
      <List accordionList accordionOpposite>
        {#each showResult as p}
          <ListItem
            accordionItem
            title={p.title}
            footer={`${isoToDmy(p.createdAt, "dd-mm-yyyy")} - ${p.userName}`}
            header={p.serialNumber}
            badgeColor={borrowStatus[p.status].color}
            badge={capitalize(p.status)}
          >
            <AccordionContent>
              <div class="data-table make-capital">
                <table class="borrow-detail-view">
                  <tbody>
                    {#each borrowDetailTable as d}
                      {#if p[d.data]}
                        <tr>
                          <td>{d.title}</td>
                          <td>:</td>
                          <td>
                            {d.time
                              ? isoToDmy(p[d.data], "hh:MM:ss dd-mmmm-yyyy")
                              : p[d.data]}
                          </td>
                        </tr>
                      {/if}
                    {/each}
                  </tbody>
                </table>
                <div class="data-action">
                  <Row>
                    {#if viewBook}
                      <Col>
                        <Button
                          outline
                          href={`/book/detail/${p.collectionId}/`}
                        >
                          View Book
                        </Button>
                      </Col>
                    {/if}
                    {#if viewUser}
                      <Col>
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
                  {#if !(p.returnedAt || p.canceledAt)}
                    <Row class="padding-top">
                      {#if !p.takedAt}
                        <Col>
                          <Button
                            outline
                            color="red"
                            on:click={async () => {
                              f7.dialog.confirm(
                                "Reject this borrow?",
                                "",
                                () => {
                                  sendAction({
                                    state: "cancel",
                                    borrowId: p.id,
                                  });
                                }
                              );
                            }}
                          >
                            Reject
                          </Button>
                        </Col>
                      {/if}
                      <Col>
                        <Button
                          fill
                          color="green"
                          textColor="black"
                          on:click={async () => {
                            f7.dialog.confirm(
                              "Update borrow status?",
                              "",
                              () => {
                                sendAction({
                                  state: "next",
                                  borrowId: p.id,
                                });
                              }
                            );
                          }}
                        >
                          {p.acceptedAt
                            ? p.takedAt
                              ? "Return"
                              : "Take"
                            : "Accept"}
                        </Button>
                      </Col>
                    </Row>
                  {/if}
                </div>
              </div>
            </AccordionContent>
          </ListItem>
        {/each}
      </List>
    {/if}
  </CardContent>
</Card>

<style>
  .data-table .data-action {
    max-width: 500px;
    padding-top: 20px;
    margin: auto;
  }

  .borrow-detail-view {
    width: 50%;
    min-width: 250px;
    margin: auto;
  }
</style>
