<template>
    <div class="original-post">
        <div class="post-user-info">
            <img class="post-head-portrait post-user-info-item" :src="url" alt="">
            <div class="post-user-info-item">
                <p class="post-user-name">{{username}}</p>
                <p class="post-time">{{time}}</p>
            </div>
        </div>
        <div class="post-detail">
            <p>{{detail}}</p>
        </div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: ["username", "time", "detail", "url"],
    name: "OriginalPost"
}
</script>

<style lang="less">
    .original-post {
        width: 100%;
        padding: 10px;
        border-bottom: 1px solid #bfbfbf;

        .post-user-info {
            // border: 1px solid black;
            text-align: left;
            display: flex;
            align-items: center;
            margin-bottom: 10px;

            .post-user-info-item {
                flex-grow: 0;
            }

            .post-head-portrait {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                border: 1px solid #bfbfbf;
                margin-right: 10px;
            }
        }

        .post-detail p {
            text-align: left;
            margin-left: 50px;
        }
    }
</style>