<script>
  import { Button, Page, Block, Row, Col, f7 } from "framework7-svelte";
  import {
    accessChartData,
    borrowChartData,
    bookChartData,
    paperChartData,
    otherData,
  } from "../js/store";
  import { dashboardTable } from "../js/storeTable";
  import { getDataSet, lineOption, pieOption } from "../js/api/dataset";
  import { onMount } from "svelte";
  import { monthValues, yearValues } from "../js/utility";

  import Line from "svelte-chartjs/src/Line.svelte";
  import Pie from "svelte-chartjs/src/Pie.svelte";
  import MainHeader from "../components/mainComponent/mainHeader.svelte";
  import LeftPanel from "../components/mainComponent/leftPanel.svelte";

  let datarange = {};

  onMount(() => {
    const spanBegin = new Date();
    const spanEnd = new Date();
    spanBegin.setMonth(spanBegin.getMonth() - 6);

    f7.picker.create({
      inputEl: "#demo-picker-device",
      openIn: "sheet",
      rotateEffect: true,
      value: [
        spanBegin.getMonth(),
        spanBegin.getFullYear(),
        spanEnd.getMonth(),
        spanEnd.getFullYear(),
      ],
      formatValue: function (values) {
        return (
          monthValues.displayValues[values[0]] +
          " " +
          values[1] +
          "-" +
          monthValues.displayValues[values[2]] +
          " " +
          values[3]
        );
      },
      cols: [
        { ...monthValues },
        { ...yearValues },
        {
          divider: true,
          content: "&nbsp;-&nbsp;",
        },
        { ...monthValues },
        { ...yearValues },
      ],
      on: {
        change: function (picker, values) {
          if (values[3] < values[1]) {
            picker.cols[4].setValue(values[1]);
          }
          if (
            parseInt(values[2]) <= parseInt(values[0]) &&
            values[3] == values[1]
          ) {
            picker.cols[3].setValue(parseInt(values[0]) + 1);
          }

          let fm = parseInt(values[0]) + 1;
          let tm = parseInt(values[2]) + 1;

          datarange.fromDate = `${values[1]}${fm < 10 ? "0" + fm : fm}01`;

          datarange.toDate = `${values[3]}${tm < 10 ? "0" + tm : tm}01`;
        },
        close: () => {
          getDataSet(datarange);
        },
      },
    });
  });
</script>

<LeftPanel />

<Page name="home">
  <MainHeader />
  <Block strong>
    <Row>
      <div class="item-content item-input make-center">
        <div class="item-inner">
          <Button class="item-input-wrap" fill>
            <input
              class="text-align-center"
              type="text"
              placeholder="Date Range"
              readonly="readonly"
              id="demo-picker-device"
            />
          </Button>
        </div>
      </div>
    </Row>
    <Row>
      <Col width={0} medium={15} />
      <Col width={100} medium={35}>
        <Line
          data={$borrowChartData}
          height={350}
          options={lineOption("Book Borrow")}
        />
      </Col>
      <Col width={100} medium={35}>
        <Line
          data={$accessChartData}
          height={350}
          options={lineOption("Paper Akses")}
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
            {#each $dashboardTable as d}
              <tr>
                <th class="label-cell">{d.Title}</th>
                <th class="numeric-cell">:</th>
                <th class="numeric-cell">{$otherData[d.data]}</th>
              </tr>
            {/each}
          </thead>
        </table>
      </Col>
      <Col width={0} medium={15} />
    </Row>
  </Block>
</Page>
