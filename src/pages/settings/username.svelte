<script>
  import { List, ListItem, ListInput, Button, f7 } from "framework7-svelte";
  import { updateUsername } from "../../js/api/settings";
  export let username;
</script>

<List>
  <ListInput
    label="Username"
    type="text"
    floatingLabel
    bind:value={username}
    placeholder="Your e-mail"
  >
    <i class="f7-icons" slot="media"> person</i>
  </ListInput>
  <ListItem>
    <Button disabled />
    <Button
      fill
      on:click={() => {
        f7.dialog.password("Enter your password", "", (password) => {
          updateUsername(username, password);
        });
      }}
    >
      Change Username
    </Button>
  </ListItem>
</List>
