<template>
  <div class="centerScreen">
    <div class="chinaMap" ref="map"></div>
    <div class="line" ref="line"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
let map = ref(null);
let line = ref(null);
const initChinaMap = () => {
  if (!map.value) {
    map.value = echarts.init(map.value);
    const option = {};
  }
};
onMounted(() => {});
</script>

<style scoped lang="scss">
.centerScreen {
  width: 100%;
  height: 100%;
  .chinaMap {
    width: 100%;
    height: 70%;
    // background-color: red;
  }
  .line {
    width: 100%;
    height: 30%;
    background-color: green;
  }
}
</style>
