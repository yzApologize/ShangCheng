<template>
  <div class="layoutContainer">
    <div class="layoutSlider" :class="layoutSettingStore.isfold ? 'fold' : 'expand'">
      <div class="logo">
        <img :src="setting.logo" alt="" v-if="setting.logoHidden" />
        <p v-if="!layoutSettingStore.isfold">{{ setting.title }}</p>
      </div>
      <el-scrollbar>
        <el-menu
          background-color="#001529"
          text-color="white"
          router
          :default-active="route.path"
          :collapse="layoutSettingStore.isfold">
          <HomeMenu :data="userStore.menuRoutes"></HomeMenu>
        </el-menu>
      </el-scrollbar>
    </div>
    <div class="layoutRight" :class="layoutSettingStore.isfold ? 'fold' : 'expand'">
      <div class="layoutTabber">
        <Tabbar></Tabbar>
      </div>
      <div class="layoutContent">
        <router-view v-slot="{ Component }">
          <transition name="fade">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import useUserStore from '@/store/user';
import useLayoutSettingStore from '@/store/layoutSetting';
import setting from '@/setting';
import HomeMenu from './HomeMenu.vue';
import Tabbar from './Tabbar.vue';
const userStore = useUserStore();
const layoutSettingStore = useLayoutSettingStore();
const route = useRoute();
console.log('菜单列表', userStore.menuRoutes);
</script>

<style scoped lang="scss">
.layoutContainer {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: red;
  .layoutSlider {
    height: 100%;
    background-color: $base-menu-background-color;
    transition: all 0.3s;
    &.expand {
      width: $base-menu-width;
    }
    &.fold {
      width: $base-menu-fold-width;
    }
    .logo {
      height: 50px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 40px;
        height: 80%;
      }
      p {
        color: white;
        margin-left: 10px;
        font-size: 18px;
      }
    }
    .el-scrollbar {
      height: calc(100% - 50px);
      .el-menu {
        border-right: none;
      }
    }
  }
  .layoutRight {
    height: 100%;
    background-color: white;
    display: flex;
    flex-direction: column;
    &.expand {
      width: calc(100% - $base-menu-width);
    }
    &.fold {
      width: calc(100% - $base-menu-fold-width);
    }
    .layoutTabber {
      height: $base-tabbar-height;
      // background-color: $base-tabbar-background-color;
      border-bottom: 1px solid slategrey;
      transition: all 0.3s;
    }
    .layoutContent {
      height: calc(100% - $base-tabbar-height);
      width: 100%;
      background-color: $base-content-background-color;
      box-sizing: border-box;
      padding: 10px;
      overflow-y: auto;
    }
  }
}
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}
.fade-enter-active {
  transition: opacity 1s ease;
}
.fade-leave-to {
  opacity: 1;
  transform: scale(1);
}
</style>
