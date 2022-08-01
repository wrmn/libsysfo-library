<script>
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
  import { permissionResult, userDetail } from "../../js/store";
  import { isoToDmy, capitalize, sorting } from "../../js/utility";
  import { borrowStatus, permissionDetailTable } from "../../js/storeTable";
  import { getUser } from "../../js/api/user";
  import { onDestroy, onMount } from "svelte";

  import UserPopup from "./userPopup.svelte";

  const sortIcons = [
    { icon: "sort_up", desc: false },
    { icon: "sort_down", desc: true },
  ];

  let calendarRange,
    sortCategory,
    status,
    keyword = "",
    popupOpened = false,
    statusFilter = Object.keys(borrowStatus).slice(2),
    timeFilter = [new Date("05/08/2017"), new Date()],
    showResult = [],
    desc = true,
    field = "createdAt";

  export let callApi,
    f7router,
    viewUser = true,
    viewPaper = true,
    viewFilter = true;

  const resultFilter = () => {
    const keyFilter = new RegExp(keyword, "i"),
      statsFilter = new RegExp("\\b" + statusFilter.join("\\b|\\b") + "\\b"),
      startFilter = timeFilter[0].getTime(),
      endFilter = timeFilter[1].getTime() + 24 * 60 * 60 * 1000;
    showResult = $permissionResult.filter((d) => {
      const createdAt = new Date(d.createdAt).getTime();
      return (
        (keyFilter.test(d.title) ||
          keyFilter.test(d.subject.join()) ||
          keyFilter.test(d.userName)) &&
        statsFilter.test(d.status) &&
        createdAt >= startFilter &&
        createdAt <= endFilter
      );
    });
    showResult = resultSort(showResult);
  };

  const resultSort = (arr) => arr.sort((a, b) => sorting(a, b, field, desc));

  const sendAction = async (body) => {
    const response = await permissionAction(body);

    f7.dialog.alert(response.description, "", () => {
      if (response.status == 200) {
        f7router.back();
      }
    });
  };

  onMount(async () => {
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
    permissionResult.set([]);
    f7.dialog.preloader();
    permissionResult.set(await callApi);
    showResult = $permissionResult;
    f7.dialog.close();
  });

  onDestroy(() => {
    permissionResult.set([]);
  });
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
                    <option value="title">Paper Title</option>
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
              <select
                name="status"
                multiple
                value={Object.keys(borrowStatus).slice(2)}
              >
                {#each Object.keys(borrowStatus).slice(2) as k}
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
{/if}

<Card>
  <CardContent>
    {#if $permissionResult.length == 0}
      There is no permission data yet.
    {:else if showResult.length == 0}
      Data not found.
    {:else}
      <List accordionList accordionOpposite>
        {#each showResult as p}
          <ListItem
            accordionItem
            title={capitalize(p.title)}
            footer={`${isoToDmy(p.createdAt, "dd-mm-yyyy")} - ${p.userName}`}
            header={p.serialNumber}
            badgeColor={borrowStatus[p.status].color}
            badge={capitalize(p.status)}
          >
            <AccordionContent>
              <div class="data-table make-capital">
                <table class="borrow-detail-view">
                  <tbody>
                    {#each permissionDetailTable as d}
                      {#if p[d.data]}
                        {#if d.object}
                          {#each Object.keys(p[d.data]) as keys}
                            <tr>
                              <td>{keys}</td>
                              <td>:</td>
                              <td>{p[d.data][keys]} </td>
                            </tr>
                          {/each}
                        {:else}
                          <tr>
                            <td>{d.title}</td>
                            <td>:</td>
                            <td>
                              {d.time
                                ? isoToDmy(p[d.data], "hh:MM:ss dd-mmmm-yyyy")
                                : d.array
                                ? p[d.data].join(", ")
                                : p[d.data]}
                            </td>
                          </tr>
                        {/if}
                      {/if}
                    {/each}
                  </tbody>
                </table>
                <div class="data-action">
                  <Row>
                    {#if viewPaper}
                      <Col>
                        <Button outline href={`/paper/detail/${p.paperId}/`}>
                          View Paper
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
                  {#if !(p.acceptedAt || p.canceledAt)}
                    <Row class="padding-top">
                      <Col>
                        <Button
                          outline
                          color="red"
                          on:click={async () => {
                            f7.dialog.confirm("Reject this borrow?", "", () => {
                              sendAction({
                                state: "cancel",
                                borrowId: p.id,
                              });
                            });
                          }}
                        >
                          Reject
                        </Button>
                      </Col>
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
                          Accept
                        </Button>
                      </Col>
                    </Row>
                  {/if}
                  <div class="data-action" />
                </div>
              </div></AccordionContent
            >
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
