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
    ListInput,
    List,
    f7,
    Button,
  } from "framework7-svelte";
  import { onMount } from "svelte";
  import { capitalize } from "../../js/utility";
  import { singlePaper, updatePaper, getPapers } from "../../js/api/paper";
  import { paperData, paperSubject, papersList } from "../../js/store";
  import { paperDetailTable } from "../../js/storeTable";
  import { PdfViewer } from "svelte-pdf-simple";
  import { delayer } from "../../js/api";

  import Permission from "../../components/otherComponent/permission.svelte";
  import Paper from "../../components/inputComponent/paper.svelte";

  let edit = false,
    input,
    files;
  export let id, f7router;

  let pdfViewer,
    pageNumber = 0,
    totalPages = 0,
    isPdfLoaded = false;

  let type = "journal",
    title,
    access = true,
    abstract;

  let descCount = 0,
    desc = [];

  const editButton = [
    { icon: "pencil", edit: false },
    { icon: "xmark", edit: true },
  ];

  const onChange = () => {
    let paperFile;
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        paperFile = reader.result.split(",")[1];
      });
      reader.readAsDataURL(file);
      f7.dialog.confirm("change paper file?", "", async () => {
        f7.dialog.preloader();
        setTimeout(async () => {
          const resp = await updatePaper(id, { file: paperFile });
          f7.dialog.close();
          f7.dialog.alert(
            resp.description ? resp.description : "server timeout",
            "",
            async () => {
              if (resp.status && resp.status == 200) {
                papersList.set(await getPapers());
                mounter();
              }
            }
          );
        }, 500);
      });
    }
  };

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

  const reformatDescription = (description) => {
    let body = [];
    Object.keys(description).forEach((k) => {
      body.push({ title: k, data: description[k] });
    });
    return body;
  };
  const mounter = async () => {
    f7.dialog.preloader();
    paperData.set({});
    paperData.set(await singlePaper(id));
    let d = $paperData.paper;
    type = d.type;
    title = d.title;
    access = d.access;
    abstract = d.abstract;
    paperSubject.set(d.subject);
    desc = reformatDescription(d.description);
    descCount = desc.length;
    f7.dialog.close();
  };
  onMount(() => {
    mounter();
  });
</script>

<Page>
  <Navbar
    title="Paper Detail"
    backLink
    backLinkForce
    backLinkUrl="/paper/list/"
  />

  <Row>
    <Col width={100} medium={50}>
      <Card class="demo-card-header-pic">
        <CardHeader valign="bottom">
          Paper Information
          {#each editButton as e}
            {#if e.edit == edit}
              <Button
                iconF7={e.icon}
                tooltip="Edit"
                on:click={() => {
                  edit = !edit;
                }}
              />
            {/if}
          {/each}
        </CardHeader>
        <CardContent>
          {#if edit}
            <Paper bind:title bind:abstract bind:access bind:type />
            <Card>
              <CardHeader>
                Paper Description
                <Button
                  iconF7="plus"
                  fill
                  on:click={() => {
                    f7.dialog.prompt(
                      "Enter new field name",
                      "",
                      async (name) => {
                        desc.push({ title: name, data: "" });
                        descCount++;
                      }
                    );
                  }}
                />
                <Button
                  iconF7="minus"
                  fill
                  on:click={() => {
                    if (descCount > 0) {
                      descCount -= 1;
                      desc.pop();
                    }
                  }}
                />
              </CardHeader>
              <CardContent>
                <List inlineLabels noHairlinesMd>
                  {#each Array(descCount) as _, i}
                    <ListInput
                      label={desc[i].title}
                      bind:value={desc[i].data}
                      type="text"
                      clearButton
                    />
                  {/each}
                </List>
              </CardContent>
            </Card>
          {:else}
            <Row>
              {#if $paperData.paper}
                <table>
                  <tbody>
                    {#each paperDetailTable as d}
                      {#if d.object}
                        {#each Object.keys($paperData.paper[d.data]) as e}
                          <tr>
                            <td class="label-cell">{capitalize(e)}</td>
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
      {#if !edit && $paperData.paper}
        <Card class="demo-card-header-pic">
          <CardHeader class="no-border" valign="bottom">Abstract</CardHeader>
          <CardContent>
            {$paperData.paper.abstract ? $paperData.paper.abstract : "-"}
          </CardContent>
        </Card>
      {/if}
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
        <CardHeader valign="bottom"
          >Paper File
          <div class="parent-div text-align-center">
            <button class="button button-fill"
              ><Icon f7="pencil" />Change file</button
            >
            <input
              bind:this={input}
              on:change={onChange}
              type="file"
              bind:value={files}
              accept=".pdf"
            />
          </div>
        </CardHeader>
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
  {#if edit}
    <Fab
      position="center-bottom"
      text="Save"
      on:click={async () => {
        f7.dialog.alert("save changes?", "", async () => {
          // f7.dialog.preloader();
          const description = {};

          desc.forEach((e) => {
            description[e.title] = e.data;
          });

          const body = {
            title,
            type,
            abstract,
            access,
            subject: $paperSubject,
            description,
          };

          let invalid = false;
          Object.keys(body).every((k) => {
            if (k == "access" || k == "description") {
              return true;
            }
            if (!body[k] || body[k].length < 1) {
              f7.dialog.alert(`${k} can't be empty`, "");
              invalid = true;
              return false;
            }
            return true;
          });
          if (invalid) {
            return;
          }
          const resp = await updatePaper(id, body);
          f7.dialog.close();
          f7.dialog.alert(
            resp.description ? resp.description : "server timeout",
            "",
            async () => {
              if (resp.status && resp.status == 200) {
                papersList.set(await getPapers());
                mounter();
                edit = false;
              }
            }
          );
        });
      }}
    >
      <Icon ios="f7:floppy_disk" aurora="f7:floppy_disk" md="material:save" />
    </Fab>
  {/if}
</Page>

<style>
  .parent-div {
    position: relative;
    overflow: hidden;
  }
  .parent-div input[type="file"] {
    left: 0;
    top: 0;
    opacity: 0;
    position: absolute;
    font-size: 90px;
  }
</style>
