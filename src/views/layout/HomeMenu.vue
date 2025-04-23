<template>
  <template v-for="(item, key) in data">
    <!-- 没有子路由 -->
    <el-menu-item v-if="!item.children && !item.meta.hidden" :index="item.path">
      <el-icon><component :is="item.meta.icon"></component></el-icon>
      <template #title>
        {{ item.meta.title }}
      </template>
    </el-menu-item>
    <!-- 有子路由，且只有一个,（因为所有views的路径都得从layout开始，如果是一级子路由在菜单上又必须显示为单个一级路由，而不显示layout） -->
    <el-menu-item
      v-if="item.children && item.children.length === 1 && !item.meta.hidden"
      :index="item.children[0].path">
      <el-icon><component :is="item.children[0].meta.icon"></component></el-icon>
      <template #title>
        {{ item.children[0].meta.title }}
      </template>
    </el-menu-item>
    <!-- 有子路由，且有多个 -->
    <el-sub-menu
      v-if="item.children && item.children.length > 1 && !item.meta.hidden"
      :index="item.path">
      <template #title>
        <el-icon><component :is="item.meta.icon"></component></el-icon>
        <span> {{ item.meta.title }}</span>
      </template>
      <!-- 递归调用 -->
      <HomeMenu :data="item.children"></HomeMenu>
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
});
</script>

<style scoped lang="scss"></style>
