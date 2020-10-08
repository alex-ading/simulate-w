<template>
    <div>
        <navinfo :class="{'new-comment-cover': isToastShow}">
            <img slot="left" src="../assets/back.png" alt="back" class="navinfo-left-icon" @click="clickBack">
            <span slot="title">评论详情</span>
        </navinfo>
        <div class="original-comment-detail" :class="{'new-comment-cover': isToastShow}">
            <div @click="clickReplytoReply(commentDetail)">
                <div v-if="commentDetail" class="comment-detail-user-info">
                    <img class="comment-detail-head-portrait comment-detail-user-info-item" :src="commentDetail.headportrait" alt="head-portrait" @click.stop="clickRoutetoProfile">
                    <div class="comment-detail-user-info-item">
                        <p class="comment-detail-user-name">{{commentDetail.username}}</p>
                        <p class="comment-detail-time">{{commentDetail.time | timeFilter}}</p>
                    </div>
                </div>
                <div v-if="commentDetail" class="comment-detail-detail">
                    <p>{{commentDetail.detail}}</p>
                    <p class="view-post" @click.stop="clickRoutetoOriginalPost">查看原动态</p>
                </div>
            </div>


            <div v-if="commentDetail" class="comment-container">
                <p class="comment-title">所有回复</p>
                <comment v-for="(item, index) in commentDetail.replies" :key="index" 
                                                                :comment="item" 
                                                                :originalpostid="itemInfo.originalpostid"
                                                                @click.native="clickReplytoReply(item)"></comment>
            </div>

            <div class="comment-react">
                <textarea type="text" :placeholder="placeholder" :class="{'comment-input': true,
                                                                            'input-status': isInput}" 
                                                                            id="input-comment" 
                                                                            v-model="comment" 
                                                                            @focus="focusChangeHeight"
                                                                            @blur="blurChangeHeight"></textarea>
                <span class="comment-btn" @click="clickPostReply">发布</span>
            </div>
        </div>
        <span :class="{'new-comment-toast': isToastShow,
                        'no-comment-toast': !isToastShow}">{{toastText}}</span>  
    </div>
</template>

<script>
import axios from 'axios'

import Navinfo from '../components/Navinfo'
import Comment from '../components/Comment'

