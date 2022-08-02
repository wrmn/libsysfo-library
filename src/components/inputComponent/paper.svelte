<script>
  import {
    List,
    ListInput,
    ListItem,
    Toggle,
    Row,
    Col,
    Icon,
  } from "framework7-svelte";
  import { paperSubject } from "../../js/store";

  let paperTypeSelect, paperSubjectSelect, paperSubj;
  export let title, abstract, access, type;
</script>

<List inlineLabels noHairlinesMd>
  <ListInput label="Title" bind:value={title} type="text" clearButton />
  <ListItem
    title="Paper Type"
    smartSelect
    bind:this={paperTypeSelect}
    smartSelectParams={{
      openIn: "popup",
      closeOnSelect: true,
      on: {
        close: () => {
          type = paperTypeSelect.smartSelectInstance().getValue();
        },
      },
    }}
  >
    <select name="superhero" value={type} on:change={() => {}}>
      <option value="journal">Journal</option>
      <option value="thesis">Thesis</option>
      <option value="other document">Other Document</option>
    </select>
  </ListItem>
  <ListItem>
    <span>Accessible</span>
    <Toggle
      checked={access}
      on:change={() => {
        access = !access;
      }}
    />
  </ListItem>
  <ListInput
    label="Subject"
    bind:value={paperSubjectSelect}
    type="text"
    on:change={() => {
      paperSubj = $paperSubject;
      paperSubj.push(paperSubjectSelect);
      paperSubject.set(paperSubj);
      paperSubjectSelect = "";
      paperSubj = [];
    }}
    clearButton
  />
  <Row width={100}>
    {#each $paperSubject as p}
      <Col width={25}>
        <div
          class="bg-color-primary  text-align-center"
          style="cursor: pointer; border-radius:25px; width:auto; padding: 5px;"
          on:click={() => {
            paperSubject.set($paperSubject.filter((item) => item !== p));
          }}
        >
          {p}
          <Icon f7="xmark_circle_fill" color="white" size={15} />
        </div>
      </Col>
    {/each}
  </Row>
  <ListInput label="Abstract" type="textarea" bind:value={abstract} resizable />
</List>
