<template>
  <div class="screenContainer">
    <div class="screen" ref="screen">
      <div class="top">
        <div class="topLeft">
          <div class="topLeftBut" @click="router.push('/home')">首页</div>
        </div>
        <div class="topCenter">智慧旅游可视化数据展示平台</div>
        <div class="topRight">
          <div class="topRightBut">统计报告</div>
          {{ currentTime }}
        </div>
      </div>
      <div class="bottom">
        <div class="left">
          <LeftScreen />
        </div>
        <div class="center">
          <CenterScreen />
        </div>
        <div class="right">
          <RightScreen />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LeftScreen from './LeftScreen.vue';
import CenterScreen from './centerScreen.vue';
import RightScreen from './RightScreen.vue';

const screen = ref(null);
const currentTime = ref(null);
const router = useRouter();
let interval;
const getScreen = (w = 1920, h = 1080) => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const scale = Math.min(screenWidth / w, screenHeight / h);
  return scale;
};
window.addEventListener('resize', () => {
  if (screen.value) {
    screen.value.style.transform = `scale(${getScreen()}) translate(-50%, -50%)`;
  }
});
const updateDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  currentTime.value = `当前时间：${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

onMounted(() => {
  if (screen.value) {
    screen.value.style.transform = `scale(${getScreen()}) translate(-50%, -50%)`;
  }
  // 每秒调用一次 updateDateTime 函数
  interval = setInterval(updateDateTime, 1000);
});
onUnmounted(() => {
  clearInterval(interval); // 组件卸载时清除定时器
});
</script>

<style scoped lang="scss">
.screenContainer {
  width: 100vw;
  height: 100vh;
  background-image: url('@/assets/images/screen/bg.png');
  background-size: 100% 100%;
  .screen {
    width: 1980px;
    height: 1080px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform-origin: left top;
    .top {
      width: 100%;
      height: 60px;
      // background-image: url('@/assets/images/screen/top.png');
      // background-size: 100% 100%;
      display: flex;
      align-items: flex-start;
      .topLeft {
        flex: 1;
        height: 30px;
        background-image: url('@/assets/images/screen/dataScreen-header-left-bg.png');
        background-size: 100% 100%;
        position: relative;
        .topLeftBut {
          width: 120px;
          height: 100%;
          position: absolute;
          right: 0;
          background-image: url('@/assets/images/screen/dataScreen-header-btn-bg-l.png');
          background-size: 100% 100%;
          cursor: pointer;
          text-align: center;
          line-height: 30px;
          font-size: 15px;
          font-weight: bold;
          color: aqua;
        }
      }
      .topCenter {
        flex: 2;
        height: 100%;
        background-image: url('@/assets/images/screen/dataScreen-header-center-bg.png');
        background-size: 100% 100%;
        text-align: center;
        line-height: 60px;
        font-size: 20px;
        font-weight: bold;
        color: aqua;
      }
      .topRight {
        flex: 1;
        height: 30px;
        background-image: url('@/assets/images/screen/dataScreen-header-right-bg.png');
        background-size: 100% 100%;
        position: relative;
        text-align: center;
        line-height: 30px;
        font-size: 15px;
        color: aqua;
        .topRightBut {
          width: 120px;
          height: 100%;
          position: absolute;
          left: 0;
          background-image: url('@/assets/images/screen/dataScreen-header-btn-bg-r.png');
          background-size: 100% 100%;
          cursor: pointer;
          text-align: center;
          line-height: 30px;
          font-size: 15px;
          color: aqua;
        }
      }
    }
    .bottom {
      width: 100%;
      height: 1030px;
      display: flex;
      .left {
        flex: 1;
        // background-color: red;
      }
      .center {
        flex: 2;
        padding: 0px 10px;
      }
      .right {
        flex: 1;
      }
    }
  }
}
</style>
