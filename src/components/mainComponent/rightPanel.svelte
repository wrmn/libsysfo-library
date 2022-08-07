<script>
  import {
    Panel,
    View,
    Navbar,
    Page,
    List,
    ListItem,
    NavTitle,
    NavRight,
    Button,
  } from "framework7-svelte";
  import { getNotification, readNotification } from "../../js/api";
  import { notification } from "../../js/store";
  import { isoToDmy } from "../../js/utility";
</script>

<Panel right cover>
  <View>
    <Page>
      <Navbar>
        <NavTitle>Notification</NavTitle>
        <NavRight>
          <Button
            on:click={() => {
              readNotification();
            }}>read all</Button
          >
        </NavRight>
      </Navbar>
      <List mediaList>
        <Button
          fill
          iconF7="arrow_clockwise_circle"
          tooltip="refresh"
          onClick={getNotification()}
        />
        {#if $notification.data && $notification.data.notification}
          {#each $notification.data.notification as n}
            <ListItem
              after={isoToDmy(n.CreatedAt, "dd-mm-yyyy hh:MM:ss")}
              text={n.message}
            />
          {/each}
        {/if}
      </List>
    </Page>
  </View>
</Panel>
