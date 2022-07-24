<script>
  import { Row, Col, Block, Page, Icon } from "framework7-svelte";
  import Square from "../../components/menuComponent/square.svelte";
  import MainHeader from "../../components/mainComponent/mainHeader.svelte";
</script>

<Page name="Book">
  <MainHeader />
  <Block strong>
    <Row class="align-items-center">
      <Col width={50} height={50}>
        <Square menuName="Library Book Collection" href="/book/list/">
          <span slot="content">
            <Icon f7="square_stack_3d_down_right_fill" size="60px" />
          </span>
        </Square>
      </Col>
      <Col width={50}>
        <Square menuName="Borrow History" href="/book/borrow/">
          <span slot="content">
            <Icon material="auto_stories" size="60px" />
          </span>
        </Square>
      </Col>
      <Col width={50}>
        <Square menuName="Book Borrow">
          <span slot="content">
            <Icon material="logout" size="60px" />
            <Icon f7="person_alt" size="60px" />
          </span>
        </Square>
      </Col>
      <Col width={50}>
        <Square menuName="Book Return">
          <span slot="content">
            <Icon f7="person_alt" size="60px" />
            <Icon material="login" size="60px" />
          </span>
        </Square>
      </Col>
    </Row>
  </Block>
</Page>
