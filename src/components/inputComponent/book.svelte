<script>
  import { List, ListInput, ListItem, f7 } from "framework7-svelte";
  import { onMount } from "svelte";
  import { categories, languages, countries } from "../../js/storeTable";
  import { isoToDmy } from "../../js/utility";
  let input,
    container,
    image,
    files,
    category,
    language,
    country,
    calendarDateFormat;
  let showImage = false;

  onMount(() => {
    calendarDateFormat = f7.calendar.create({
      inputEl: "#demo-calendar-date-format",
      dateFormat: "dd MM yyyy",
      closeOnSelect: true,
      on: {
        close: function () {
          data.releaseDate = isoToDmy(
            calendarDateFormat.getValue(),
            "dd mmmm yyyy"
          );
        },
      },
    });
  });
  function onChange() {
    const file = input.files[0];

    if (file) {
      showImage = true;

      const reader = new FileReader();
      reader.addEventListener("load", function () {
        data.image = reader.result.split(",")[1];
        image.setAttribute("src", reader.result);
      });
      reader.readAsDataURL(file);
      console.log(data);
      return;
    }

    showImage = false;
  }

  let data = {
    title: "",
    author: "",
    category: "",
    language: "",
    country: "",
    publisher: "",
    releaseDate: "",
    pageCount: 0,
    description: "",
    image: "",
  };

  export const getData = () => data;
</script>

<List noHairlinesMd>
  <ListInput
    label="Title"
    type="text"
    placeholder="Book Title"
    bind:value={data.title}
    floatingLabel
  />
  <ListInput
    label="Author"
    type="text"
    placeholder="Book Title"
    bind:value={data.author}
    floatingLabel
  />
  <ListItem
    title="Category"
    smartSelect
    bind:this={category}
    smartSelectParams={{
      openIn: "popup",
      searchbar: true,
      searchbarPlaceholder: "Search Category",
    }}
  >
    <select
      name="category"
      value=""
      on:change={() => {
        category.smartSelectInstance().close();
        data.category = category.smartSelectInstance().getValue();
      }}
    >
      {#each categories as bookCategory}
        <option value={bookCategory}>{bookCategory}</option>
      {/each}
    </select>
  </ListItem>
  <ListItem
    title="Language"
    smartSelect
    bind:this={language}
    smartSelectParams={{
      openIn: "popup",
      searchbar: true,
      searchbarPlaceholder: "Search Language",
    }}
  >
    <select
      name="language"
      value=""
      on:change={() => {
        language.smartSelectInstance().close();
        data.language = language.smartSelectInstance().getValue();
      }}
    >
      {#each languages as bookLanguage}
        <option value={bookLanguage}>{bookLanguage}</option>
      {/each}
    </select>
  </ListItem>

  <ListItem
    title="Country"
    smartSelect
    bind:this={country}
    smartSelectParams={{
      openIn: "popup",
      searchbar: true,
      searchbarPlaceholder: "Search Country",
    }}
  >
    <select
      name="country"
      value=""
      on:change={() => {
        country.smartSelectInstance().close();
        data.country = country.smartSelectInstance().getValue();
      }}
    >
      {#each countries as bookCountry}
        <option value={bookCountry}>{bookCountry}</option>
      {/each}
    </select>
  </ListItem>
  <ListInput
    label="Publisher"
    type="text"
    placeholder="Book Publisher"
    bind:value={data.publisher}
    floatingLabel
  />
  <ListInput
    label="Release Date"
    type="text"
    bind:value={data.releaseDate}
    placeholder="Book Release Date"
    readonly="readonly"
    id="demo-calendar-date-format"
    floatingLabel
  />
  <ListInput
    label="Page Count"
    type="number"
    placeholder="Book Title"
    bind:value={data.pageCount}
    floatingLabel
    on:change={() => {
      data.pageCount = parseInt(data.pageCount);
    }}
  />
  <ListInput
    label="Description"
    type="textarea"
    bind:value={data.description}
    resizable
    placeholder="Book Title"
  />

  <div class="parent-div text-align-center">
    <button class="button button-fill">Select Book Cover</button>
    <input
      bind:this={input}
      on:change={onChange}
      type="file"
      bind:value={files}
      accept="image/*"
    />
  </div>

  <div bind:this={container} class="text-align-center">
    {#if showImage}
      <img bind:this={image} src="" alt="Preview" class="lib-hero-image" />
    {/if}
  </div>
</List>

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
  .lib-hero-image {
    max-height: 250px;
    max-width: 80%;
    object-fit: scale-down;
    object-position: center;
  }
</style>
