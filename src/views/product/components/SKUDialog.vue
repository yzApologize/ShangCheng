<template>
  <div class="skuDialogContainer">
    <el-dialog v-model="dialogVisible" @open="open" width="800px">
      <template #header>
        <span>SKU列表</span>
      </template>
      <el-table :data="tableData" style="width: 100%" border v-loading="tableLoading">
        <el-table-column prop="skuName" label="SKU名称" align="center"></el-table-column>
        <el-table-column prop="price" label="SKU价格" align="center"></el-table-column>
        <el-table-column prop="weight" label="SKU重量" align="center"></el-table-column>
        <el-table-column label="SKU图片" align="center">
          <template #default="scope">
            <el-image :src="scope.row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { getSkuListAPI } from '@/api/spu';
const dialogVisible = ref(false);
const tableData = ref<any[]>([{}]);
const tableLoading = ref(false);
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
});
defineExpose({
  dialogVisible
});
const getSkuList = async (id) => {
  try {
    tableLoading.value = true;
    const res = await getSkuListAPI(id);
    console.log(res);
    tableLoading.value = false;
  } catch {
    ElMessage.error('获取sku列表失败');
  } finally {
    tableLoading.value = false;
  }
};
const open = async () => {
  await getSkuList(props.data.id);
};
</script>

<style scoped lang="scss">
.skuDialogContainer {
  :deep(.el-dialog__header) {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }
}
</style>
