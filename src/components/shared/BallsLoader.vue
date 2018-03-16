<template>
  <div class="container">
    <div class="row cf">
      <div class="three col">
        <div class="loader" id="mini_loader">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MiniLoader'
}
</script>

<style scoped>

  /* GRID */
  .three {
    width: 23.8%;
  }

  /* COLUMNS */
  .col {
    display: block;
    float: left;
    margin: 1% 0 1% 1.6%;
  }

  .col:first-of-type {
    margin-left: 0;
  }

  .container {
    width: 100%;
    max-width: 940px;
    margin: 0 auto;
    position: relative;
    text-align: center;
  }

  /* CLEARFIX */

  .cf:before,
  .cf:after {
    content: " ";
    display: table;
  }

  .cf:after {
    clear: both;
  }

  .cf {
    *zoom: 1;
  }

  /* ALL LOADERS */

  .loader {
    width: 150px;
    height: 10px;
    border-radius: 100%;
    position: relative;
    margin: -11px -5px;
  }

  /* LOADER 4 */

  #mini_loader span {
    display: inline-block;
    width: 13px;
    height: 13px;
    border-radius: 100%;
    background-color: white;
    margin: 5px 5px;
    opacity: 0;
  }

  #mini_loader span:nth-child(1) {
    animation: opacitychange 1.75s ease-in-out infinite;
  }

  #mini_loader span:nth-child(2) {
    animation: opacitychange 1.75s ease-in-out 0.25s infinite;
  }

  #mini_loader span:nth-child(3) {
    animation: opacitychange 1.75s ease-in-out 0.5s infinite;
  }

  #mini_loader span:nth-child(4) {
    animation: opacitychange 1.75s ease-in-out 0.75s infinite;
  }

  #mini_loader span:nth-child(5) {
    animation: opacitychange 1.75s ease-in-out 1s infinite;
  }

  @keyframes opacitychange {
    0%, 100% {
      opacity: 0;
    }

    60% {
      opacity: 1;
    }
  }
</style>
