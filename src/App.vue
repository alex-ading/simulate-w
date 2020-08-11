<template>
  <div id="app">
    <router-view class="view"></router-view>
    <tabbar></tabbar>
  </div>
</template>

<script>
import Tabbar from '../src/components/Tabbar'
export default {
  components: {
    Tabbar
  }
  
}
</script>

<style lang="less">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;

}
body, html {
    height: 100%;
    width: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  // border: 1px solid black;
}

.view {
  height: calc(100% - 44px);
    // border: 1px solid black;
    // background-color: chocolate;

}
</style>
