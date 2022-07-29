<script>
  import { Row, Col, Block, Page, Icon } from "framework7-svelte";
  import { paperMenu } from "../../js/storeMenu";
  import Square from "../../components/otherComponent/square.svelte";
  import MainHeader from "../../components/mainComponent/mainHeader.svelte";
</script>

<Page name="Paper">
  <MainHeader />
  <Block strong>
    <Row class="align-items-center">
      {#each paperMenu as menu}
        <Col width={50}>
          <Square menuName={menu.name} href={menu.link}>
            <span slot="content">
              <Icon f7={menu.icon} size="60px" />
            </span>
          </Square>
        </Col>
      {/each}
    </Row>
  </Block>
</Page>
