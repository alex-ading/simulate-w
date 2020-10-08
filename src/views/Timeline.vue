<template>
    <div>
        <navinfo>
            <img slot="left" src="../assets/home.png" alt="home" class="navinfo-left-icon" @click="clickRoutetoProfile">
            <div slot="middle" class="navinfo-middle-icon" @click="clickRoutetoMessage">
                <img src="../assets/message.png" alt="message">
                <span v-if="reminder!==0" class="navinfo-reminder">{{reminder}}</span>           
            </div>     
            <img slot="right" src="../assets/post.png" alt="post" class="navinfo-right-icon" @click="clickNewPost">           
        </navinfo>
        <div class="original-post-container" ref="container" @touchstart="handleTouchStart"
                                                            @touchmove="handleTouchMove"
                                                            @touchend="handleTouchEnd">
            <div class="refresh-container" ref="refresh">
                <div class="refresh">
                    <img v-if="!isRefresh" src="../assets/refresh.png" alt="refresh">
                    <img v-else src="../assets/refreshing.png" alt="refreshing">
                    <span>{{refreshText}}</span>
                </div>
                <original-post v-for="(item, index) in $store.state.timelineData" 
                                    :key="index"
                                    :itemInfo="item"
                                    @click.native="clickRoutetoPostDetail(item)"
                                    @cancelLike="cancelLike" @addLike="addLike"
                                    >
                    <div v-if="item.img" slot="post-img" :class="{'post-img-one': item.img.length === 1,
                                                                    'post-img-more': item.img.length !== 1}">
                        <img v-for="(img, imgindex) in item.img" :preview="index" :src="img" :key="imgindex" alt="pic">
                    </div>
                </original-post>
            </div>
        </div>
        <!-- <tabbar></tabbar> -->
    </div>
</template>

<script>
import axios from 'axios'
import Navinfo from '../components/Navinfo'
import OriginalPost from '../components/OriginalPost'
import Tabbar from '../components/Tabbar'


export default {
    data() {
        return {
            userid: null, // 登录者id
            tStartHeight: null, // touch 起始点
            tEndHeight: null, // touch 结束点
            tMoveHeight: null, // touch 移动时的距离
            refreshText: "下拉刷新",
            isRefresh: false,
            reminder: 0,
        }
    },

    methods: {
        clickRoutetoPostDetail(item) {
            if (event.target.nodeName === "IMG" && event.target.getAttribute("preview")) {
                // console.log("阻止冒泡" + event.target.nodeName)
            } else {
                // console.log("跳转详情页" + event.currentTarget.nodeName)
                // console.log("originalpostid: " + item.originalpostid)
                this.$router.push({
                    name: "OriginalPostDetail",
                    query: {
                        originalpostid: item.originalpostid
                    }
                })
            }
        },

        cancelLike(originalpostid) {
            // console.log("tl父 cancelLike");
            this.$store.dispatch("cancelLike", originalpostid)
        },

        addLike(originalpostid) {
            // console.log("tl父 addLike")
            this.$store.dispatch("addLike", originalpostid)
        },

        debounce(fn, interval) {
            let timer = null;
            return function() {
                if (timer) {
                    clearTimeout(timer);
                    timer = setTimeout(fn, interval);
                } else {
                    timer = setTimeout(fn, interval);
                }
            }

        },

        clickNewPost() {
            this.$router.push("/newpost")
        },

        clickRoutetoProfile() {
            this.$router.push({
                name: "Profile",
                query: {
                    profileid: this.userid
                }
            })
        },

        clickRoutetoMessage() {
            this.reminder = 0;
            this.$router.push({
                name: "Message",
            })
        },

        handleTouchStart(event) {
            // console.log("touchstart")
            this.tStartHeight = event.touches[0].pageY;
        },

        handleTouchMove(event) {
            this.tMoveHeight = event.touches[0].pageY;
            let container = this.$refs.container;
            let scrollHeight = container.scrollTop;

            let refresh = this.$refs.refresh;
            // console.log(scrollHeight, this.tMoveHeight, this.tStartHeight);


            if (scrollHeight <= 0) {
                if (0 <= this.tMoveHeight - this.tStartHeight && this.tMoveHeight - this.tStartHeight <= 50) {
                    event.preventDefault();
                    this.refreshText = "下拉刷新";
                    refresh.style.top = this.tMoveHeight - this.tStartHeight + "px";
                } else if (50 < this.tMoveHeight - this.tStartHeight && this.tMoveHeight - this.tStartHeight <= 70) {
                    event.preventDefault();
                    this.refreshText = "释放刷新";
                    refresh.style.top = this.tMoveHeight - this.tStartHeight + "px";                   
                } else if (this.tMoveHeight - this.tStartHeight > 70) {
                    event.preventDefault();
                    refresh.style.top = "70px"               
                }
            }
        },

        handleTouchEnd(event) {
            let container = this.$refs.container;
            let scrollHeight = container.scrollTop;
            let refresh = this.$refs.refresh;
            // console.log("scrollheight" + scrollHeight)
            if (scrollHeight <= 0) {
                if (this.tMoveHeight - this.tStartHeight < 50) {
                    refresh.style.top = 0;
                    // console.log("touchend");       
                } else {
                    this.refreshText = "正在刷新";      
                    this.isRefresh = true; 
                    setTimeout(() => {
                        this.$router.go(0);
                        refresh.style.top = 0;
                        this.refreshText = "下拉刷新";
                        this.isRefresh = false; 
                        // console.log("touchend");       
                    }, 600);
                }
            }
        }
    },
    components: {
        Navinfo,
        OriginalPost,
        Tabbar
    },

    created() {
        // console.log("tl created");
        this.userid = this.$store.state.userid;
        this.$store.dispatch("requestTimelineData", this.userid);
    },

    mounted() {
        let container = this.$refs.container;
        let scrollDebounce = this.debounce(() => {
            this.$store.commit("updatetlscrollTop", container.scrollTop)
            // console.log(container.scrollTop)
        }, 400);
        container.addEventListener("scroll", scrollDebounce, false); 

        axios({
            method: "get",
            url: "https://cloud-4gm4rigo8c5f1c23.service.tcloudbase.com/query_message",
            params: {
                userid: this.$store.state.userid // 登录者 id
            }
        }).then(res => {
            // console.log(res.data);
            // 未读的消息
            let readList = [];
            res.data.forEach(element => {
                if (element.isread === false) {
                    readList.push(element.originalpostid);
                }
            });

            this.reminder = readList.length;
            this.$store.commit("updateMessageData", {messageData: res.data, readList: readList});
        }).catch(err => {
            console.log(err);
        })
    },

    activated() {
        // console.log("tl activated");
        // console.log(this.$refs.container);
        if (this.$store.state.tlscrollTop) {
            let container = this.$refs.container;
            container.scrollTop = this.$store.state.tlscrollTop;   
        }
    },
}
</script>

