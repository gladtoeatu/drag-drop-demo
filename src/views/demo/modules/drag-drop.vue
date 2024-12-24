<template>
    <div class="page-wrapper">
        <div class="page-header">
            <div v-for="(item, index) in someThings" class="thing_item grid-stack-item" :style="{
                width: item.size.width + 'px',
                height: item.size.height + 'px',
            }" :key="index" :gs-w="`${item.size.width}px`" :gs-h="`${item.size.height}px`">
                <div class="grid-stack-item-content" :class="{ 'horizontal': item.direction === SomeThingDirection.横向 }">
                    <span>{{ item.id }}</span>
                </div>
            </div>
        </div>

        <div class="page-content">
            <div class="page-content_wrapper"
                :style="{ '--page-max-width': `${pageMaxWidth}px`, '--gap-size': `${gapSize}px`, '--grid-size': `${gridSize}px`, }">
                <div class="grid-stack" @click="selectItemRotate"></div>
            </div>
        </div>

        <div class="page-footer">
            <div style="display: flex;justify-content: space-around;width: 100%;">
                <button @click="refreshPage">刷新页面</button>
                <button @click="save">缓存</button>
                <button @click="clear">清空</button>
                <div class="trash" id="trash">回收站</div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { GridStack, type GridStackWidget, type GridStackElement } from 'gridstack';
import { onMounted, ref } from "vue";

import { EnumHelper } from './utils/helper'
import { ISomeThing, MyGridStackWidget, SomeThingDirection, SomeThingType } from './types'
import { nextTick } from 'vue';
import { onUnmounted } from 'vue';

const SomeThingTypeHelper = new EnumHelper(SomeThingType)

const someThings = ref<ISomeThing[]>([
    {
        id: 1,
        type: SomeThingType.柜子,
        size: { width: 60, height: 120, depth: 1 },
        description: SomeThingTypeHelper.getKeyByValue(SomeThingType.柜子),
    },
    {
        id: 2,
        type: SomeThingType.板凳,
        size: { width: 40, height: 40, depth: 1 },
        description: SomeThingTypeHelper.getKeyByValue(SomeThingType.板凳),
    },
    {
        id: 3,
        type: SomeThingType.柜子,
        size: { width: 120, height: 60, depth: 1 },
        direction: SomeThingDirection.横向,
        description: SomeThingTypeHelper.getKeyByValue(SomeThingType.柜子),
    },
])

const grid = ref<GridStack>()

const scale = ref({ x: 1, y: 1 });
const gapSize = 5;  // 背景网格间隙大小
const gridSize = 5; // 移动物体相互的表现距离
// @ts-ignore
const pageMaxWidth = 600;  // 页面最大宽度
const updateScaleCssVariable = () => {
    document.body.style.setProperty('--global-scale-x', `${scale.value.x}`);
    document.body.style.setProperty('--global-scale-y', `${scale.value.y}`);
}
// @ts-ignore
const changeScaleX = (scaleX: number) => {
    scale.value.x = scaleX;
    updateScaleCssVariable();
};
// 页面尺寸变化
const resizeObserver = new ResizeObserver((_entries) => {
    // const { width } = _entries[0].contentRect;
    // if (width < pageMaxWidth) {
    //     changeScaleX(pageMaxWidth / width);
    // }
});

const GRID_CACHE_KEY = 'grid-cache'
const serializedData = ref<MyGridStackWidget[]>()

onMounted(() => {
    const cache = JSON.parse(localStorage.getItem(GRID_CACHE_KEY) || '[]') as MyGridStackWidget[];
    serializedData.value = cache;

    nextTick(() => {
        grid.value = GridStack.init({
            float: true,
            minRow: 6,
            acceptWidgets: true,
            cellHeight: 50,
            margin: gapSize,
            removable: '#trash'
        });

        // 加载缓存数据
        if (cache) {
            grid.value.load(cache);
            // 遍历数据并设置自定义方向样式
            cache.forEach(node => {
                // ⚠️ `.page-content` 非常关键，限定了查找范围，否则会查找到header中的元素
                const element = document.querySelector(`.page-content .grid-stack-item[gs-x="${node.x}"][gs-y="${node.y}"]`);
                if (element && node.direction) {
                    const content = element.querySelector('.grid-stack-item-content');
                    if (content) {
                        content.classList.toggle('horizontal', node.direction === SomeThingDirection.横向);
                    }
                }
            })
        }

        GridStack.setupDragIn('.page-header .grid-stack-item', {
            appendTo: 'body',
            helper: (ev) => {
                const node = (ev.target as HTMLElement)?.cloneNode(true) as HTMLElement
                node.appendChild(document.createTextNode('……'))
                return node
            }
        });

        updateScaleCssVariable()
    })

    resizeObserver.observe(document.body);
})

