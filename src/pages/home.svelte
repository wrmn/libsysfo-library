<script>
  import { Page, Block, Row, Col } from "framework7-svelte";
  import {
    accessChartData,
    borrowChartData,
    bookChartData,
    paperChartData,
  } from "../js/store";
  import { getDataSet, lineOption, pieOption } from "../js/api/dataset";
  import { onMount } from "svelte";

  import Line from "svelte-chartjs/src/Line.svelte";
  import Pie from "svelte-chartjs/src/Pie.svelte";
  import MainHeader from "../components/mainComponent/mainHeader.svelte";
  import LeftPanel from "../components/mainComponent/leftPanel.svelte";

  onMount(() => {
    if (localStorage.getItem("account-credential")) {
      getDataSet();
    }
  });
</script>

<LeftPanel />

<Page name="home">
  <MainHeader />
  <Block strong>
    <Row>
      <Col width={0} medium={15} />
      <Col width={100} medium={35}>
        <Line
          data={$borrowChartData}
          height={350}
          options={lineOption("Peminjaman")}
        />
      </Col>
      <Col width={100} medium={35}>
        <Line
          data={$accessChartData}
          height={350}
          options={lineOption("Akses")}
        />
      </Col>
      <Col width={0} medium={15} />
    </Row>
    <Row>
      <Col width={0} medium={15} />
      <Col width={100} medium={35}>
        <Row>
          <Col>
            <Pie data={$bookChartData} {pieOption} />
          </Col>
          <Col>
            <Pie data={$paperChartData} {pieOption} />
          </Col>
        </Row>
      </Col>
      <Col width={100} medium={35}>
        <table class="make-center">
          <thead>
            <tr>
              <th class="label-cell">Borrow Total</th>
              <th class="numeric-cell">:</th>
              <th class="numeric-cell">100</th>
            </tr>
            <tr>
              <th class="label-cell">Access Total</th>
              <th class="numeric-cell">:</th>
              <th class="numeric-cell">100</th>
            </tr>
            <tr>
              <th class="label-cell">Book Total</th>
              <th class="numeric-cell">:</th>
              <th class="numeric-cell">100</th>
            </tr>
            <tr>
              <th class="label-cell">Paper Total</th>
              <th class="numeric-cell">:</th>
              <th class="numeric-cell">100</th>
            </tr>
          </thead>
        </table>
      </Col>
      <Col width={0} medium={15} />
    </Row>
  </Block>
</Page>
