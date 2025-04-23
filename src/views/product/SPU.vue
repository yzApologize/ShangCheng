<template>
  <div class="SPUContainer">
    <el-card class="top" style="height: 10%">
      <el-form :model="form" :inline="true">
        <el-form-item label="一级分类" prop="category1">
          <el-select
            v-model="form.category1"
            placeholder="请选择一级分类"
            v-loading="loading1"
            :disabled="!(isDisplay == 0)">
            <el-option
              v-for="(item, index) in categoryArr1"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" prop="category2">
          <el-select
            v-model="form.category2"
            placeholder="请选择二级分类"
            v-loading="loading2"
            :disabled="!(isDisplay == 0)">
            <el-option
              v-for="(item, index) in categoryArr2"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="三级分类" prop="category3">
          <el-select
            v-model="form.category3"
            placeholder="请选择三级分类"
            v-loading="loading3"
            :disabled="!(isDisplay == 0)">
            <el-option
              v-for="(item, index) in categoryArr3"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="bottom">
      <div class="table" v-if="isDisplay == 0">
        <el-button type="primary" icon="Plus" :disabled="!form.category3" @click="addSPU"
          >添加SPU</el-button
        >
        <el-table :data="tableData" style="width: 100%" border v-loading="tableLoading">
          <el-table-column label="序号" type="index" width="100px" align="center"></el-table-column>
          <el-table-column prop="spuName" label="SPU名称" align="center"></el-table-column>
          <el-table-column prop="description" label="SPU描述" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <div style="width: 100%; height: 100%; display: flex">
                <el-button
                  size="small"
                  type="primary"
                  icon="Plus"
                  @click="addSKU(scope.row)"></el-button>
                <el-button
                  size="small"
                  type="warning"
                  icon="Edit"
                  @click="editSPU(scope.row)"></el-button>
                <el-button
                  size="small"
                  type="info"
                  icon="InfoFilled"
                  @click="openSKUDialog(scope.row)"></el-button>
                <el-popconfirm title="确定要删除吗？" @confirm="deleteSPU(scope.row)">
                  <template #reference>
                    <el-button size="small" type="danger" icon="Delete"></el-button>
                  </template>
                </el-popconfirm>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next,jumper, ->, sizes,total"
          :total="total"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20]"
          @size-change="getSPU"
          @current-change="getSPU"></el-pagination>
      </div>
      <div class="table" v-else-if="isDisplay == 1">
        <SPUForm @changeScene="changeScene" :data="spuData" />
      </div>
      <div class="table" v-else-if="isDisplay == 2">
        <SKUForm @changeScene="changeScene" :data="skuData" />
      </div>
      <SKUDialog ref="SKUDialogInstance" :data="rowdata" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { getSPUAPI, deleteSpuAPI } from '@/api/spu';
import { getC1API, getC2API, getC3API } from '@/api/attr';
import { ElMessage } from 'element-plus';
import SPUForm from './components/SPUForm.vue';
import SKUForm from './components/SKUForm.vue';
import SKUDialog from './components/SKUDialog.vue';
const form = reactive({
  category1: '',
  category2: '',
  category3: ''
});
const tableData = ref<any[]>([{}]);
const isDisplay = ref(0);
const loading1 = ref(false);
const loading2 = ref(false);
const loading3 = ref(false);
const tableLoading = ref(false);
const categoryArr1 = ref<any[]>([]);
const categoryArr2 = ref<any[]>([]);
const categoryArr3 = ref<any[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const spuData = ref({});
const skuData = ref({});
const rowdata = ref({});
const SKUDialogInstance = ref();
const getC1 = async () => {
  try {
    loading1.value = true;
    const res = await getC1API();
    console.log(res);
    loading1.value = false;
    if (res.code === 200) {
      categoryArr1.value = res.data;
    }
  } catch {
    ElMessage.error('获取一级分类失败');
  } finally {
    loading1.value = false;
  }
};
const getC2 = async (id: number) => {
  try {
    loading2.value = true;
    const res = await getC2API(id);
    console.log(res);
    loading2.value = false;
    if (res.code === 200) {
      categoryArr2.value = res.data;
    }
  } catch {
    ElMessage.error('获取二级分类失败');
  } finally {
    loading2.value = false;
  }
};
const getC3 = async (id: number) => {
  try {
    loading3.value = true;
    const res = await getC3API(id);
    console.log(res);
    loading3.value = false;
    if (res.code === 200) {
      categoryArr3.value = res.data;
    }
  } catch {
    ElMessage.error('获取三级分类失败');
  } finally {
    loading3.value = false;
  }
};
const getSPU = async () => {
  try {
    tableLoading.value = true;
    const res = await getSPUAPI(currentPage.value, pageSize.value, form.category3);
    console.log(res);
    if (res.code === 200) {
      tableData.value = res.data.records;
      total.value = res.data.total;
    }
    tableLoading.value = false;
  } catch (err) {
    ElMessage.error('获取SPU失败');
  } finally {
    tableLoading.value = false;
  }
};
//监控1级
watch(
  () => form.category1,
  async (newVal, oldVal) => {
    if (newVal) {
      form.category2 = '';
      categoryArr2.value = [];
      form.category3 = '';
      categoryArr3.value = [];
      await getC2(newVal);
    }
  }
);
//监控2级
watch(
  () => form.category2,
  async (newVal, oldVal) => {
    form.category3 = '';
    categoryArr3.value = [];
    if (newVal) {
      await getC3(newVal);
    }
  }
);
//监控3级
watch(
  () => form.category3,
  async (newVal, oldVal) => {
    tableData.value = [];
    if (newVal) {
      if (form.category1 && form.category2 && form.category3) {
        await getSPU();
      }
    }
  }
);
const editSPU = (row) => {
  console.log(row);
  isDisplay.value = 1;
  spuData.value = row;
};
const addSPU = () => {
  isDisplay.value = 1;
  spuData.value = {
    category3Id: form.category3
  };
};
const changeScene = async (value, flag = true) => {
  isDisplay.value = value;
  if (value == 0 && flag) {
    await getSPU();
  } else if (value == 1 && flag == false) {
    isDisplay.value = value;
  }
};
const addSKU = (row) => {
  isDisplay.value = 2;
  console.log(row);
  skuData.value = {
    ...row,
    category1Id: form.category1,
    category2Id: form.category2
  };
};
const deleteSPU = async (row) => {
  console.log(row);
  try {
    const res = await deleteSpuAPI(row.id);
    if (res.code == 200) {
      ElMessage.success('删除成功');
      await getSPU();
    }
  } catch {
    ElMessage.error('删除失败');
  }
};
const openSKUDialog = (row: any) => {
  console.log(row);
  rowdata.value = row;
  SKUDialogInstance.value.dialogVisible = true;
};
onMounted(async () => {
  await getC1();
});
</script>

<style scoped lang="scss">
:deep(.el-card) {
  width: 100%;
  > .el-card__body {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
  }
}
.SPUContainer {
  width: 100%;
  min-height: 100%;
  .top {
    height: 10%;
  }
  .bottom {
    min-height: 90%;
    .table {
      width: 100%;
      height: 100%;
    }
  }
  :deep(.el-select) {
    width: 200px;
  }
  :deep(.el-table) {
    margin-top: 10px;
  }
  :deep(.el-pagination) {
    width: 95%;
    margin-top: 10px;
  }
}
</style>
