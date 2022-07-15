<script>
  import { Page, Navbar, Block, Link } from "framework7-svelte";

  export let f7route, f7router;
</script>

<Page>
  <Navbar title="Not found" backLink="Back" />
  <Block strong>
    <p>Sorry</p>
    <p>Requested content for {f7route.url} not found.</p>
  </Block>
  <Block strong>
    <Link onClick={() => f7router.back()}>Go back via Router API</Link>
  </Block>
</Page>
