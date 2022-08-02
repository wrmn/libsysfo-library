<script>
  import {
    Page,
    Navbar,
    List,
    ListInput,
    Row,
    Col,
    CardHeader,
    ListButton,
    ListItem,
    Preloader,
    f7,
    Card,
    CardContent,
  } from "framework7-svelte";
  import { onMount } from "svelte";
  import {
    userDetail,
    userSearchList,
    paperSearchList,
    permissionResult,
  } from "../../../js/store";
  import { getUsers } from "../../../js/api/user";
  import { getPapers } from "../../../js/api/paper";
  import { isoToDmy } from "../../../js/utility";
  import { findPermission } from "../../../js/api/permission";

  import UserPopup from "../../../components/otherComponent/userPopup.svelte";

  let ukw,
    pkw,
    ukwHide = true,
    pkwHide = true,
    searching = false,
    searchState,
    popupOpened = false;

  const permissionParam = {};

  onMount(() => {
    userDetail.set({});
    permissionResult.set({});
    userSearchList.set([]);
    paperSearchList.set([]);
  });

  const runSearch = async () => {
    if (permissionParam.pid && permissionParam.uid) {
      f7.dialog.preloader();
      permissionResult.set({});
      userDetail.set({});
      permissionResult.set(await findPermission(permissionParam));
      if ($permissionResult && $permissionResult.user) {
        userDetail.set({
          profile: $permissionResult.user,
        });
      }
      f7.dialog.close();
      console.log($permissionResult);
    }
  };
</script>

<UserPopup bind:popupOpened />

<Page>
  <Navbar title="Permission Access History" backLink="Back" />
  <List noHairlinesMd>
    <ListInput
      label="User"
      floatingLabel
      type="text"
      placeholder="Username or E-mail"
      bind:value={ukw}
      on:blur={() => {
        setTimeout(function () {
          ukwHide = true;
        }, 200);
      }}
      on:focus={() => {
        setTimeout(function () {
          ukwHide = false;
        }, 200);
      }}
      on:input={() => {
        delete permissionParam.uid;
        userDetail.set({});
        userSearchList.set([]);
        ukwHide = false;
        searching = true;
        clearTimeout(searchState);
        searchState = setTimeout(async () => {
          searching = false;
          if (typeof ukw == "string" && ukw.length > 0) {
            userSearchList.set(await getUsers(ukw));
          } else {
            ukwHide = true;
          }
        }, 1000);
      }}
    />
    <ListInput
      label="Title"
      floatingLabel
      type="text"
      placeholder="Paper Title Keyword"
      bind:value={pkw}
      on:blur={() => {
        setTimeout(function () {
          pkwHide = true;
        }, 200);
      }}
      on:focus={() => {
        setTimeout(function () {
          pkwHide = false;
        }, 200);
      }}
      on:input={() => {
        delete permissionParam.pid;
        paperSearchList.set([]);
        pkwHide = false;
        searching = true;
        clearTimeout(searchState);
        searchState = setTimeout(async () => {
          searching = false;
          if (typeof pkw == "string" && pkw.length > 0) {
            paperSearchList.set(await getPapers(pkw));
          } else {
            pkwHide = true;
          }
        }, 1000);
      }}
    />
  </List>
  <div class:hide={ukwHide} class="list-container kw-list">
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
              permissionParam.uid = b.id;
              ukw = b.username ? b.username : b.email;
              runSearch();
            }}
          />
        {/each}
      {/if}
    </List>
  </div>
  <div class:hide={pkwHide} class="list-container sn-list">
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
              permissionParam.pid = b.id;
              pkw = b.title;
              runSearch();
            }}
          />
        {/each}
      {/if}
    </List>
  </div>
  {#if $permissionResult && $permissionResult.permission}
    <Row>
      <Col width={50}>
        <Card class="demo-card-header-pic">
          <CardHeader class="no-border" valign="bottom">Action</CardHeader>
          <CardContent>
            <List inset>
              <ListButton
                title="View User"
                on:click={async () => {
                  popupOpened = true;
                }}
              />
              {#if $permissionResult.paper}
                <ListButton
                  title="View Book"
                  href={`/paper/detail/${$permissionResult.paper.id}/`}
                />
              {/if}
            </List>
          </CardContent>
        </Card>
      </Col>
      <Col width={50}>
        <Card class="demo-card-header-pic">
          <CardHeader class="no-border" valign="bottom"
            >Access History</CardHeader
          >
          <CardContent>
            {#if $permissionResult.access.total > 0}
              <List simpleList>
                {#each $permissionResult.access.time as time}
                  <ListItem title={isoToDmy(time, "dd-mmmm-yyyy hh:MM:ss ")} />
                {/each}
              </List>
            {:else}
              There is no access yet
            {/if}
          </CardContent>
        </Card>
      </Col>
    </Row>
  {:else}
    <Card class="demo-card-header-pic">
      <CardContent>Search username or user email and paper title</CardContent>
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
