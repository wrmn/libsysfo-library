<script>
  import {
    Page,
    Navbar,
    List,
    ListInput,
    ListItem,
    ListButton,
    f7,
    Preloader,
    Card,
    CardHeader,
    CardContent,
    Row,
    Col,
  } from "framework7-svelte";
  import {
    userSearchList,
    collectionSearchList,
    userDetail,
    borrowResult,
  } from "../../../js/store";
  import { delayer } from "../../../js/api";
  import { getUsers } from "../../../js/api/user";
  import { getCollections } from "../../../js/api/collection";
  import { borrowAction, findBorrow } from "../../../js/api/borrow";
  import { onMount } from "svelte";

  import Borrow from "../../../components/otherComponent/borrow.svelte";
  import UserPopup from "../../../components/otherComponent/userPopup.svelte";

  const borrowParam = {};

  let keyword,
    sn,
    searchState,
    kwHide = true,
    snHide = true,
    searching = false,
    popupOpened = false;

  export let f7router;

  onMount(() => {
    userDetail.set({});
    borrowResult.set({});
    userSearchList.set([]);
    collectionSearchList.set([]);
  });

  const sendAction = async (body) => {
    const response = await borrowAction(body);

    f7.dialog.alert(response.description, "", () => {
      if (response.status == 200) {
        f7router.back();
      }
    });
  };

  const runSearch = async () => {
    if (borrowParam.cid && borrowParam.uid) {
      f7.dialog.preloader();
      borrowResult.set({});
      userDetail.set({});
      borrowResult.set(await findBorrow(borrowParam));
      if ($borrowResult && $borrowResult.user) {
        userDetail.set({
          profile: $borrowResult.user,
        });
      }
      f7.dialog.close();
    }
  };
</script>

<UserPopup bind:popupOpened />

<Page>
  <Navbar title="Library Borrow" backLink="Back" />
  <List noHairlinesMd>
    <ListInput
      label="User"
      floatingLabel
      type="text"
      placeholder="Username or E-mail"
      bind:value={keyword}
      on:blur={() => {
        setTimeout(function () {
          kwHide = true;
        }, 200);
      }}
      on:focus={() => {
        setTimeout(function () {
          kwHide = false;
        }, 200);
      }}
      on:input={() => {
        delete borrowParam.uid;
        borrowResult.set({});
        userDetail.set({});
        userSearchList.set([]);
        kwHide = false;
        searching = true;
        clearTimeout(searchState);
        searchState = setTimeout(async () => {
          searching = false;
          if (typeof keyword == "string" && keyword.length > 0) {
            userSearchList.set(await getUsers(keyword));
          } else {
            kwHide = true;
          }
        }, 1000);
      }}
    />
    <ListInput
      label="Serial Number"
      floatingLabel
      type="text"
      placeholder="Book Collection Serial Number"
      bind:value={sn}
      on:blur={() => {
        setTimeout(function () {
          snHide = true;
        }, 200);
      }}
      on:focus={() => {
        setTimeout(function () {
          snHide = false;
        }, 200);
      }}
      on:input={() => {
        delete borrowParam.cid;
        borrowResult.set({});
        userDetail.set({});
        collectionSearchList.set([]);
        snHide = false;
        searching = true;
        clearTimeout(searchState);
        searchState = setTimeout(async () => {
          searching = false;
          if (typeof sn == "string" && sn.length > 0) {
            collectionSearchList.set(await getCollections(sn));
          } else {
            snHide = true;
          }
        }, 1000);
      }}
    />
  </List>
  <div class:hide={kwHide} class="list-container kw-list">
    <List mediaList>
      {#if searching}
        <ListItem>
          <Preloader color="multi" />
        </ListItem>
      {:else}
        {#each $userSearchList as b}
          <ListItem
            title={`${b.username} - ${b.email}`}
            subtitle={b.name}
            link="#"
            on:click={() => {
              borrowParam.uid = b.id;
              keyword = b.username ? b.username : b.email;
              runSearch();
            }}
          />
        {/each}
      {/if}
    </List>
  </div>
  <div class:hide={snHide} class="list-container sn-list">
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
            on:click={async () => {
              borrowParam.cid = b.status.id;
              sn = b.status.sn;
              runSearch();
            }}
          >
            <img slot="media" src={b.image} width="80" alt="" />
          </ListItem>
        {/each}
      {/if}
    </List>
  </div>
  {#if $borrowResult && $borrowResult.borrow}
    <Row>
      <Col width={100} medium={20}>
        <Card class="demo-card-header-pic">
          <CardHeader class="no-border" valign="bottom">Action</CardHeader>
          <CardContent>
            <List inset>
              <ListButton
                title="New Borrow"
                bgColor="green"
                textColor="black"
                on:click={() => {
                  f7.dialog
                    .create({
                      text: "Borrow Action state",
                      buttons: [
                        {
                          text: "Request",
                          onClick: () => {
                            f7.dialog.confirm(
                              `new Borrow request for user <br /> ${keyword} <br /> and book <br /> ${sn}`,
                              "",
                              () => {
                                if (borrowParam.uid && borrowParam.cid) {
                                  sendAction({
                                    state: "new",
                                    userId: borrowParam.uid,
                                    collectionId: borrowParam.cid,
                                  });
                                } else {
                                  f7.dialog.create({
                                    title: "State has been change",
                                    text: "Please Input username or email and collection serial number again",
                                  });
                                }
                              }
                            );
                          },
                        },
                        {
                          text: "Take Book",
                          onClick: () => {
                            f7.dialog.confirm(
                              `new Borrow taken by user <br /> ${keyword} <br /> and book <br /> ${sn}`,
                              "",
                              () => {
                                if (borrowParam.uid && borrowParam.cid) {
                                  sendAction({
                                    state: "newTake",
                                    userId: borrowParam.uid,
                                    collectionId: borrowParam.cid,
                                  });
                                } else {
                                  f7.dialog.create({
                                    title: "State has been change",
                                    text: "Please Input username or email and collection serial number again",
                                  });
                                }
                              }
                            );
                          },
                        },
                        {
                          text: "Cancel",
                          color: "red",
                        },
                      ],
                      verticalButtons: true,
                    })
                    .open();
                }}
              />
              <ListButton
                title="View User"
                on:click={async () => {
                  popupOpened = true;
                }}
              />
              <ListButton
                title="View Book"
                href={`/book/detail/${borrowParam.cid}/`}
              />
            </List>
          </CardContent>
        </Card>
      </Col>
      <Col width={100} medium={80}>
        <Card class="demo-card-header-pic">
          <CardHeader class="no-border" valign="bottom">User Borrow</CardHeader>
          <CardContent>
            {#if $borrowResult.borrow.length > 0}
              <Borrow
                callApi={delayer($borrowResult.borrow)}
                viewFilter={false}
                viewUser={false}
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
    <Card class="demo-card-header-pic">
      <CardContent>
        Search username or user email and book serial number
      </CardContent>
    </Card>
  {/if}
</Page>

<style>
  .list-container {
    padding-left: 30px;
    height: 300px;
    position: absolute;
    z-index: 99;
    overflow: auto;
  }

  .kw-list {
    margin-top: -130px;
  }

  .sn-list {
    margin-top: -70px;
  }

  .hide {
    visibility: hidden;
  }
</style>