onUnmounted(() => {
    grid.value?.destroy()
    resizeObserver.disconnect();
})

// 选中元素
function selectItemRotate(ev: Event) {
    const selected = ev.target as HTMLElement

    if (selected?.classList.contains('grid-stack-item-content')) {
        // ⚠️ `.page-content` 非常关键，限定了查找范围，否则会查找到header中的元素
        document.querySelectorAll('.page-content .grid-stack-item-content').forEach(item =>
            item.classList.remove('selected')
        )
        selected.classList.add('selected')

        const parent = selected.closest('.grid-stack-item') as GridStackElement
        if (parent) {
            // 旋转方向 ｜ 切换类名，达到旋转效果
            const isHorizontal = selected.classList.toggle('horizontal')
            // 这里可以根据需要更新节点的数据模型，确保方向同步
            console.log(`Element rotated to: ${isHorizontal ? 'horizontal' : 'vertical'}`);
            grid.value?.rotate(parent);
        }
    }
}
// 清空
function clear() {
    grid.value?.removeAll()
}

// 缓存
function save() {
    const data = grid.value?.save() as GridStackWidget[];
    if (data) {
        // 将每个节点的方向属性添加到保存的数据中
        const enrichedData = data.map(node => {
            // ⚠️ `.page-content` 非常关键，限定了查找范围，否则会查找到header中的元素
            const element = document.querySelector(`.page-content .grid-stack-item[gs-x="${node.x}"][gs-y="${node.y}"]`);
            const direction = element?.querySelector('.grid-stack-item-content')?.classList.contains('horizontal')
                ? SomeThingDirection.横向
                : undefined;
            return { ...node, direction };
        });

        serializedData.value = enrichedData;
        localStorage.setItem(GRID_CACHE_KEY, JSON.stringify(enrichedData));
        console.log('Data saved:', enrichedData);
    }
}

// 刷新页面
function refreshPage() {
    window.location.reload();
}

</script>

<style lang="less" scoped>
.page-wrapper {
    height: 100%;
    overflow: hidden;

    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .page-header {
        display: flex;
        width: 100%;
        overflow: auto;
        background-color: #00000068;
        flex-shrink: 0;

        .thing_item {
            display: flex;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            margin: 10px;
            font-size: 20px;
            background-color: #fff;
            position: relative;

            .grid-stack-item-content {
                height: 100%;
                width: 100%;
            }
        }
    }


    .page-content {
        --move-item-deviation: 0px;
        flex-grow: 1;
        overflow: auto;

        &_wrapper {
            width: calc(var(--page-max-width) + var(--gap-size) * 2);
            padding: var(--gap-size);
            transform: translate(0, 0) scale(var(--global-scale-x), var(--global-scale-y));
            transform-origin: 0 0;

            --temp-size: calc((var(--grid-size) + var(--move-item-deviation) * 2) * 2);
            background-image: linear-gradient(to right, transparent calc(var(--temp-size) - 1px), #ccc 100%),
                linear-gradient(to bottom, transparent calc(var(--temp-size) - 1px), #ccc 100%);
            background-repeat: repeat;
            background-size: var(--temp-size) var(--temp-size);
            border-radius: 5px;
            background-position: calc(var(--gap-size) * 2) calc(var(--gap-size) * 2);
        }
    }

    .page-footer {
        padding: 10px;
        display: flex;
        flex-shrink: 0;
        background-color: #fff;
        flex-direction: column;
        gap: 10px;

        .trash {
            background-color: rgb(255, 72, 72);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            padding: 0 40px;
            color: #fff;
            border-radius: 5px;
            user-select: none;
        }
    }
}

:deep(.grid-stack-item-content) {
    background-color: #18bc9c;
    user-select: none;

    &.selected {
        background-color: #f39c12;
    }

    &::after {
        content: "";
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 3px;
        background-color: #165dff;
    }

    &.horizontal {
        padding-left: 5px;

        &::after {
            top: 0;
            height: 100%;
            width: 3px;
        }
    }
}

:deep(.ui-resizable-handle) {
    display: none;
}
</style>