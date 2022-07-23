<script>
  import {
    List,
    ListItem,
    AccordionContent,
    Page,
    Block,
    Navbar,
  } from "framework7-svelte";
  import { userData } from "../../js/store";

  import UsernameSetting from "./username.svelte";
  import PasswordSetting from "./password.svelte";
  import EmailSetting from "./email.svelte";
  import { onMount } from "svelte";

  let email, username;
  onMount(() => {
    email = $userData.email;
    username = $userData.username;
  });
</script>

<Page name="Paper">
  <Navbar title="Setting" backLink="back" />

  <Block strong>
    <List accordionList accordionOpposite>
      <ListItem accordionItem title="Username">
        <AccordionContent>
          <UsernameSetting bind:username />
        </AccordionContent>
      </ListItem>
      <ListItem accordionItem title="Email">
        <AccordionContent>
          <EmailSetting bind:email />
        </AccordionContent>
      </ListItem>
      <ListItem accordionItem title="Password">
        <AccordionContent>
          <PasswordSetting />
        </AccordionContent>
      </ListItem>
    </List>
  </Block>
</Page>
