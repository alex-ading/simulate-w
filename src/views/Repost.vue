<template>
    <div>
        <navinfo>
            <img slot="left" src="../assets/back.png" alt="" class="navinfo-left-icon" @click="clickBack">
            <span slot="right" class="btn new-post-btn" @click="clickRepost">发布</span>
            <span slot="title">转发动态</span>
        </navinfo>
        <div class="repost-input-container">
            <textarea class="repost-input" v-model="detail"></textarea>

            <repost-detail :opData="opData"></repost-detail>
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
            detail: null
        }
    },
    methods: {
        clickBack() {
            this.$router.go(-1)
        },

        clickRepost() {
            console.log(this.detail)
            let userid = this.$store.state.userid;
            let detail = this.detail;    
            let originalpostid = this.originalpostid;
            
            axios({
                method: "post",
                url: "https://cloud-4gm4rigo8c5f1c23.service.tcloudbase.com/new_repost",
                data: {
                    userid: userid,
                    detail: detail,
                    originalpostid: originalpostid
                }
            }).then(res => {
                console.log(res.data);
                this.$store.commit("addRepost",{
                    newopid: res.data,
                    opid: this.originalpostid
                })
                this.$router.go(-1)
            }).catch(err => {
                console.log(err)
            })
        }
    },

    created() {
        console.log("repost created")
        this.originalpostid = this.$route.query.originalpostid;
        this.$store.commit("getOriginalPostbyID", this.originalpostid)
        this.opData = this.$store.state.repostData;
        console.log(this.opData)
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

</style>