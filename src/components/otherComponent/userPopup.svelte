<script>
  import { dataset } from "dom7";
  import {
    Popup,
    Page,
    Navbar,
    NavRight,
    Link,
    Card,
    Row,
    Col,
  } from "framework7-svelte";
  import { userDetail } from "../../js/store";
  import { userDetailTable } from "../../js/storeTable";
  import { isoToDmy } from "../../js/utility";

  export let popupOpened = false;
</script>

<Popup
  class="demo-popup"
  opened={popupOpened}
  onPopupClosed={() => (popupOpened = false)}
>
  <Page>
    <Navbar title="User Information">
      <NavRight>
        <Link popupClose iconF7="xmark" iconSize="35px" />
      </NavRight>
    </Navbar>
    <Card>
      {#if $userDetail.profile}
        <Row>
          <Col width={50}>
            <img
              src={$userDetail.profile.images
                ? $userDetail.profile.images
                : "https://dummyimage.com/600x400/ababab/0011ff"}
              alt=""
              class="lib-hero-image"
            />
          </Col>

          <Col width={50}>
            <table class="make-capital">
              <thead>
                {#each $userDetailTable as d}
                  <tr>
                    <td class="label-cell">{d.Title}</td>
                    <td width={20} class="numeric-cell">:</td>
                    <td class="numeric-cell">
                      {#if d.data}
                        {$userDetail.profile[d.data]
                          ? d.dataSelect
                            ? d.dataSelect[$userDetail.profile[d.data]]
                            : $userDetail.profile[d.data]
                          : "-"}
                      {:else if d.dataSet}
                        {#each d.dataSet as e, i}
                          {$userDetail.profile[e.data]
                            ? e.time
                              ? isoToDmy(
                                  $userDetail.profile[e.data],
                                  "dd mmmm yyyy"
                                )
                              : $userDetail.profile[e.data]
                            : "-"}
                          {#if i + 1 != d.dataSet.length && d.separator}
                            {d.separator}
                          {/if}
                        {/each}
                      {/if}
                      <br />
                      {#if d.conditionalData}
                        {$userDetail.profile[d.conditionalData.data]
                          ? `(${d.conditionalData.text})`
                          : ""}
                      {/if}
                    </td>
                  </tr>
                {/each}
              </thead>
            </table>
          </Col>
        </Row>
      {/if}
    </Card>
  </Page>
</Popup>

<style>
  .lib-hero-image {
    height: 50vh;
    max-height: 500px;
    width: 100%;
    object-fit: contain;
    object-position: center;
  }
</style>
