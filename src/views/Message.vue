<template>
    <div>
        <navinfo>
            <img slot="left" src="../assets/back.png" alt="" class="navinfo-left-icon" @click="clickBack">
            <span slot="title">通知</span>
        </navinfo>
    </div>
</template>

<script>
import Navinfo from '../components/Navinfo'

export default {
    data() {
        return {
            
        }
    },
    methods: {
        clickBack() {
            this.$router.go(-1)           
        }
        
    },
    components: {
        Navinfo,
    }

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
</style>