<style lang="less">
    .navinfo-left-icon {
        position: absolute;
        left: 0.625em;
        width: 1.5em;
        height: 1.5em;
        margin-top: 0.59375em;
    }

    .navinfo-right-icon {
        position: absolute;
        right: 0.625em;
        width: 1.5em;
        height: 1.5em;
        margin-top: 0.59375em;
    }

    .navinfo-reminder {
        position: absolute;
        right: -0.6em;
        top: -0.3em;
        width: 1.5em;
        height: 1.5em;
        line-height: 1.5em;
        font-size: 1.2rem;
        background-color: lightcoral;
        border-radius:50%;
        color: white;
    }

    .navinfo-middle-icon {
        position: absolute;
        right: 3.6em;
        width: 1.5em;
        height: 1.5em;
        margin-top: 0.59375em;      
        
        img {
            height: 100%;
            width: 100%;
        }
    }

    .refresh {
        position: absolute;
        top: -3.75em;
        width: 100%;
        height: 3.75em;
        line-height: 3.75em;
        // border: 1px solid black;
        text-align: center;
        img {
            width: 1em;
            height: 1em;
            vertical-align: middle;
            margin-right: 0.4em;
        // border: 1px solid black;
        }
        span {
            vertical-align: middle;
        }
    }

    .refresh-container {
        position: absolute;
        top: 0;
        width: 100%;
    }

    .original-post-container {
        position: relative;
        width: 100%;
        height: calc(100% - 2.75em);
        overflow-x: hidden;
        overflow-y: scroll;
        text-align: left;
        // border: 1px solid black;

        .post-circle {
            display: inline-block;
            margin: 0.3125em 0 0.3125em 3.125em;
            padding: 0.125em 0.1875em;
            border-radius: 0.3125em;
            color: white;            
            background-color: #b0cac7;
        }

        .post-img-one {
            padding: 0.3125em 0 0.3125em 3.125em;
            width: 15em;
            // border:black 1px solid;
            img {
                display: block;
                max-width: 100%;
                border-radius: 0.1875em;
            }
        }

        .post-img-more {
            padding-top: 0.3125em;
            display: flex;
            // border: 1px solid black;
            margin-left: 3.125em;
            flex-wrap: wrap;

            img {
                width: 5em;
                flex: 0 0 auto;
                height: 5em;
                margin-right: 0.3125em;
                margin-bottom: 0.3125em;
                border-radius: 0.1875em;
                object-fit: cover;
            }

        }
    }

        
    

    /* .bottom-placeholder {
        height: 20.3125em;
        width: 100%;
        background-color:#bfbfbf
    } */


</style>