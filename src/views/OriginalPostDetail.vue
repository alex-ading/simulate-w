<template>
    <div v-if="itemInfo!==null">
        <navinfo :class="{'new-comment-cover': isToastShow}">
            <img slot="left" src="../assets/back.png" alt="back" class="navinfo-left-icon" @click="clickBack">
            <span slot="title">动态正文</span>
        </navinfo>

        <div class="orginal-post-detail-container" :class="{'new-comment-cover': isToastShow}">

            <original-post :itemInfo="itemInfo" @cancelLike="cancelLike" @addLike="addLike" @click.native="clickReplytoPost">
                <div v-if="itemInfo.img!==undefined" slot="post-img" :class="{'post-img-one': itemInfo.img.length === 1,
                                                                    'post-img-more': itemInfo.img.length !== 1}">
                    <img v-for="(img, index) in itemInfo.img" preview="0" :src="img" :key="index" alt="pic">
                </div>

                <!-- <span v-if="itemInfo.circle!==undefined" slot="post-circle" class="post-circle" @click.stop="test">{{itemInfo.circle}}</span> -->
            </original-post>

            <div v-if="commentsbyTime" class="comment-container">
                <p class="comment-title">最新评论</p>
                <comment v-for="(item, index) in commentsbyTime" :key="index" 
                                                                :comment="item" 
                                                                @clickReplytoComment="clickReplytoComment"
                                                                :originalpostid="itemInfo.originalpostid"></comment>
            </div>
            <div v-else class="comment-container">
                <p class="no-comment">目前还没有评论</p>
            </div>

        </div>

        <div class="comment-react" :class="{'new-comment-cover': isToastShow}">
            <textarea type="text" :placeholder="placeholder" :class="{'comment-input': !isInput,
                                                                        'input-status': isInput}" 
                                                                        id="input-comment" 
                                                                        v-model="comment" 
                                                                        @focus="focusChangeHeight"
                                                                        @blur="blurChangeHeight"></textarea>
            <span class="comment-btn" @click="clickPostComment">发布</span>
        </div>
        <span :class="{'new-comment-toast': isToastShow,
                        'no-comment-toast': !isToastShow}">{{toastText}}</span>           
  </div>
</template>

<script>
import axios from 'axios'

import OriginalPost from '../components/OriginalPost'
import Navinfo from '../components/Navinfo'
import Comment from '../components/Comment'

