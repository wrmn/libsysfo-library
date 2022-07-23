<script>
  import {
    Panel,
    View,
    Navbar,
    NavRight,
    Button,
    Page,
  } from "framework7-svelte";

  import { darkTheme } from "../../js/store";
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
      <Button fill href="/settings/">Account Setting</Button>
      <Button
        on:click={() => {
          logout();
        }}>Logout</Button
      >
    </Page>
  </View>
</Panel>
