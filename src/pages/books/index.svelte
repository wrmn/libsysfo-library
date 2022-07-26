<script>
  import { Row, Col, Block, Page, Icon } from "framework7-svelte";
  import { bookMenu } from "../../js/storeMenu";
  import Square from "../../components/otherComponent/square.svelte";
  import MainHeader from "../../components/mainComponent/mainHeader.svelte";
</script>

<Page name="Book">
  <MainHeader />
  <Block strong>
    <Row class="align-items-center">
      {#each bookMenu as menu}
        <Col width={50}>
          <Square menuName={menu.name} href={menu.link}>
            <span slot="content">
              <Icon material={menu.icon} size="60px" />
            </span>
          </Square>
        </Col>
      {/each}
    </Row>
  </Block>
</Page>
