<template>
    <div>
        <navinfo>
            <img slot="left" src="../assets/back.png" alt="back" class="navinfo-left-icon" @click="clickBack">
            <span slot="title">关注</span>
        </navinfo>
        <div class="followings">
            <follow v-for="(item, index) in followersData" :key="index" :userinfo="item"></follow>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

import Navinfo from '../components/Navinfo'
import Follow from '../components/Follow'


export default {
    name: "Followings",

    data() {
        return {
            profileid: null,
            followersData: null
        }
    },

    components: {
        Navinfo,
        Follow
    },

    methods: {
        clickBack() {
            this.$router.go(-1)
        },
    },

    created() {
        this.profileid = this.$route.query.profileid;
        // console.log(this.profileid);
        axios({
            method: "get",
            url: "https://cloud-4gm4rigo8c5f1c23.service.tcloudbase.com/query_follow",
            params: {
                profileid: this.profileid,
                method: "followings"
            }
        }).then(res => {
            this.followersData = res.data;
            // console.log(this.followersData)
        })
    },
}
</script>

<style lang="less">
    .followings {
        position: absolute;
        top: 2.75em;
        bottom: 0;
        right: 0;
        left: 0;
        // border: solid 1px black;
        overflow-x: hidden;
        overflow-y: scroll;
    }
    .navinfo-left-icon {
        position: absolute;
        left: 0.625em;
        width: 1.5em;
        height: 1.5em;
        margin-top: 0.59375em;
    }
</style>