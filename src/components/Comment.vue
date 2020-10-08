<template>
        <div class="comment" @click="clickReplytoComment">
            <div class="comment-user-info">
                <img class="comment-head-portrait comment-user-info-item" :src="comment.headportrait" alt="head-portrait">
                <div class="comment-user-info-item">
                    <p class="comment-user-name">{{comment.username}}</p>
                    <p class="comment-time">{{comment.time | timeFilter}}</p>
                </div>
            </div>
            <div class="comment-detail">
                <p v-if="comment.isReplytoComment===undefined||comment.isReplytoComment===true">{{comment.detail}}</p>
                <p v-else>
                    <span class="username">{{comment.username}}</span> 回复<span class="username"> {{comment.replytousername}}</span>：{{comment.detail}}
                </p>
            </div>
            <div v-if="comment.replies" class="comment-reply" @click.stop="clickRoutetoCommentDetail">
                <div v-for="(item, index) in comment.replies" :key="index" class="reply">
                    <p>
                        <span class="username">{{item.username}}</span> 回复<span class="username"> {{item.replytousername}}</span>：{{item.detail}}
                    </p>
                </div>
            </div>
        </div>
</template>

<script>
export default {
    props: {
        "comment": {
            type: Object,
            default: {}
        },
        "originalpostid": {
            type: Number,
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
            return month + "月" + date + "日 " + hour + ":" + min
        }
    },
    methods: {
        clickReplytoComment() {
            this.$emit("clickReplytoComment", this.comment)
        },

        clickRoutetoCommentDetail() {
            this.$router.push({
                name: "CommentDetail",
                query: {
                    originalpostid: this.originalpostid,
                    commentid: this.comment.commentid
                }
            })
        }
    },

}
</script>

<style lang="less">
.comment {
        width: 100%;
        padding: 0.3125em 0.625em 0.3125em 0.625em;
        border-bottom: 0.0625em solid #bfbfbf;

        .comment-user-info {
            // border: 0.0625em solid black;
            text-align: left;
            display: flex;
            align-items: center;
            margin: 0.3125em 0;

            .comment-user-info-item {
                flex-grow: 0;
            }

            .comment-head-portrait {
                width: 2.5em;
                height: 2.5em;
                border-radius: 50%;
                border: 0.0625em solid #bfbfbf;
                margin-right: 0.625em;
            }

            .comment-user-name {
                font-weight: 600;
            }
        }

        .comment-detail {
            padding: 0.3125em 0 0.3125em 3.125em;
            // border: 1px solid black;
            word-break: break-all
        }
        .comment-detail p {
            text-align: left;
        }

        .comment-reply {
            margin: 0.3125em 0 0.3125em 3.125em;
            padding-top: 0.625em;
            background-color: #f4f4f4;
            border-radius: 0.5em;


            .reply {
                padding: 0 0.925em 0.625em 0.925em;
                p {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }
        }

        .username {
            color: #49afcd;
        }
        
    }
</style>