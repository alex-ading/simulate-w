<template>
    <div>
        <div :class="{'new-post-cover': isToastShow}">
            <navinfo>
                <img slot="left" src="../assets/back.png" alt="back" class="navinfo-left-icon" @click="clickBack">
                <span slot="right" class="btn new-post-btn" @click="clickRepost">发布</span>
                <span slot="title">转发动态</span>
            </navinfo>
            <div class="repost-input-container">
                <textarea class="repost-input" v-model="detail"></textarea>

                <repost-detail :opData="opData"></repost-detail>
            </div>
        </div>
        <div v-if="isToastShow" class="new-post-ing">
            <span class="new-post-toast">{{toastText}}</span>           
        </div>
    </div>
</template>

<script>
import axios from 'axios'

import Navinfo from '../components/Navinfo'
import RepostDetail from '../components/RepostDetail'

export default {
    name: "Repost",
    components: {
        Navinfo,
        RepostDetail
    },

    data() {
        return {
            originalpostid: null,
            opData: null,
            detail: null,
            toastText: "正在发送",
            isToastShow: false,
        }
    },
    methods: {
        clickBack() {
            this.$router.go(-1)
        },

        clickRepost() {
            // console.log(this.detail)
            let userid = this.$store.state.userid;
            let detail = this.detail;    
            let originalpostid = this.originalpostid;
            this.toastText = "正在发送"
            this.isToastShow = true;

            axios({
                method: "post",
                url: "https://cloud-4gm4rigo8c5f1c23.service.tcloudbase.com/new_repost",
                data: {
                    userid: userid,
                    detail: detail,
                    originalpostid: originalpostid
                }
            }).then(res => {
                // console.log(res.data);
                this.$store.commit("addRepost",{
                    newopid: res.data,
                    opid: this.originalpostid
                })
                this.toastText = "发送成功";
                setTimeout(() => {
                    this.isToastShow = false;
                    this.$router.go(-1)
                }, 1500)
            }).catch(err => {
                console.log(err);
                this.toastText = "暂时没有权限";
                setTimeout(() => {
                    this.isToastShow = false;
                }, 2000)
            })
        }
    },

    created() {
        // console.log("repost created")
        this.originalpostid = this.$route.query.originalpostid;
        this.$store.commit("getOriginalPostbyID", this.originalpostid)
        this.opData = this.$store.state.repostData;
        // console.log(this.opData)
    },
}
</script>

<style lang="less">
    .repost-input-container {
        margin: 0 0.625em;
    }
    .repost-input {
        font-size: 2rem;
        width: 100%;
        min-height: 15em;
        padding: 0.675em 0;
        border: 0;
    }

    .btn {
        background-color: #b0cac7;
        color: white;
    }

    .new-post-btn {
        position: absolute;
        right: 0.625em;
        margin-top: 0.575em;
        border-radius: 0.7em;
        padding: 0.1em 0.4em;
    }

    .new-post-cover {
        opacity: 0.3;
    }

    .new-post-ing {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }

    .new-post-toast {
        position: absolute;
        bottom: 5em;
        left: 50%;
        transform: translateX(-50%);
        font-weight: 500;
        padding: 0.5em;
        // color: #2c3e50;
        color: white;
        background-color:  #b0cac7;
        border-radius: 0.625em;
    }
</style>