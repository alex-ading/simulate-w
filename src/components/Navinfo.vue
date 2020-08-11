<template>
    <div class="navinfo">
        <slot>
            <p class="navtitle">动态</p>
        </slot>
    </div>
  
</template>

<script>
export default {
    name: "Navinfo",
}
</script>

<style style="less">
    .navinfo {
        box-sizing: border-box;
        width: 100%;
        height: 44px;
        padding: 2px 0;
        border-bottom: 1px solid #bfbfbf;
    }

    .navtitle {
        font-size: 18px;
        font-weight: 600;
        line-height: 43px;
    }

</style>