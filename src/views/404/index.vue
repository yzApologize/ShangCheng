<template>
  <div class="reject">
    <h1>404无法访问</h1>
    <div @click="router.push('/')">返回首页</div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<style scoped lang="scss">
.reject {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
</style>