export default {
    name: "CommentDetail",
    data() {
        return {
            orgininalpostid: null,
            commentid: null,
            itemInfo: null,
            commentDetail: null,
            placeholder: "回复：",
            isInput: false,
            comment: null,
            replytouserid: null,
            replytousername: null,
            commentid: null,
            isReplytoComment: true,
            isToastShow: false,
            toastText: "正在发送"
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
        Navinfo,
        Comment
    },

    methods: {
        clickBack() {
            this.$router.go(-1)
        },

        focusChangeHeight() {
            this.isInput = true;
        },

        blurChangeHeight() {
            this.isInput = false;
        },

        clickPostReply() {
            // console.log(this.comment)
            this.isToastShow = true;
            this.toastText = "正在发送";
            axios({
                methos: "get",
                url: 'https://cloud-4gm4rigo8c5f1c23.service.tcloudbase.com/insert_comment',
                params: {
                    userid: this.$store.state.userid,
                    detail: this.comment,
                    originalpostid: this.itemInfo.originalpostid,
                    isReply: true,
                    replytouserid: this.replytouserid,
                    replytousername: this.replytousername,
                    commentid: this.commentid,
                    isReplytoComment: this.isReplytoComment
                }
                // 自己返回一个promise，所以直接使用then
                }).then(res => {
                    // console.log(res.data);
                    this.$store.commit("addReply", {
                        opid: this.itemInfo.originalpostid,
                        commentid: this.commentid,
                        newReply: res.data
                    })
                    for (let i of this.itemInfo.comments) {
                        if (i.commentid === this.commentid) {
                            if (!i.replies) {
                                i.replies = [];
                            }
                            i.replies.unshift(res.data);
                        }
                    }
                    this.comment = "";
                    this.isToastShow = false;
                }).catch(err => {
                    console.log(err);
                    this.toastText = "暂时没有权限";
                    setTimeout(() => {
                        this.isToastShow = false
                    }, 2000)
                })
        },

        clickReplytoReply(reply) {
            if (reply.replies) {
                // 回复评论主
                this.isReplytoComment = true;
                this.placeholder = "回复评论：";
            } else {
                // 回复其他reply
                this.isReplytoComment = false;
                this.placeholder = "回复" + reply.username + "：";
            }
            console.log(this.isReplytoComment);
            this.replytouserid = reply.userid;
            this.replytousername = reply.username;
        },

        clickRoutetoOriginalPost() {
            this.$router.push({
                name: "OriginalPostDetail",
                query: {
                    originalpostid: this.originalpostid
                }
            })
        },
    },

    created() {
        // console.log("comment detail created")
        this.originalpostid = this.$route.query.originalpostid;
        this.commentid = this.$route.query.commentid;
        let url = `https://cloud-4gm4rigo8c5f1c23.service.tcloudbase.com/query_op?originalpostid=${this.originalpostid}`;

        axios.get(url)
        .then(response => {
            // console.log(response.data);
            if (response.data.likes === undefined) {
                response.data.likes = [];
            }
            if (response.data.reposts === undefined) {
                response.data.reposts = [];
            }

            for (let comment of response.data.comments) {
                // console.log(comment.commentid, this.commentid)
                if (comment.commentid === Number(this.commentid)) {
                    comment.replies.sort((x, y) => {
                        return y.time - x.time
                    })
                    this.commentDetail = comment;
                    this.replytouserid = comment.userid;
                    this.replytousername = comment.username;
                    break
                }
            }

            this.itemInfo = response.data;
            this.placeholder = "回复评论：";
            // console.log(this.commentDetail)
        })
        .catch(function (error) {
            console.log(error);
        });
    },
}
</script>

<style lang="less">
    .new-comment-cover {
        opacity: 0.3;
    }

    .new-comment-toast {
        position: absolute;
        bottom: 5em;
        left: 50%;
        transform: translateX(-50%);
        font-weight: 500;
        padding: 0.5em;
        color: white;
        background-color:  #b0cac7;
        border-radius: 0.625em;
    }

    .no-comment-toast {
        display: none;
    }
    .original-comment-detail {
        width: 100%;
        height: calc(100% - 5.5em);
        // border-bottom: 0.0625em solid #bfbfbf;
        background-color: #f4f4f4;
        text-align: left;
        // border: 1px solid black;
        overflow-x: hidden;
        overflow-y: scroll;

        .comment-detail-user-info {
            // border: 0.0625em solid black;
            text-align: left;
            display: flex;
            align-items: center;
            padding: 0.625em 0.625em 0.3125em 0.625em;
            background-color: white;


            .comment-detail-user-info-item {
                flex-grow: 0;
            }

            .comment-detail-head-portrait {
                width: 2.5em;
                height: 2.5em;
                border-radius: 50%;
                border: 0.0625em solid #bfbfbf;
                margin-right: 0.625em;
            }

            .comment-detail-user-name {
                font-weight: 600;
            }
        }

        .comment-detail-detail {
            padding: 0.3125em 0.625em 0.3125em 3.75em;
            word-break: break-all;
            background-color: white;
            border-bottom: 0.0625em solid #bfbfbf;

            .view-post {
                display: inline-block;
                padding: 0.3125em 0;
                color: #49afcd;
            }
        }
        .comment-detail-detail p {
            text-align: left;
        }

        .comment-container {
            background-color: white;
            min-height: 100%;
            border-top: 0.0625em solid #bfbfbf;
            margin-top: 1em;

            .comment-title {
                margin-left: 0.625em;
                padding-top: 0.625em;
                font-size: 1.7rem;
                font-weight: 600;
            }
        }

        .comment-react {
            display: flex;
            position: absolute;
            bottom: 0;
            width: 100%;
            min-height: 2.8em;
            align-items: center;
            background-color: white;
            border-top: #bfbfbf solid 0.0625em;
            // border-top: black solid 0.0625em;
            // background-color: yellow;

            .comment-input {
                flex: 1 0 auto;
                height: 1.75em;
                // margin: 0.46875em 0.625em;
                margin: 0 0.625em;
                line-height: 1.75em;
                // border: #bfbfbf 0.0625em solid;
                // border-radius: 0.3em;
                transition: height 0.3s;
                border: none;

            }

            .comment-btn {
                flex: 0 0 auto;
                margin-right: 0.625em;
                padding: 0.2em 0.625em;
                background-color: #b0cac7;
                color: white;
                border-radius: 0.875em;
            }

            textarea {
                padding: 0 0.3125em;
            }

            .input-status {
                // height: 7em;
                // line-height: 1.3;
                // padding: 0.3125em;
                // transition: height 0.3s;
            flex: 1 0 auto;
            // height: 1.75em;
            margin: 0.46875em 0.625em;
            // line-height: 1.75em;
            // border: #bfbfbf 0.0625em solid;
            // border-radius: 0.3em;
            border: none;
            transition: height 0.3s;
            height: 7em;
            line-height: 1.3;
            padding: 0.3125em;
            // transition: height 0.3s;
            }
        }
    }
</style>