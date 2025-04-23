<template>
  <div class="SKUFormContainer">
    <el-form ref="skuForm" label-width="100px">
      <el-form-item label="SKU名称">
        <el-input v-model="form.skuName" placeholder="SKU名称"></el-input>
      </el-form-item>
      <el-form-item label="价格">
        <el-input v-model="form.price" placeholder="价格(元)" type="number"></el-input>
      </el-form-item>
      <el-form-item label="重量">
        <el-input v-model="form.weight" placeholder="重量(克)" type="number"></el-input>
      </el-form-item>
      <el-form-item label="SKU描述">
        <el-input v-model="form.skuDesc" placeholder="SKU描述" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" class="attr">
          <el-form-item v-for="(item, index) in attrValueList" :key="index" :label="item.attrName">
            <el-select v-model="item.value" @change="selectChange">
              <el-option
                v-for="(item1, index1) in item.attrValueList"
                :key="index1"
                :label="item1.valueName"
                :value="`${item1.attrId}:${item1.id}`">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" class="attr">
          <el-form-item
            v-for="(item, index) in saleAttrValueList"
            :key="index"
            :label="item.saleAttrName">
            <el-select v-model="item.value" @change="selectChange1">
              <el-option
                v-for="(item1, index1) in item.spuSaleAttrValueList"
                :key="index1"
                :label="item1.saleAttrValueName"
                :value="`${item.id}:${item1.id}`">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片名称">
        <el-table border :data="ImgList" ref="table">
          <el-table-column type="selection" width="100px" align="center"></el-table-column>
          <el-table-column label="图片" align="center">
            <template #default="scope">
              <el-image
                :src="scope.row.imgUrl"
                fit="contain"
                width="100px"
                height="100px"></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template #default="scope">
              <el-button type="warning" @click="setDefault(scope.row)">设为默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">保存</el-button>
        <el-button type="default" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getAttrListAPI } from '@/api/attr';
import { getSpuImageListAPI, getSpuSaleAttrListAPI, addSkuAPI } from '@/api/spu';
const props = defineProps({
  data: {
    type: Object,
    default: () => {
      return {};
    }
  }
});
const emit = defineEmits(['changeScene']);
const form = ref({
  category3Id: '',
  spuId: '',
  tmId: '',
  skuName: '',
  skuDesc: '',
  weight: '',
  price: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: ''
});
const table = ref(null);
const attrValueList = ref<any[]>([]);
const saleAttrValueList = ref<any[]>([]);
const ImgList = ref<any[]>([]);
const cancel = () => {
  emit('changeScene', 0, false);
};
const getAttrList = async (c1, c2, c3) => {
  try {
    const res = await getAttrListAPI(c1, c2, c3);
    if (res.code === 200) {
      console.log('品牌所有属性', res);
      attrValueList.value = res.data;
    }
  } catch {
    ElMessage.error('获取属性失败');
  }
};
const getSpuImageList = async (id) => {
  try {
    const res = await getSpuImageListAPI(id);
    if (res.code === 200) {
      console.log('品牌图片', res);
      ImgList.value = res.data;
    }
  } catch {
    ElMessage.error('获取图片失败');
  }
};
const getSpuSaleAttrList = async (id) => {
  try {
    const res = await getSpuSaleAttrListAPI(id);
    if (res.code === 200) {
      console.log('品牌销售属性', res);
      saleAttrValueList.value = res.data;
    }
  } catch {
    ElMessage.error('获取销售属性失败');
  }
};
const selectChange = (value) => {
  console.log(value);
  form.value.skuAttrValueList.push(value);
};
const selectChange1 = (value) => {
  console.log(value);
  form.value.skuSaleAttrValueList.push(value);
};
const addSKU = async (data) => {
  try {
    const res = await addSkuAPI(data);
    if (res.code === 200) {
      ElMessage.success('添加成功');
      emit('changeScene', 0, false);
    }
  } catch {
    ElMessage.error('添加失败');
  }
};
const submit = async () => {
  form.value.tmId = props.data.tmId;
  form.value.category3Id = props.data.category3Id;
  form.value.spuId = props.data.id;
  form.value.skuAttrValueList = form.value.skuAttrValueList.map((item) => {
    return {
      attrId: item.split(':')[0],
      valueId: item.split(':')[1]
    };
  });
  form.value.skuSaleAttrValueList = form.value.skuSaleAttrValueList.map((item) => {
    return {
      saleAttrId: item.split(':')[0],
      saleAttrValueId: item.split(':')[1]
    };
  });
  console.log(form.value);
  await addSKU(form.value);
};
const setDefault = (row) => {
  form.value.skuDefaultImg = row.imgUrl;
  table.value.clearSelection(); // 清空选中
  table.value.toggleRowSelection(row, true); // 选中当前行
};
onMounted(async () => {
  await getAttrList(props.data.category1Id, props.data.category2Id, props.data.category3Id);
  await getSpuImageList(props.data.id);
  await getSpuSaleAttrList(props.data.id);
});
</script>

<style scoped lang="scss">
.SKUFormContainer {
  width: 100%;
  height: 100%;
  :deep(.el-select) {
    width: 200px;
  }
  .attr {
    .el-form-item {
      margin-bottom: 10px;
      :deep(.el-form-item__label) {
        width: 82px;
      }
    }
  }
}
</style>
