<script>
  import { List, ListInput, Button, f7 } from "framework7-svelte";
  import { onMount } from "svelte";
  import { updateGeneral } from "../../js/api/library";
  import { userData } from "../../js/store";
  import { getData } from "../../js/api/profile";

  let name, webpage, address, description, borrowLimit;
  onMount(() => {
    if ($userData) {
      name = $userData.libraryName;
      webpage = $userData.webpage;
      address = $userData.libraryAddress;
      description = $userData.description;
      borrowLimit = $userData.libraryBorrowLimit;
    }
  });

  export let generalEdit;
</script>

<List>
  <ListInput label="Name" type="text" bind:value={name} />
  <ListInput label="Webpage" type="text" bind:value={webpage} />
  <ListInput label="Address" type="textarea" bind:value={address} />
  <ListInput label="Borrow Limit" type="number" bind:value={borrowLimit} />
  <ListInput label="Description" type="textarea" bind:value={description} />
  <Button
    fill
    on:click={async () => {
      if (name && webpage && address && description) {
        f7.dialog.preloader();
        setTimeout(async () => {
          const resp = await updateGeneral({
            name,
            webpage,
            address,
            description,
            borrowLimit: parseInt(borrowLimit),
          });
          f7.dialog.close();
          generalEdit = !generalEdit;
          f7.dialog.alert(
            resp.description ? resp.description : "server timeout",
            "",
            async () => {
              if (resp.status && resp.status == 200) {
                getData();
              }
            }
          );
        }, 500);
      } else {
        f7.dialog.alert("fill all information");
      }
    }}>Save</Button
  >
</List>
