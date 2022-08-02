<script>
  import {
    Page,
    Navbar,
    Row,
    Col,
    Card,
    CardContent,
    CardHeader,
    Fab,
    Icon,
    NavRight,
    Link,
    f7,
  } from "framework7-svelte";
  import { onMount } from "svelte";
  import { capitalize } from "../../js/utility";
  import { singlePaper } from "../../js/api/paper";
  import { paperData } from "../../js/store";
  import { paperDetailTable } from "../../js/storeTable";
  import { PdfViewer } from "svelte-pdf-simple";
  import { delayer } from "../../js/api";

  import Permission from "../../components/otherComponent/permission.svelte";

  let edit = false;
  export let id, f7router;

  let pdfViewer,
    pageNumber = 0,
    totalPages = 0,
    isPdfLoaded = false;

  const handleNextPage = (event) => {
    pageNumber++;
  };

  const handlePrevPage = (event) => {
    pageNumber--;
  };

  const onNextPage = () => {
    pdfViewer.next();
  };

  const onPrevPage = () => {
    pdfViewer.prev();
  };

  const handleLoadedSuccess = (event) => {
    totalPages = event.detail.pages;
    pageNumber = 1;
    isPdfLoaded = true;
  };

  onMount(async () => {
    f7.dialog.preloader();
    paperData.set({});
    paperData.set(await singlePaper(id));
    console.log($paperData);
    f7.dialog.close();
  });
</script>

<Page>
  <Navbar
    title="Paper Detail"
    backLink
    backLinkForce
    backLinkUrl="/paper/list/"
  >
    <NavRight>
      <Link
        iconIos="f7:pencil"
        iconAurora="f7:pencil"
        iconMd="material:edit"
        tooltip="Edit"
        href={`/paper/edit/${id}/`}
      />
    </NavRight>
  </Navbar>

  <Row>
    <Col width={100} medium={50}>
      <Card class="demo-card-header-pic">
        <CardHeader valign="bottom">Paper Information</CardHeader>
        <CardContent>
          {#if edit}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet
            reiciendis, perspiciatis ipsam impedit molestias quam possimus
            voluptatibus unde sint dignissimos voluptates tempore aliquam modi
            in alias quod ea officia cum.
          {:else}
            <Row>
              {#if $paperData.paper}
                <table>
                  <tbody>
                    {#each paperDetailTable as d}
                      {#if d.object}
                        {#each Object.keys($paperData.paper[d.data]) as e}
                          <tr>
                            <td class="label-cell">{e}</td>
                            <td width={20} class="numeric-cell">:</td>
                            <td class="numeric-cell">
                              {capitalize($paperData.paper[d.data][e])}
                            </td>
                          </tr>
                        {/each}
                      {:else}
                        <tr>
                          <td class="label-cell">{d.title}</td>
                          <td width={20} class="numeric-cell">:</td>
                          <td class="numeric-cell">
                            {#if $paperData.paper[d.data] && !d.bool}
                              {#if d.array}
                                {$paperData.paper[d.data].join(", ")}
                              {:else}
                                {capitalize($paperData.paper[d.data])}
                              {/if}
                            {:else if d.bool}
                              {#if $paperData.paper[d.data]}
                                Accessible
                              {:else}
                                Not Accessible
                              {/if}
                            {/if}
                          </td>
                        </tr>
                      {/if}
                    {/each}
                  </tbody>
                </table>
              {/if}
            </Row>
          {/if}
        </CardContent>
      </Card>
      <Card class="demo-card-header-pic">
        <CardHeader class="no-border" valign="bottom">Permission</CardHeader>
        <CardContent>
          {#if $paperData.permission && $paperData.permission.length > 0}
            <Permission
              callApi={delayer($paperData.permission)}
              viewPaper={false}
              viewFilter={false}
              bind:f7router
            />
          {:else}
            There is no borrow yet
          {/if}
        </CardContent>
      </Card>
    </Col>
    <Col width={100} medium={50}>
      <Card>
        <CardHeader valign="bottom">Paper File</CardHeader>
        {#if $paperData.paper}
          <CardContent>
            {#if isPdfLoaded}
              <Fab position="right-center" on:click={onNextPage}>
                <Icon
                  ios="f7:arrow_left"
                  aurora="f7:arrow_left"
                  md="material:east"
                />
              </Fab>
              <Fab position="left-center" on:click={onPrevPage}>
                <Icon
                  ios="f7:arrow_right"
                  aurora="f7:arrow_right"
                  md="material:west"
                />
              </Fab>
              <span>{pageNumber}/{totalPages}</span>
            {/if}
            <PdfViewer
              bind:this={pdfViewer}
              on:next={handleNextPage}
              on:prev={handlePrevPage}
              on:load_success={handleLoadedSuccess}
              url={$paperData.paper.paperUrl}
              httpHeaders={{
                authorization: `Bearer ${localStorage.getItem(
                  "account-credential"
                )}`,
              }}
              style={"border: 1px solid black; display: block; margin: 10px auto; width:95%; "}
            >
              <svelte:fragment slot="loading">Loading pdf..</svelte:fragment>
              <svelte:fragment slot="loading-failed"
                >Well... something went wrong :(</svelte:fragment
              >
            </PdfViewer>
          </CardContent>
        {/if}
      </Card>
    </Col>
  </Row>
</Page>
