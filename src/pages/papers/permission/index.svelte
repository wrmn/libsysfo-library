<script>
  import { Page, Navbar } from "framework7-svelte";
  import { getPermission } from "../../../js/api/permission";
  import Permission from "../../../components/otherComponent/permission.svelte";
  export let f7router;
</script>

<Page>
  <Navbar title="Library Permission List" backLink="Back" />
  <Permission callApi={getPermission()} bind:f7router />
</Page>
