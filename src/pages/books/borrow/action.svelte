<script>
  import {
    Page,
    Navbar,
    List,
    ListInput,
    ListItem,
    Button,
    Preloader,
  } from "framework7-svelte";
  import { userSearchList, collectionSearchList } from "../../../js/store";
  import { getUsers } from "../../../js/api/user";
  import { getCollections } from "../../../js/api/collection";
  import { onMount } from "svelte";

  const borrowParam = {};

  let keyword, sn, searchState;
  let kwHide = true;
  let snHide = true;
  let searching = false;

  onMount(() => {
    userSearchList.set([]);
    collectionSearchList.set([]);
  });
</script>

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
        collectionSearchList.set([]);
        snHide = false;
        searching = true;
        clearTimeout(searchState);
        searchState = setTimeout(async () => {
          searching = false;
          if (typeof sn == "string" && sn.length > 0) {
            collectionSearchList.set(await getCollections(sn));
            console.log($collectionSearchList);
          } else {
            snHide = true;
          }
        }, 1000);
      }}
    />
    <Button
      fill
      onClick={() => {
        console.log(borrowParam);
      }}>Search</Button
    >
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
              borrowParam.id = b.id;
              keyword = b.username ? b.username : b.email;
              console.log(borrowParam);
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
              borrowParam.sn = b.status.sn;
              sn = b.status.sn;
              console.log(borrowParam);
            }}
          >
            <img slot="media" src={b.image} width="80" alt="" />
          </ListItem>
        {/each}
      {/if}
    </List>
  </div>
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
