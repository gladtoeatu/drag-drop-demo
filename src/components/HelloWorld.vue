<script setup lang="ts">
import { PAGE_ENUMS } from '@/routes/enums';
import { ref } from 'vue'
import { useRouter } from 'vue-router';

defineProps<{ msg: string }>()

const router = useRouter()

const count = ref(0)

function goDemoPage() {
  router.push(PAGE_ENUMS.DEMO_PATH)
}
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <div class="btn-box-row">
      <button type="button" @click="count++">count is {{ count }}</button>
      <button type="button" @click="goDemoPage">go <code>drag-drop-demo</code> page</button>
    </div>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite
    starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support" target="_blank">Vue Docs Scaling up Guide</a>.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped lang="less">
.read-the-docs {
  color: #888;
}

.btn-box-row {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1em;
}
</style>
