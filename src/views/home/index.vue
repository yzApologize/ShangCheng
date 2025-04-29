<template>
  <el-card>
    <div class="homeContainer">
      <img :src="userStore.userInfo.avatar" alt="" />
      <div style="margin-left: 10px">欢迎登陆，{{ userStore.userInfo.name }}</div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useUserStore from '@/store/user';
let userStore = useUserStore();
onMounted(() => {
  if (userStore.token) {
  }
});
</script>

<style scoped lang="scss">
.homeContainer {
  display: flex;
  img {
    width: 80px;
    height: 80px;
  }
}
</style>
