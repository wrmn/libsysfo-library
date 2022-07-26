<script>
  import { Link } from "framework7-svelte";
  export let menuName = "";
  export let href = "";
</script>

<Link {href}>
  <div class="menu-square  icon-tooltip">
    {menuName}
    <slot name="content" />
  </div>
</Link>

<style>
  .menu-square {
    height: 13vw;
    min-height: 200px;
    width: 40vw;
    background-color: #977560aa;
    transition: 250ms linear;
    border-radius: 0 10%;
    margin: 20px 3vw;
    display: flex;
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;
    color: #fff;
  }

  .menu-square:hover {
    background-color: #b79580;
    color: #000;
  }
</style>
