<script>
  import { Row, Col, Block, Page, Icon } from "framework7-svelte";
  import Square from "../../components/menuComponent/square.svelte";
  import MainHeader from "../../components/mainComponent/mainHeader.svelte";
</script>

<Page name="Paper">
  <MainHeader />
  <Block strong>
    <Row class="align-items-center">
      <Col width={50}
        ><Square menuName="Paper Dashboard">
          <span slot="content">
            <Icon f7="doc_chart" size="60px" />
          </span>
        </Square>
      </Col>
      <Col width={50}
        ><Square menuName="Paper List">
          <span slot="content">
            <Icon f7="rectangle_stack" size="60px" />
          </span>
        </Square>
      </Col><Col width={50}
        ><Square menuName="User Permission">
          <span slot="content">
            <Icon f7="rectangle_stack_badge_person_crop" size="60px" />
          </span>
        </Square>
      </Col>
      <Col width={50} height={50} class="align-items-center">
        <Square menuName="Access History">
          <span slot="content">
            <Icon f7="search_circle" size="60px" />
          </span>
        </Square>
      </Col>
    </Row>
  </Block>
</Page>
