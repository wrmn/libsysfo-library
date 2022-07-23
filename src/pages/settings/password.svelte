<script>
  import { List, ListInput, Icon, Button } from "framework7-svelte";
  import { updatePassword } from "../../js/api/settings";

  let password = {};
</script>

<List noHairlinesMd>
  <ListInput
    label="Password"
    floatingLabel
    type="password"
    placeholder="Your password"
    bind:value={password.oldPassword}
    clearButton
  >
    <Icon f7="lock_shield_fill" slot="media" />
  </ListInput>
  <ListInput
    label="New Password"
    bind:value={password.password}
    floatingLabel
    type="password"
    placeholder="Your new password"
    clearButton
  >
    <Icon f7="lock_shield_fill" slot="media" />
  </ListInput>
  <ListInput
    label="Retype Password"
    floatingLabel
    type="password"
    bind:value={password.retypePassword}
    placeholder="Retype your password"
    clearButton
    errorMessage="Password doesn't match"
  >
    <Icon f7="lock_shield_fill" slot="media" />
  </ListInput>
  <Button
    fill
    on:click={() => {
      updatePassword(password);
      password = {};
    }}>Save</Button
  >
</List>
