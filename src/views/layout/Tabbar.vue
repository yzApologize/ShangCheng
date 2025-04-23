<template>
  <div class="tabbar">
    <div class="tabbarLeft">
      <el-icon @click="fold" v-if="layoutSettingStore.isfold"><Expand /></el-icon>
      <el-icon @click="fold" v-if="!layoutSettingStore.isfold"><Fold /></el-icon>
      <el-breadcrumb separator-icon="ArrowRight">
        <template v-for="(item, index) in route.matched" :key="index">
          <el-breadcrumb-item :to="item.path" v-if="item.meta.icon"
            ><el-icon><component :is="item.meta.icon"></component></el-icon
            >{{ item.meta.title }}</el-breadcrumb-item
          >
        </template>
      </el-breadcrumb>
    </div>
    <div class="tabbarRight">
      <el-button icon="Refresh" circle size="small" @click="refresh"></el-button>
      <el-button icon="FullScreen" circle size="small" @click="fullScreen"></el-button>
      <el-button icon="Setting" circle size="small"></el-button>
      <img
        :src="userStore.userInfo.avatar"
        width="24px"
        height="24px"
        v-if="userStore.userInfo.avatar" />
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userStore.userInfo.name }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useUserStore from '@/store/user';
import useLayoutSettingStore from '@/store/layoutSetting';
let userStore = useUserStore();
let layoutSettingStore = useLayoutSettingStore();
let route = useRoute();
let router = useRouter();
console.log('路由', route.matched);
//控制菜单折叠
const fold = () => {
  if (!layoutSettingStore.isfold) {
    //如果已经展开，折叠
    layoutSettingStore.isfold = true;
  } else {
    //如果已经折叠，展开
    layoutSettingStore.isfold = false;
  }
};
//刷新页面
const refresh = () => {
  window.location.reload();
};
//全屏
const fullScreen = () => {
  const element = document.documentElement;
  if (document.fullscreenElement) {
    // 如果已经是全屏模式，退出全屏
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  } else {
    // 如果不是全屏模式，进入全屏
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }
};
//退出登录
const logOut = async () => {
  await userStore.userLogout();
  router.push('/login');
};
</script>

<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .tabbarLeft {
    display: flex;
    align-items: center;
    padding-left: 20px;
    .el-icon {
      margin-right: 10px;
    }
  }
  .tabbarRight {
    display: flex;
    align-items: center;
    padding-right: 20px;
    img {
      margin: 0px 10px;
    }
  }
}
</style>
