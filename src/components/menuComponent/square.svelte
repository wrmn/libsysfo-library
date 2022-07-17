<script>
  import { Row, Col } from "framework7-svelte";
  export let menuName = "";
</script>

<div class="menu-square  icon-tooltip">
  <Row>
    {menuName}
</Row>
  <Row>
    <slot name="content" />
  </Row>
</div>

<style>
  .menu-square {
    height: 13vw;
    min-height: 200px;
    width: 40vw;
    background-color: #977560aa;
    transition: 250ms linear;
    border-radius: 0 10%;
    margin: 20px auto;
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;
  }

  .menu-square:hover {
    background-color: #b79580;
  }
</style>
