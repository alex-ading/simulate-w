<template>
    <div class="follow" @click="clickRoutetoProfile">
        <img :src="userinfo.headportrait" class="follow-item" alt="head-portrait">
        <div class="follow-item">
            <p class="follow-username">{{userinfo.username}}</p>
            <p>{{userinfo.intro}}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: "Follow",

    props: ["userinfo"],

    methods: {
        clickRoutetoProfile() {
            if (this.$route.name !== "Profile") {
                this.$router.push({
                    name: "Profile",
                    query: {
                        profileid: this.userinfo.userid 
                    }
                }) 
            }
        }
    },


}
</script>

<style lang="less">
    .follow {
        display: flex;
        align-items: center;
        padding: 0.625em 0.625em 0.625em 0.625em;
        border-bottom: 0.0625em #bfbfbf solid;
        text-align: left;

        .follow-item {
            flex: 0 0 auto;
            .follow-username {
                font-size: 1.8rem;
                font-weight: 600;
                margin-bottom: 0.3125em;
            }

        }

        img {
            width: 4em;
            height: 4em;
            border-radius: 50%;
            margin-right: 0.625em;
        }
    }

</style>