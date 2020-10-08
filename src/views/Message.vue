<template>
    <div>
        <navinfo>
            <img slot="left" src="../assets/back.png" alt="back" class="navinfo-left-icon" @click="clickBack">
            <span slot="title">通知</span>
        </navinfo>
        <div class="message-container" v-if="messageData">
            <message-item v-for="(item, index) in messageData" :key="index" :itemInfo="item"></message-item>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import Navinfo from '../components/Navinfo'
import MessageItem from '../components/MessageItem'

export default {
    data() {
        return {
            messageData: null
        }
    },
    methods: {
        clickBack() {
            this.$router.go(-1)           
        }
        
    },

    components: {
        Navinfo,
        MessageItem
    },

    created() {
        this.messageData = this.$store.state.messageData;
        // console.log(this.messageData);
        let readList = this.$store.state.readList;
        // console.log(readList);

        if (readList.length > 0) {
            readList = JSON.stringify(readList)
            axios({
                method: "get",
                url: "https://cloud-4gm4rigo8c5f1c23.service.tcloudbase.com/query_message",
                params: {
                    userid: this.$store.state.userid, // 登录者 id
                    isread: readList
                }
            }).then(res => {
                // console.log("更改mes状态成功");
                // console.log(res.data);
                this.$store.commit("updateReadList");
            }).catch(err => {
                console.log(err);
            })
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

    .message-container {
        height: calc(100% - 2.75em);
        overflow-x: hidden;
        overflow-y: scroll;
    }
</style>