<script>
  import { Row, Col, Button, PhotoBrowser, f7 } from "framework7-svelte";
  import { darkTheme, userData } from "../../js/store";
  import { updateImageContent } from "../../js/api/library";
  import { getData } from "../../js/api/profile";

  import ReportPopup from "../popupComponent/reportPopup.svelte";
  import LibraryImageContent from "../inputComponent/libraryImageContent.svelte";
  import LibraryImageContentAdd from "../inputComponent/libraryImageContentAdd.svelte";

  let pageDark, popupEditImage, imgIndex, popupAddImage;

  const sendUpdate = (body) => {
    f7.dialog.preloader();
    setTimeout(async () => {
      const resp = await updateImageContent(body);
      f7.dialog.close();
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
  };

  const imgClick = (i) => {
    f7.dialog
      .create({
        title: "Action",
        closeByBackdropClick: true,
        buttons: [
          {
            text: "View",
            onClick: () => {
              pageDark.open(i);
            },
          },
          {
            text: "Edit",
            onClick: () => {
              popupEditImage = true;
              imgIndex = i;
            },
          },
          {
            text: "Delete",
            onClick: () => {
              f7.dialog.confirm("Delete this image?", "Warning!", async () => {
                sendUpdate({
                  action: "delete",
                  index: i,
                });
              });
            },
            color: "red",
          },
        ],
        verticalButtons: true,
      })
      .open();
  };
</script>

<ReportPopup bind:popupOpened={popupEditImage}>
  <span slot="form">
    <LibraryImageContent bind:imgIndex />
  </span>
</ReportPopup>

<ReportPopup bind:popupOpened={popupAddImage}>
  <span slot="form">
    <LibraryImageContentAdd />
  </span>
</ReportPopup>

<Row>
  <Col width={80} />
  <Col width={20}>
    <Button
      fill
      on:click={() => {
        popupAddImage = true;
      }}>Add</Button
    >
  </Col>
</Row>
{#if $userData.contentImages}
  <PhotoBrowser
    photos={$userData.contentImages.length > 0 ? $userData.contentImages : []}
    theme={$darkTheme ? "dark" : "light"}
    type="popup"
    pageBackLinkText="Back"
    bind:this={pageDark}
  />
  <Row>
    {#each $userData.contentImages as link, i}
      <Col width="50" medium="25">
        <div
          on:click={() => {
            imgClick(i);
          }}
          class="image-container"
        >
          <img src={link} alt="" />
        </div>
      </Col>
    {/each}
  </Row>
{/if}

<style>
  .image-container {
    width: 100%;
    height: 210px;
  }

  .image-container > img {
    height: 200px;
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
</style>
