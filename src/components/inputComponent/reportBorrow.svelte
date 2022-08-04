<script>
  import { f7, List, Button } from "framework7-svelte";
  import { onMount } from "svelte";
  import { getReport } from "../../js/api";
  import { isoToDmy } from "../../js/utility";

  let dateInput,
    calendarRange,
    timeFilter = [new Date("05/08/2017"), new Date()];
  const timeData = ["from", "to"];

  onMount(() => {
    calendarRange = f7.calendar.create({
      inputEl: "#demo-calendar-range",
      dateFormat: { day: "2-digit", month: "long", year: "numeric" },
      rangePicker: true,
      on: {
        close: () => {
          timeFilter = calendarRange.getValue();
        },
      },
    });
  });

  const actionBorrow = () => {
    var query = new URLSearchParams();
    let path = "borrow?";
    timeFilter.forEach((e, i) => {
      query.append(timeData[i], isoToDmy(e, "yyyymmdd"));
    });

    dateInput.value = "";
    timeFilter = [new Date("05/08/2017"), new Date()];
    getReport(`${path}${query.toString()}`);
  };
</script>

<List>
  <div class="list no-hairlines-md inline-labels">
    <div class="item-content item-input">
      <div class="item-inner">
        <div class="item-title item-label">Date</div>
        <div class="item-input-wrap">
          <input
            type="text"
            placeholder="Select date range"
            bind:this={dateInput}
            readonly="readonly"
            id="demo-calendar-range"
          />
          <span
            class="input-clear-button"
            on:click={() => {
              timeFilter = [new Date("05/08/2017"), new Date()];
            }}
          />
        </div>
      </div>
    </div>
  </div>
  <Button fill on:click={actionBorrow}>Get Report</Button>
</List>
