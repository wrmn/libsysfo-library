<script>
  import {
    Page,
    Navbar,
    List,
    ListInput,
    Preloader,
    Button,
    ListItem,
    f7,
    Row,
    Col,
    Card,
    CardHeader,
    CardContent,
    CardFooter,
  } from "framework7-svelte";

  import { userSearchList, userResult, userDetail } from "../../../js/store";
  import { getUser, getUsers } from "../../../js/api/user";
  import { delayer } from "../../../js/api";
  import { onMount } from "svelte";

  import Borrow from "../../../components/otherComponent/borrow.svelte";
  import UserPopup from "../../../components/popupComponent/userPopup.svelte";

  let keyword, searchState;
  let isHide = true;
  let searching = false;
  let popupOpened = false;

  export let f7router;

  onMount(() => {
    userSearchList.set([]);
    userResult.set({});
    userDetail.set({});
  });
</script>

<UserPopup bind:popupOpened />

<Page>
  <Navbar title="User Borrow History" backLink="Back" />
  <List noHairlinesMd>
    <ListInput
      label="Keyword"
      floatingLabel
      type="text"
      placeholder="Username or E-mail"
      bind:value={keyword}
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
        userSearchList.set([]);
        isHide = false;
        searching = true;
        clearTimeout(searchState);
        searchState = setTimeout(async () => {
          searching = false;
          if (typeof keyword == "string" && keyword.length > 0) {
            userSearchList.set(await getUsers(keyword));
          } else {
            isHide = true;
          }
        }, 1000);
      }}
    />
  </List>
  <div class:hide={isHide} class="list-container">
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
            on:click={async () => {
              f7.dialog.preloader();
              userResult.set({});
              userResult.set(await getUser(b.id, "borrow"));
              f7.dialog.close();
              isHide = true;
            }}
          />
        {/each}
      {/if}
    </List>
  </div>
  {#if $userResult.user}
    <Row>
      <Col width={100} medium={30}>
        <Card class="demo-card-header-pic">
          <CardHeader class="no-border" valign="bottom">
            User Information
          </CardHeader>
          <CardContent>
            {$userResult.user.username}<br />
            {$userResult.user.email}
          </CardContent>
          <CardFooter>
            <Button />
            <Button
              on:click={async () => {
                f7.dialog.preloader();
                userDetail.set({});
                userDetail.set(await getUser($userResult.user.id));
                f7.dialog.close();
                popupOpened = true;
              }}
            >
              View User
            </Button>
          </CardFooter>
        </Card>
      </Col>
      <Col width={100} medium={70}>
        <Card class="demo-card-header-pic">
          <CardHeader class="no-border" valign="bottom">User Borrow</CardHeader>
          <CardContent>
            {#if $userResult.borrow.length > 0}
              <Borrow
                callApi={delayer($userResult.borrow)}
                viewUser={false}
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
      <CardContent>Search username or user email</CardContent>
    </Card>
  {/if}
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
