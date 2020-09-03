<template>
    <div @click.stop="clickRoutetoOriginalPost">
        <div v-if="opData" class="repost-info">
            <img :src="opData.headportrait" alt="" class="repost-info-item">
            <div class="repost-info-item repost-detail">
                <span><strong>{{opData.username}}</strong>：{{opData.detail}}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["opData"],
    methods: {
        clickRoutetoOriginalPost() {
            console.log("OriginalPostDetail")
            this.$router.push({
                name: "OriginalPostDetail",
                query: {
                    userid: this.opData.userid,
                    originalpostid: this.opData.originalpostid
                }
            })           
        }
    },

}
</script>

<style lang="less">
    .repost-info {
        display: flex;
        align-items: center;
        height: 4em;
        margin-top: 0.625em;
        padding: 0 0.5em;
        background-color: #f4f4f4;
        border-radius: 0.5em;

        .repost-info-item {
            // border: black 1px solid;
            text-align: left;
            height: 3em;
        }

        .repost-detail {
            width: calc(100% - 3.5em);
            span {
                width: 100%;
                display: block;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                line-height: 3em;
            }

        }

        img {
            width: 3em;
            height: 100%;
            object-fit: cover;
            margin-right: 0.5em;
        }
    }
</style>