<script>
  import {
    Page,
    Navbar,
    Fab,
    Card,
    CardHeader,
    CardContent,
    List,
    ListInput,
    Row,
    Col,
    Icon,
    Button,
    f7,
  } from "framework7-svelte";
  import { onMount } from "svelte";
  import { paperSubject } from "../../js/store";
  import { newPaper } from "../../js/api/paper";
  import Paper from "../../components/inputComponent/paper.svelte";

  let type = "journal",
    title,
    access = true,
    abstract,
    paperFile;
    
  let input, files;

  export let f7router;

  let descCount = 0,
    desc = [];

  const onChange = () => {
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        paperFile = reader.result.split(",")[1];
      });
      reader.readAsDataURL(file);
    }
  };

  onMount(() => {
    paperSubject.set([]);
  });
</script>

<Page>
  <Navbar title="Add New Paper / Document" backLink="Back" />
  <Row>
    <Col width={100} medium={50}>
      <Card>
        <CardHeader>General Information</CardHeader>
        <CardContent>
          <Paper bind:title bind:abstract bind:access bind:type />
        </CardContent>
      </Card>
    </Col>
    <Col width={100} medium={50}>
      <Card>
        <CardHeader>
          Paper Description
          <Button
            iconF7="plus"
            fill
            on:click={() => {
              f7.dialog.prompt("Enter new field name", "", async (name) => {
                desc.push({ title: name, data: "" });
                descCount++;
              });
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
      <Card>
        <CardHeader>Paper File</CardHeader>
        <CardContent>
          {files ? files : "-"}
          <div class="parent-div text-align-center">
            <button class="button button-fill">Select File</button>
            <input
              bind:this={input}
              on:change={onChange}
              type="file"
              bind:value={files}
              accept=".pdf"
            />
          </div>
        </CardContent>
      </Card>
    </Col>
  </Row>
  <Fab
    position="center-bottom"
    text="Create"
    on:click={async () => {
      f7.dialog.alert("save changes?", "", async () => {
        f7.dialog.preloader();
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
          paperFile,
        };

        let invalid = false;
        Object.keys(body).every((k) => {
          if (
            (!body[k] || body[k].length < 1) &&
            (k !== "access" || k != "description")
          ) {
            f7.dialog.alert(`${k} can't be empty`, "");
            invalid = true;
            return false;
          }
          return true;
        });
        if (invalid) {
          return;
        }
        const resp = await newPaper(body);
        f7.dialog.close();
        f7.dialog.alert(
          resp.description ? resp.description : "server timeout",
          "",
          () => {
            if (resp.status && resp.status == 200) {
              f7router.back();
            }
          }
        );
      });
    }}
  >
    <Icon ios="f7:plus" aurora="f7:plus" md="material:add" />
  </Fab>
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
