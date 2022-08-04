<script>
  import { Row, Col, Block, Page, Icon } from "framework7-svelte";
  import { reportMenu } from "../../js/storeMenu";

  import Square from "../../components/otherComponent/square.svelte";
  import MainHeader from "../../components/mainComponent/mainHeader.svelte";
  import ReportPopup from "../../components/popupComponent/reportPopup.svelte";
  import ReportBorrow from "../../components/inputComponent/reportBorrow.svelte";
  import ReportBook from "../../components/inputComponent/reportBook.svelte";

  let popupOpened = [false, false, false, false, false, false];
</script>

<Page name="Report">
  <MainHeader />
  <Block strong>
    <Row class="align-items-center">
      {#each reportMenu as menu, i}
        <Col width={50}>
          <div
            on:click={() => {
              popupOpened[i] = !popupOpened[i];
            }}
          >
            <Square menuName={menu.name} href="#">
              <span slot="content">
                <Icon material={menu.icon} size="60px" />
              </span>
            </Square>
          </div>
        </Col>
      {/each}
    </Row>
  </Block>
</Page>

<ReportPopup bind:popupOpened={popupOpened[0]}>
  <span slot="form"> <ReportBook /> </span>
</ReportPopup>
<ReportPopup bind:popupOpened={popupOpened[1]}>
  <span slot="form"> done </span>
</ReportPopup>
<ReportPopup bind:popupOpened={popupOpened[2]}>
  <span slot="form"> <ReportBorrow /> </span>
</ReportPopup>
<ReportPopup bind:popupOpened={popupOpened[3]}>
  <span slot="form"> work </span>
</ReportPopup>
