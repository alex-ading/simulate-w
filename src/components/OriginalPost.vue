<template>
    <div class="original-post">
        <div class="post-user-info">
            <img class="post-head-portrait post-user-info-item" :src="itemInfo.headportrait" alt="" @click.stop="clickRoutetoProfile">
            <div class="post-user-info-item">
                <p class="post-user-name">{{itemInfo.username}}</p>
                <p class="post-time">{{itemInfo.time | timeFilter}}</p>
            </div>
        </div>
        <div class="post-detail">
            <p>{{itemInfo.detail}}</p>
            <repost-detail v-if="itemInfo.originalpost" :opData="itemInfo.originalpost"></repost-detail>
        </div>
        <slot name="post-img"></slot>
        <slot name="post-circle"></slot>
        <div class="post-react">
            <div class="post-like post-react-item"  @click.stop="clickLikePost">
                <img v-if="isLike" src="../assets/activelike.png" alt="like">
                <img v-else src="../assets/like.png" alt="like">
                <span v-if="itemInfo.likes.length!==0">{{itemInfo.likes.length}}</span>
            </div>

            <div class="post-comment post-react-item">
                <img src="../assets/comment.png" alt="comment">
                <span v-if="itemInfo.comments.length!==0">{{totalComment}}</span>
            </div>

            <div class="post-repost post-react-item"  @click.stop="clickRoutetoRepost">
                <img src="../assets/repost.png" alt="repost">
                <span v-if="itemInfo.reposts.length!==0">{{itemInfo.reposts.length}}</span>
            </div>
        </div>
    </div>
</template>

<script>
import RepostDetail from './RepostDetail'

export default {
    name: "OriginalPost",

    props: ["itemInfo"],

    data() {
        return {
            userid: null // 登录者id
        }
    },
    
    filters: {
        timeFilter(timestamp) {
            let time = new Date(timestamp);
            let month = time.getMonth() + 1;
            let date = time.getDate();
            let hour = time.getHours();
            let min = String(time.getMinutes()).padStart(2, '0');
            let sec = String(time.getSeconds()).padStart(2, '0');
            return month + "月" + date + "日 " + hour + ":" + min + ":" + sec
        }
    },

    components: {
        RepostDetail
    },

    methods: {
        clickLikePost() {
            if (this.isLike) {
                this.$emit("cancelLike", this.itemInfo.originalpostid)
            } else {
                // 加入
                this.$emit("addLike", this.itemInfo.originalpostid)
            }
        },

        clickRoutetoRepost() {
            this.$router.push({
                name: "Repost",
                query: {
                    originalpostid: this.itemInfo.originalpostid
                }
            })
        },
        
        clickRoutetoProfile() {
            if (this.$route.name !== "Profile") {
                this.$router.push({
                    name: "Profile",
                    query: {
                        profileid: this.itemInfo.userid // op作者id
                    }
                }) 
            }
        }
    },
    created() {
        // console.log("op created")
        this.userid = this.$store.state.userid;
    },

    computed: {
        isLike() {
            if (this.itemInfo) {
                for (let i of this.itemInfo.likes) {
                    if (i.userid === this.userid) {
                        return true
                    }
                }
            }
            return false
        },

        totalComment() {
            let total = this.itemInfo.comments.length;
            for (let comment of this.itemInfo.comments) {
                if (comment.replies) {
                    total += comment.replies.length;
                }
            }
            return total
        }
    },
}
</script>

<style lang="less">
    .original-post {
        width: 100%;
        padding: 0.3125em 0.625em 0.3125em 0.625em;
        border-bottom: 0.0625em solid #bfbfbf;
        background-color: white;

        .post-user-info {
            // border: 0.0625em solid black;
            text-align: left;
            display: flex;
            align-items: center;
            margin: 0.3125em 0;

            .post-user-info-item {
                flex-grow: 0;
            }

            .post-head-portrait {
                width: 2.5em;
                height: 2.5em;
                border-radius: 50%;
                border: 0.0625em solid #bfbfbf;
                margin-right: 0.625em;
            }

            .post-user-name {
                font-weight: 600;
            }
        }

        .post-detail {
            padding: 0.3125em 0 0.3125em 3.125em;

        }
        .post-detail p {
            text-align: left;
        }

        .post-react {
            display: flex;
            // border: 1px solid black;
            margin: 0.3125em 6em 0.3125em 3.125em;
            justify-content: space-between;

            .post-react-item {
                width: 3em;
                flex: 0 0 auto;
                // border: 1px solid black;
                text-align: left;

                img {
                    width: 1em;
                    height: 1em;
                    vertical-align: middle;
                    margin-right: 0.3125em;
                }

                span {
                    vertical-align: middle;
                    font-weight: 500;
                }
            }
        }
    }
</style>