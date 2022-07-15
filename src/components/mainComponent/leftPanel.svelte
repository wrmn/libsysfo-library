<script>
  import {
    Panel,
    View,
    Navbar,
    NavRight,
    Button,
    Block,
    Page,
  } from "framework7-svelte";

  import { darkTheme, userData } from "../../js/store";
  import { switchTheme } from "../../js/utility";
  import { logout } from "../../js/api/profile";
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
      <div style="width: 300px;">
        <img src={$userData.libraryImage} alt="" width="100%" />
      </div>
      <table>
        <tbody>
          <tr>
            <td class="label-cell">Perpustakaan</td>
            <td class="label-cell make-capital">{$userData.libraryName}</td>
          </tr>
          <tr>
            <td class="label-cell">Username</td>
            <td class="label-cell">{$userData.username}</td>
          </tr>
          <tr>
            <td class="label-cell">Email</td>
            <td class="label-cell">{$userData.email}</td>
          </tr>
        </tbody>
      </table>
      <Button
        on:click={() => {
          logout();
        }}>Logout</Button
      >
    </Page>
  </View>
</Panel>
