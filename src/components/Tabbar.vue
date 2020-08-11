<template>
  <div class="tabbar">
    <div class="item" v-for="item in tabbar" :key="item.path" @click="Routeto(item.path)">
      <img v-if="item.active" src="../assets/activecredits.png" alt="icon">
      <img v-else src="../assets/credits.png" alt="icon">
      <p :class="{'is-active': activeTabbar===item.path}">{{item.name}}</p>
    </div>
  </div>
</template>

<script>
export default {
    name: 'Tabbar',
    data() {
        return {
            tabbar: [
                {
                    name: '圈子',
                    path: '/circle',
                    active: false
                }, {
                    name: '动态',
                    path: '/',
                    active: true,
                }, {
                    name: '',
                    path: '/post',     
                    active: false
                }, {
                    name: '通知',
                    path: '/message',
                    active: false
                }, {
                    name: '我',
                    path: '/me',
                    active: false
                }
            ],

            activeTabbar: '/',

        }
    },

    methods: {
        /**
         *  点击按钮，跳转路由，icon 颜色和字体颜色做相应变化
         * 
         *  @param {string} path 路由配置里的 path
         */
        Routeto (path) {
            this.$router.push(path);
            console.log(path);
            this.activeTabbar = path;
        }
    },

}
</script>

<style lang="less">
    .tabbar {
        box-sizing: border-box;
        width: 100%;
        display: flex;
        position: absolute;
        bottom: 0;
        // border: 1px solid black;
        height: 44px;
        border-top: 1px solid #bfbfbf;
        padding: 2px 0;

        .item {
            flex: 1;
            font-size: 0;
            p,img {
                font-size: 12px;
                // border: 1px solid black;
            }
            img {
                height: 24px;
                width: 24px;
            }
            .is-active {
                color: cadetblue;
            }
        }
    }
</style>