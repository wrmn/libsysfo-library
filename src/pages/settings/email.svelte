<script>
  import { List, ListInput } from "framework7-svelte";

  export let email;
</script>

<List>
  <ListInput
  disabled
    label="E-mail"
    type="email"
    floatingLabel
    bind:value={email}
    placeholder="Your e-mail"
  />
</List>