export default {
    name: "OriginalPostDetail",
    data() {
        return {
            postuserid: null, // 发帖人 id
            originalpostid: null,
            itemInfo: null,
            comment: "", // 用户输入的评论
            userid: null, // 登录者id
            isToastShow: false,
            placeholder: "回复博主：",
            isReply: false,
            replytouserid: null,
            replytousername: null,
            commentid: null,
            isInput: false,
            toastText: "正在发送"
        }
    },
    components: {
        OriginalPost,
        Navinfo,
        Comment
    },
    props: {

    },
    computed: {
        commentsbyTime() {
            if (this.itemInfo.comments === undefined) {
                return false;
            }

            if (this.itemInfo.comments.length === 0) {
                return false;
            } else {
                this.itemInfo.comments.sort((x,y) => {
                    return y.time - x.time
                })
                return this.itemInfo.comments
            }
        }
    },
    methods: {
        // test() {
        //     console.log("自己的事件" + event.currentTarget.nodeName)
        // },
        
        clickBack() {
            this.$router.go(-1)
        },

        clickPostComment() {
            // console.log(this.comment)
            let detail = this.comment;
            this.isToastShow = true;
            this.toastText = "正在发送";

            // 如果是 comment
            if (!this.isReply) {
                axios({
                    methos: "get",
                    url: 'https://cloud-4gm4rigo8c5f1c23.service.tcloudbase.com/insert_comment',
                    params: {
                        userid: this.$store.state.userid,
                        detail: detail,
                        originalpostid: this.itemInfo.originalpostid,
                        isReply: this.isReply
                    }
                    // 自己返回一个promise，所以直接使用then
                    }).then(res => {
                    // console.log(res.data);
                    this.$store.commit("addComment", {
                        opid: this.itemInfo.originalpostid,
                        newComment: res.data
                    })
                    this.itemInfo.comments.push(res.data);
                    this.comment = "";
                    // console.log(this.itemInfo.comments)
                    this.isToastShow = false;
                }).catch(err => {
                    console.log(err);
                    this.toastText = "暂时没有权限";
                    setTimeout(() => {
                        this.isToastShow = false;
                    }, 2000)
                })
            } else {
                // 如果是 reply
                axios({
                    methos: "get",
                    url: 'https://cloud-4gm4rigo8c5f1c23.service.tcloudbase.com/insert_comment',
                    params: {
                        userid: this.$store.state.userid,
                        detail: detail,
                        originalpostid: this.itemInfo.originalpostid,
                        isReply: this.isReply,
                        replytouserid: this.replytouserid,
                        replytousername: this.replytousername,
                        commentid: this.commentid,
                        isReplytoComment: true
                    }
                    // 自己返回一个promise，所以直接使用then
                    }).then(res => {
                        console.log(res.data);
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
                                i.replies.push(res.data);
                            }
                        }
                        this.comment = "";
                        this.isToastShow = false;
                }).catch(err => {
                    console.log(err);
                    this.toastText = "暂时没有权限";
                    setTimeout(() => {
                        this.isToastShow = false;
                    }, 2000)
                })
            }
        },

        focusChangeHeight() {
            this.isInput = true;
        },

        blurChangeHeight() {
            this.isInput = false;
        },

        cancelLike() {
            // console.log("detail父 cancelLike")

            // 更改本页面数据
            for (let i=0; i<this.itemInfo.likes.length; i++) {
                if (this.itemInfo.likes[i].userid === this.userid) {
                    this.itemInfo.likes.splice(i, 1);
                    break
                }
            }
            // 更改tl面数据
            this.$store.commit("cancelLike", this.originalpostid);
            // 更改pf面数据
            this.$store.commit("cancelLikeProfile", this.originalpostid)

            axios({
                method: "get",
                url:"https://cloud-4gm4rigo8c5f1c23.service.tcloudbase.com/process_like",
                params: {
                    method: "cancel",
                    userid: this.userid, // 登录者id,
                    originalpostid: this.originalpostid
                }
            }).then(res => {
                console.log("数据库数据已更新")
            }).catch(err => {
                console.log(err)
            })
        },

        addLike() {
            // console.log("detail父 addLike");

            let day = new Date();
            let time = day.getTime();
            // 更改本页面数据
            this.itemInfo.likes.push({userid: this.userid, time: time});
            // console.log({userid: this.userid, time: time})
            // 更改tl数据
            this.$store.commit("addLike", {originalpostid: this.originalpostid, time: time});
            // 更改pf数据
            this.$store.commit("addLikeProfile", {originalpostid: this.originalpostid, time: time});

            axios({
                method: "get",
                url:"https://cloud-4gm4rigo8c5f1c23.service.tcloudbase.com/process_like",
                params: {
                    method: "add",
                    userid: this.userid, // 登录者id,
                    originalpostid: this.originalpostid,
                    time: time
                }
            }).then(res => {
                console.log("数据库数据已更新")
            }).catch(err => {
                console.log(err)
            })
        },

        clickReplytoComment(comment) {
            // console.log(comment)
            this.placeholder = "回复" + comment.username + "：";
            this.isReply = true;
            this.replytouserid = comment.userid;
            this.replytousername = comment.username;
            this.commentid = comment.commentid;
        },

        clickReplytoPost() {
            this.placeholder = "回复博主：",
            this.isReply = false;
        }
    },
    created() {
        // console.log("opd created")
        this.userid = this.$store.state.userid; // 登录者id
        this.originalpostid = this.$route.query.originalpostid;
        let url = `https://cloud-4gm4rigo8c5f1c23.service.tcloudbase.com/query_op?originalpostid=${this.originalpostid}`;

        axios.get(url)
        .then(response => {
            // console.log(response.data);
            this.$previewRefresh();
            
            if (response.data.comments === undefined) {
                response.data.comments = [];
            }
            if (response.data.likes === undefined) {
                response.data.likes = [];
            }
            if (response.data.reposts === undefined) {
                response.data.reposts = [];
            }
            this.itemInfo = response.data;
            // console.log(this.itemInfo)
        })
        .catch(function (error) {
            // console.log(error);
        });
    },

    destroyed() {
        // console.log("destroyed")
    },

    watch: {
        $route(to, from) {
            // console.log(to);
            // console.log(from)
            if (to.path === "/detail") {
                this.postuserid = this.$route.query.userid; // 发帖人id
                this.originalpostid = this.$route.query.originalpostid;
                this.userid = this.$store.state.userid; // 登录者id
                // let url = `https://cloud-4gm4rigo8c5f1c23.service.tcloudbase.com/query_timeline?userid=${this.userid}`;

                // axios.get(url)
                // .then(response => {
                //     console.log(response.data);
                //     this.$previewRefresh()
                //     for (let i of response.data) {
                //         if (Number(i.userid) === Number(this.postuserid) && Number(i.originalpostid) === Number(this.originalpostid)) {
                //             if (i.comments === undefined) {
                //                 i.comments = [];
                //             }
                //             if (i.likes === undefined) {
                //                 i.likes = [];
                //             }
                //             this.itemInfo = i;
                //             console.log(this.itemInfo)
                //         }
                //     }
                // })
                // .catch(function (error) {
                //     console.log(error);
                // });
                let url = `https://cloud-4gm4rigo8c5f1c23.service.tcloudbase.com/query_op?originalpostid=${this.originalpostid}`;
                axios.get(url)
                .then(response => {
                    // console.log(response.data);
                    this.$previewRefresh();
                    
                    if (response.data.comments === undefined) {
                        response.data.comments = [];
                    }
                    if (response.data.likes === undefined) {
                        response.data.likes = [];
                    }
                    if (response.data.reposts === undefined) {
                        response.data.reposts = [];
                    }
                    this.itemInfo = response.data;
                    // console.log(this.itemInfo)
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        }       
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

    .navinfo-left-icon {
        position: absolute;
        left: 0.625em;
        width: 1.5em;
        height: 1.5em;
        margin-top: 0.59375em;
    }
    .orginal-post-detail-container {
        height: calc(100% - 5.5em);
        background-color: #f4f4f4;
        text-align: left;
        // border: 1px solid black;
        overflow-x: hidden;
        overflow-y: scroll;
        

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
            width: 12.5em;
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
            }
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

            .no-comment {
                padding-top: 1em;
                text-align: center;
                font-weight: 500;
            }
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

        .comment-input {
            flex: 1 0 auto;
            height: 1.75em;
            margin: 0 0.625em;
            line-height: 1.75em;
            transition: height 0.3s;
            border: none;
            // border-top: #bfbfbf solid 0.0625em;

        }

        .comment-btn {
            flex: 0 0 auto;
            margin-right: 0.625em;
            padding: 0.2em 0.625em;
            background-color: #b0cac7;
            font-size: 1.4rem;
            color: white;
            border-radius: 0.875em;
        }

        textarea {
            padding: 0 0.3125em;
        }

        .input-status {
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
</style>