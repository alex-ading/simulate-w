<template>
    <div class="tabbar">
        <!-- <div class="item" @click="Routeto(tabbar[0].path)">
            <img v-if="isActiveTabbar===tabbar[0].path" src="../assets/activecredits.png" alt="icon">
            <img v-else src="../assets/credits.png" alt="icon">
            <p :class="{'is-isActive': isActiveTabbar===tabbar[0].path}">{{tabbar[0].name}}</p>
        </div> -->
        <div class="item" @click="Routeto(tabbar[1].path)">
            <img v-if="isActiveTabbar===tabbar[1].path" src="../assets/activecredits.png" alt="icon">
            <img v-else src="../assets/credits.png" alt="icon">
            <p :class="{'is-isActive': isActiveTabbar===tabbar[1].path}">{{tabbar[1].name}}</p>
        </div>
        <div class="item" @click="Routeto(tabbar[2].path)">
            <img v-if="isActiveTabbar===tabbar[2].path" src="../assets/activecredits.png" alt="icon">
            <img v-else src="../assets/credits.png" alt="icon">
            <!-- <p :class="{'is-isActive': isActiveTabbar===tabbar[2].path}">{{tabbar[2].name}}</p> -->
        </div>
        <div class="item" @click="Routeto(tabbar[3].path)">
            <img v-if="isActiveTabbar===tabbar[3].path" src="../assets/activecredits.png" alt="icon">
            <img v-else src="../assets/credits.png" alt="icon">
            <p :class="{'is-isActive': isActiveTabbar===tabbar[3].path}">{{tabbar[3].name}}</p>
        </div>
        <div class="item" @click="Routeto(tabbar[4].path)">
            <img v-if="isActiveTabbar===tabbar[4].path" src="../assets/activecredits.png" alt="icon">
            <img v-else src="../assets/credits.png" alt="icon">
            <p :class="{'is-isActive': isActiveTabbar===tabbar[4].path}">{{tabbar[4].name}}</p>
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
                }, {
                    name: '动态',
                    path: '/',
                }, {
                    name: '',
                    path: '/post',     
                }, {
                    name: '通知',
                    path: '/message',
                }, {
                    name: '我',
                    path: '/me',
                }
            ],

            isActiveTabbar: '/',

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
            this.isActiveTabbar = path;
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
        // border: 0.0625em solid black;
        height: 2.75em;
        border-top: 0.0625em solid #bfbfbf;
        padding: 0.125em 0;
        align-items: center;

        .item {
            flex: 1;
            font-size: 0;
            p,img {
                font-size: 1.2rem;
                // border: 0.0625em solid black;
            }
            img {
                height: 2em;
                width: 2em;
            }
            .is-isActive {
                color: cadetblue;
            }
        }
    }
</style>