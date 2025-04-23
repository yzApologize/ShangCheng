<template>
  <!--svg是图表外层容器节点，内部需要结合use标签使用 -->
  <!-- href表示使用哪个图标，fill表示要什么颜色 -->
  <svg :style="{ width, height }">
    <use :href="prefix + props.name" :fill="color"></use>
  </svg>
</template>

<script setup lang="ts">
const prefix = '#icon-';
const props = defineProps({
  name: {
    required: true,
    type: String
  },
  width: {
    type: String,
    default: '16px'
  },
  height: {
    type: String,
    default: '16px'
  },
  color: {
    required: true,
    type: String
  }
});
</script>

<style scoped lang="scss"></style>
