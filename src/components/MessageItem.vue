<template>
    <div v-if="isItemInfo" class="message">
        <div v-if="itemInfo.statusid===0" class="message-like" @click="clickRoutetoOriginalPost">
            <img class="message-headportrait" :src="itemInfo.headportrait" alt="head-portrait">
            <div class="message-detail-container">
                <p><span class="name">{{itemInfo.username}}</span> 点赞了你的动态</p>
                <p class="message-time">{{itemInfo.time | timeFilter}}</p>
            </div>
            <p class="mes-post-detail">{{itemInfo.opdetail}}</p>
        </div>

        <div v-else-if="itemInfo.statusid===1" class="message-comment" @click="clickRoutetoOriginalPost">
            <img class="message-headportrait" :src="itemInfo.headportrait" alt="head-portrait">
            <div class="message-detail-container">
                <p><span class="name">{{itemInfo.username}}</span> 评论了你的动态</p>
                <p class="message-detail">{{itemInfo.detail}}</p>
                <p class="message-time">{{itemInfo.time | timeFilter}}</p>
            </div>
            <p class="mes-post-detail">{{itemInfo.opdetail}}</p>
        </div>

        <div v-else class="message-reply" @click="clickRoutetoCommentDetail">
            <img class="message-headportrait" :src="itemInfo.headportrait" alt="head-portrait">
            <div class="message-detail-container">
                <p><span class="name">{{itemInfo.username}}</span> 回复了你的评论</p>
                <p class="message-detail">{{itemInfo.detail}}</p>
                <p class="message-time">{{itemInfo.time | timeFilter}}</p>
            </div>
            <p class="mes-post-detail">{{itemInfo.opdetail}}</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        itemInfo: {
            type: Object,
            default: {}
        }
    },

    computed: {
        isItemInfo() {
            let objStr = JSON.stringify(this.itemInfo);
            if (objStr === "{}") {
                return false 
            } else {
                return true
            }
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

    methods: {
        clickRoutetoOriginalPost() {
            this.$router.push({
                name: "OriginalPostDetail",
                query: {
                    originalpostid: this.itemInfo.originalpostid
                }
            })
        },

        clickRoutetoCommentDetail() {
            this.$router.push({
                name: "CommentDetail",
                query: {
                    originalpostid: this.itemInfo.originalpostid,
                    commentid: this.itemInfo.commentid
                }
            })         
        },
    },

}
</script>

<style lang="less">
    .message {
        width: 100%;

        .message-reply, .message-comment, .message-like {
            width: 100%;
            display: flex;
            padding: 0.3125em 0.625em;
            border-bottom: 0.0625em #bfbfbf solid;

            .message-headportrait {
                width: 2.5em;
                flex: 0 0 auto;
                height: 2.5em;
                border-radius: 50%;
                border: 0.0625em #bfbfbf solid;
                margin-right: 1em;
            }

            .message-detail-container {
                width: 0;
                flex: 1 0 auto;
                text-align: left;
                // border: 1px solid black;

                .message-detail {
                    word-break: break-all;
                    // border: 1px solid black;
                }

                .name {
                    color: #49afcd;
                    font-weight: 600;
                }

                .message-time {
                    color: #bfbfbf;
                }
            }

            .mes-post-detail{
                width: 5em;
                height: 3.9em;
                flex: 0 0 auto;
                overflow: hidden;
                margin-left: 1em;
                // border: 1px solid black;
                text-align: left;
                line-height: 1.3;
                color: #bfbfbf;
            }
        }

        .message-like {
            .message-time {
                margin-top: 1.4em;
            }
        }

        .message-comment, .message-reply {
            .message-detail {
                margin: 0.625em 0;
            }   

        }
    }

</style>