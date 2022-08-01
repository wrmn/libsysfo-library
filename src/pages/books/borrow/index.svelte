<script>
  import { Page, Navbar } from "framework7-svelte";
  import { getBorrows } from "../../../js/api/borrow";
  import Borrow from "../../../components/otherComponent/borrow.svelte";
  export let f7router;
</script>

<Page>
  <Navbar title="Library Borrow List" backLink="Back" />
  <Borrow callApi={getBorrows()} bind:f7router />
</Page>
