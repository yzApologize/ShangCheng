<template>
  <div class="tradeMarkContainer">
    <el-card>
      <div style="margin-bottom: 10px">
        <el-button type="primary" icon="Plus" @click="add">添加品牌</el-button>
      </div>
      <el-table :data="tableData" border style="width: 100%" v-loading="loadingFlag">
        <el-table-column type="index" width="100" label="序号" align="center"></el-table-column>
        <el-table-column prop="tmName" label="品牌名称" align="center"></el-table-column>
        <el-table-column prop="logoUrl" label="品牌logo" align="center">
          <template #default="scope">
            <img :src="scope.row.logo" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column prop="" label="品牌管理" align="center">
          <template #default="scope">
            <el-button type="primary" icon="Edit" @click="edit(scope)">编辑</el-button>
            <el-button type="danger" icon="Delete" @click="deleteActive(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next ,jumper, ->, sizes,total"
        :total="total"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20]"
        @size-change="handleSizeChange"></el-pagination>
    </el-card>
  </div>
  <TradeMarkDialog
    ref="tradeMarkDialogInstance"
    :title="dialogTitle"
    :row="row"
    @refresh="pageRefresh"></TradeMarkDialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getTradeMarkPageAPI, deleteTradeMarkAPI } from '@/api/product';
import TradeMarkDialog from './components/TradeMarkDialog.vue';
const tableData = ref([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const loadingFlag = ref(false);
const tradeMarkDialogInstance = ref<InstanceType<typeof TradeMarkDialog>>();
const dialogTitle = ref('');
const row = ref({});
const getTradeMarkPage = async (page = 1) => {
  try {
    loadingFlag.value = true;
    const res = await getTradeMarkPageAPI(currentPage.value, pageSize.value);
    console.log(res);
    tableData.value = res.data.records;
    total.value = res.data.total;
    loadingFlag.value = false;
  } catch (err) {
    console.log(err);
    ElMessage({
      type: 'error',
      message: '服务器繁忙'
    });
  } finally {
    loadingFlag.value = false;
  }
};
onMounted(async () => {
  await getTradeMarkPage();
});
watch([currentPage, pageSize], async () => {
  console.log('参数变化');
  await getTradeMarkPage();
});
const handleSizeChange = async () => {
  currentPage.value = 1;
};
const add = () => {
  dialogTitle.value = '添加品牌';
  tradeMarkDialogInstance.value?.openDialog();
};
const edit = (scope) => {
  dialogTitle.value = '编辑品牌';
  row.value = scope.row;
  tradeMarkDialogInstance.value?.openDialog();
};
const deleteActive = (id) => {
  ElMessageBox.confirm('确定删除吗？', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 删除
      try {
        await deleteTradeMarkAPI(id);
        ElMessage({
          type: 'success',
          message: '删除成功'
        });
        if (tableData.value.length == 1 && currentPage.value != 1) {
          // 最后一页
          currentPage.value--;
        }
      } catch {
        ElMessage({
          type: 'error',
          message: '删除失败'
        });
      }
    })
    .catch(() => {});
};
const pageRefresh = async () => {
  await getTradeMarkPage();
};
</script>

<style scoped lang="scss">
.tradeMarkContainer {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  :deep(.el-card) {
    min-height: 99%;
    .el-card__body {
      height: 100%;
    }
  }
  :deep(.el-table) {
    min-height: 720px;
  }
  :deep(.el-pagination) {
    width: 95%;
    // position: absolute;
    margin-top: 20px;
  }
}
</style>
