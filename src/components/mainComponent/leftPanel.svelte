<script>
  import {
    Panel,
    View,
    Navbar,
    NavRight,
    Button,
    List,
    ListItem,
    Toggle,
    Page,
  } from "framework7-svelte";

  import { darkTheme, userData } from "../../js/store";
  import { switchTheme } from "../../js/utility";
  import { logout } from "../../js/api/profile";
  import { onMount } from "svelte";
  let stats;
  onMount(() => {
    stats = $darkTheme != true;
  });
</script>

<Panel left cover>
  <View>
    <Page>
      <Navbar title="Libsysfo">
        <NavRight>
          <Button
            on:click={() => {
              switchTheme();
              darkTheme.set(!$darkTheme);
            }}
          >
            <i class="icon f7-icons color-custom">
              {#if !$darkTheme}
                sun_min
              {:else}
                moon
              {/if}
            </i>
            <!-- moon -->
          </Button>
        </NavRight>
      </Navbar>
      <List simpleList>
        <ListItem>
          <span>Dark Mode</span>
          <Toggle
            checked={stats}
            onToggleChange={() => {
              switchTheme();
              darkTheme.set(!$darkTheme);
            }}
          />
        </ListItem>
      </List>
      <Button fill href="/profile/settings/" view=".view-main" panelClose>
        Account Setting
      </Button>
      <Button
        on:click={() => {
          logout();
        }}>Logout</Button
      >
    </Page>
  </View>
</Panel>
