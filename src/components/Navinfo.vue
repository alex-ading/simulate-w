<template>
    <div class="navinfo">
        <slot name="left"></slot>
        <slot name="middle"></slot>
        <slot name="right"></slot>
        <div class="navtitle">
            <slot name="title">动态</slot>
        </div>

    </div>
  
</template>

<script>
export default {
    name: "Navinfo",
}
</script>

<style style="less">
    .navinfo {
        position: relative;
        width: 100%;
        height: 2.75em;
        border-bottom: 0.0625em solid #bfbfbf;
        /* border: 1px solid black; */
        /* text-align: left; */
    }

    .navtitle {
        /* display: inline-block; */
        text-align: center;
        font-size: 1.8rem;
        font-weight: 600;
        line-height: 2.38888888888;
        /* border: 1px solid black; */
    }

</style>