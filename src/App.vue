<template>
    <div id="app">
      <keep-alive exclude="OriginalPostDetail,Followers,Followings,Repost,CommentDetail,Message,NewPost">
            <router-view class="view"></router-view>
      </keep-alive>
    </div>
</template>

<script>
// import Tabbar from '../src/components/Tabbar'
export default {
  components: {
    // Tabbar
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
      line-height: 1.3;
  }

  html {
    font-size: 62.5%;
  }

  body {
    font-size: 1.6rem;

  }

  input{
    outline: none;
    color: #2c3e50;
    font-family: Microsoft YaHei;
  }
  textarea{
    outline: none;
    color: #2c3e50;
    resize: none; // 禁用右下角拖动图标
    font-size: 1.6rem;
    font-family: Microsoft YaHei;
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
    height: 100%;
    // border: 1px solid black;
      // background-color: chocolate;
  }
</style>
