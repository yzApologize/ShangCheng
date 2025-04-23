<template>
  <div class="SKUContainer">
    <el-card>
      <el-table :data="tableData" border v-loading="loading">
        <el-table-column label="序号" type="index" width="100px" align="center"></el-table-column>
        <el-table-column
          prop="skuName"
          label="名称"
          width="200px"
          align="center"
          show-overflow-tooltip></el-table-column>
        <el-table-column
          prop="skuDesc"
          label="描述"
          width="200px"
          align="center"
          show-overflow-tooltip></el-table-column>
        <el-table-column prop="skuDefaultImg" label="默认图片" align="center" width="200px">
          <template #default="scope">
            <div style="width: 100px; height: 100px">
              <el-image :src="scope.row.imgUrl" fit="cover" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="weight"
          label="重量(g)"
          width="200px"
          align="center"></el-table-column>
        <el-table-column
          prop="price"
          label="价格(元)"
          width="200px"
          align="center"></el-table-column>
        <el-table-column label="操作" width="500px" align="center" fixed="right">
          <template #default="scope">
            <div style="width: 100%; height: 100%; display: flex; justify-content: center">
              <el-button
                size="small"
                type="success"
                icon="Top"
                @click="cancelSale(scope.row)"
                v-if="scope.row.isSale == 0"></el-button>
              <el-button
                size="small"
                type="info"
                icon="Bottom"
                color="gray"
                @click="onSale(scope.row)"
                v-else></el-button>
              <el-button size="small" type="warning" icon="Edit"></el-button>
              <el-button
                size="small"
                type="info"
                icon="InfoFilled"
                @click="openDrawer(scope.row)"></el-button>
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
        @size-change="getProductList"
        @current-change="getProductList"></el-pagination>
      <!--右边抽屉  -->
      <el-drawer v-model="drawer" v-loading="drawerLoading">
        <template #header> 商品信息 </template>
        <!-- <span>Hi there!</span> -->
        <el-descriptions :column="1" border>
          <el-descriptions-item label="名称">
            <span>{{ skuInformation.skuName }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="描述">
            <span>{{ skuInformation.skuDesc }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="价格">
            <span>{{ skuInformation.price }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="平台属性">
            <el-tag v-for="(item, index) in skuInformation.skuAttrValueList" :key="index">{{
              item.valueName
            }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="消费属性">
            <el-tag v-for="(item, index) in skuInformation.skuSaleAttrValueList" :key="index">{{
              item.saleAttrValueName
            }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
        <el-carousel height="150px" type="card" indicator-position="outside">
          <el-carousel-item v-for="item in skuInformation.skuImageList" :key="item">
            <el-image :src="item.imgUrl" fit="cover" />
          </el-carousel-item>
        </el-carousel>
      </el-drawer>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import {
  getProductListAPI,
  cancelSaleAPI,
  onSaleAPI,
  getSkuInfoAPI,
  deleteSkuAPI
} from '@/api/sku';
const tableData = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);
const drawer = ref(false);
const drawerLoading = ref(false);
const skuInformation = ref({});
const getProductList = async () => {
  try {
    loading.value = true;
    const res = await getProductListAPI(currentPage.value, pageSize.value);
    console.log(res);
    if (res.code === 200) {
      tableData.value = res.data.records;
      total.value = res.data.total;
      ElMessage.success('获取商品列表成功');
      loading.value = false;
    }
  } catch {
    ElMessage.error('获取商品列表失败');
  } finally {
    loading.value = false;
  }
};
// const downSKU = (row) => {
//   row.isSale = 1;
// };
// const upSKU = (row) => {
//   row.isSale = 0;
// };
const cancelSale = async (row) => {
  try {
    loading.value = true;
    const res = await cancelSaleAPI(row.id);
    if (res.code === 200) {
      ElMessage.success('下架成功');
      getProductList();
    }
    loading.value = false;
  } catch {
    ElMessage.error('下架商品失败');
  } finally {
    loading.value = false;
  }
};
const onSale = async (row) => {
  try {
    loading.value = true;
    const res = await onSaleAPI(row.id);
    if (res.code === 200) {
      ElMessage.success('上架成功');
      getProductList();
    }
    loading.value = false;
  } catch {
    ElMessage.error('上架商品失败');
  } finally {
    loading.value = false;
  }
};
const getSkuInfo = async (id: number) => {
  try {
    drawerLoading.value = true;
    const res = await getSkuInfoAPI(id);
    console.log(res);
    if (res.code === 200) {
      skuInformation.value = res.data;
    }
    drawerLoading.value = false;
  } catch {
    ElMessage.error('获取商品信息失败');
  } finally {
    drawerLoading.value = false;
  }
};
const deleteSPU = async (row) => {
  try {
    loading.value = true;
    const res = await deleteSkuAPI(row.id);
    if (res.code === 200) {
      ElMessage.success('删除成功');
      getProductList();
    }
    loading.value = false;
  } catch {
    ElMessage.error('删除失败');
  } finally {
    loading.value = false;
  }
};
const openDrawer = async (row) => {
  drawer.value = true;
  await getSkuInfo(row.id);
};
onMounted(async () => {
  await getProductList();
});
</script>

<style scoped lang="scss">
.SKUContainer {
  width: 100%;
  height: 100%;
  .el-card {
    width: 100%;
    min-height: 100%;
  }
  .el-pagination {
    margin-top: 10px;
  }
  :deep(.el-drawer__header) {
    display: flex;
    justify-content: space-between;
    .el-drawer__close-btn {
      width: 20px;
      height: 20px;
    }
    > :first-child {
      flex: none !important;
    }
  }
  :deep(.el-carousel__item) {
    margin-top: 10px;
  }
  .el-carousel__item h3 {
    color: #475669;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
    text-align: center;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #d3dce6;
  }
}
</style>
