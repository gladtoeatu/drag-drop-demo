<template>
    <div class="mobile-wrapper">

        <div class="_header">
            <button type="button" @click="goHomePage" style="position: absolute;left: 10px;">首页</button>
            <h1 style="text-align: center;">
                <span>demo</span>
            </h1>
        </div>
        <!-- 模拟被webview嵌入 -->
        <div class="embed-wrapper">
            <drag-drop />
        </div>
        <div style="text-align: center;"><code>模拟被webview嵌入</code></div>
    </div>
</template>

<script lang="ts" setup>
import { PAGE_ENUMS } from '@/routes/enums';
import { useRouter } from 'vue-router';

import DragDrop from "./modules/drag-drop.vue";

const router = useRouter()

function goHomePage() {
    router.push(PAGE_ENUMS.HOME_PATH)
}
</script>


<style lang="less"></style>

<style lang="less" scoped>
.mobile-wrapper {
    overflow: hidden auto;
    font-size: min(3.733vw, 22.4px);
    background-color: #F0F0F0;
    max-width: 600px !important;
    margin-left: auto !important;
    margin-right: auto !important;
    box-shadow: 0 0 0 1px #8888881f;
    min-height: 100vh;
    height: auto !important;
}

._header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.embed-wrapper {
    background-color: #fff;
    height: 80vh;
    width: 100%;
    overflow: hidden;
    display: block;
}
</style>