<template>
    <div>
        <navinfo></navinfo>
        <div class="original-post-container">
            <original-post v-for="item in timelineData" 
                            :detail="item.detail" 
                            :username="item.username"
                            :time="item.time"
                            :url="item.headportrait"
                            :key="item.time"></original-post>
            <!-- <div class="bottom-placeholder"></div> -->
        </div>
  </div>
</template>

<script>
import axios from 'axios'
import Navinfo from '../components/Navinfo'
import OriginalPost from '../components/OriginalPost'

export default {
    data() {
        return {
            timelineData: null
            
        }
    },
    methods: {
        
    },
    components: {
        Navinfo,
        OriginalPost
    },
    created() {
        axios.get('https://cloud-4gm4rigo8c5f1c23.service.tcloudbase.com/query_timeline?userid=3')
        .then(response => {
            console.log(response.data);
            this.timelineData = response.data
            console.log(timelineData);
        })
        .catch(function (error) {
            console.log(error);
        });

    },

}
</script>

<style>
    .original-post-container {
        /* border:black 1px solid; */
        height: calc(100% - 44px);
        overflow-x: hidden;
        overflow-y: scroll;
    }

    /* .bottom-placeholder {
        height: 25px;
        width: 100%;
        background-color:#bfbfbf
    } */
</style>