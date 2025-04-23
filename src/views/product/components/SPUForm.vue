<template>
  <div class="SPUFormContainer">
    <el-form :model="form" label-width="100px" v-loading="loading">
      <el-form-item label="SPU名称">
        <el-input placeholder="请输入SPU名称" v-model="form.spuName"></el-input>
      </el-form-item>
      <el-form-item label="SPU品牌">
        <el-select placeholder="请选择SPU品牌" v-model="form.tmId">
          <el-option v-for="item in tradeMarkArr" :value="item.id" :label="item.tmName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input type="textarea" placeholder="请输入SPU描述" v-model="form.description"></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          v-model:file-list="form.spuImageList"
          action="/api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :before-upload="upload"
          :on-success="uploadSuccess">
          <el-icon><Plus /></el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="SPU销售属性">
        <el-select
          :placeholder="
            unSelectedAttrList?.length == 0
              ? '已选择全部属性'
              : `还可选择${unSelectedAttrList?.length}个属性`
          "
          v-model="selectAttr"
          popper-class="pinpai-test">
          <el-option
            v-for="item in unSelectedAttrList"
            :value="`${item.id}:${item.name}`"
            :label="item.name"
            :key="item.id"></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="Plus"
          style="margin-left: 10px"
          :disabled="!selectAttr"
          @click="addSelectAttr"
          >添加属性</el-button
        >
        <el-table border :data="form.spuSaleAttrList" style="margin-top: 10px">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="120px"></el-table-column>
          <el-table-column label="属性值" align="center">
            <template #default="scope">
              <el-tag
                v-for="(item, index) in scope.row.spuSaleAttrValueList"
                closable
                :key="index"
                @close="scope.row.spuSaleAttrValueList.splice(index, 1)"
                >{{ item.saleAttrValueName }}</el-tag
              >
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                style="margin-left: 10px"
                v-if="!(scope.row.flag == true)"
                @click="scope.row['flag'] = true"
                >添加属性值</el-button
              >
              <el-input
                v-else
                v-model="scope.row.addValue"
                @blur="toTag(scope.row)"
                size="small"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100px">
            <template #default="scope">
              <el-button
                size="small"
                type="danger"
                icon="Delete"
                @click="form.spuSaleAttrList.splice(scope.$index, 1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Plus" @click="save">保存</el-button>
        <el-button type="primary" icon="Edit" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { addOrUpdateSpuAPI } from '@/api/spu';
import {
  getAllTrademarkAPI,
  getSpuImageListAPI,
  getSpuSaleAttrListAPI,
  getSaleAttrListAPI
} from '@/api/spu';
const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
});
const form = ref({
  id: '',
  spuName: '',
  tmId: '',
  description: '',
  category3Id: '',
  spuImageList: [],
  spuSaleAttrList: []
});
const selectAttr = ref('');
const loading = ref(false);
const tradeMarkArr = ref([]);
const AllAttrListArr = ref([]);
let unSelectedAttrList = computed(() => {
  if (form.value.spuSaleAttrList) {
    const selectedAttrList = form.value.spuSaleAttrList.map((item) => item.saleAttrName);
    return AllAttrListArr.value.filter((item) => !selectedAttrList.includes(item.name));
  }
});
const dialogVisible = ref(false);
const dialogImageUrl = ref('');
const emit = defineEmits(['changeScene']);
const getAllTrademark = async () => {
  try {
    const res = await getAllTrademarkAPI();
    console.log('tradeMarkArr', res);
    if (res.code === 200) {
      tradeMarkArr.value = res.data;
    }
  } catch {
    ElMessage.error('获取品牌失败');
  }
};
const getSpuImageList = async () => {
  try {
    const res = await getSpuImageListAPI(props.data.id);
    console.log('spuImageList', res);
    if (res.code === 200) {
      form.value.spuImageList = res.data.map((item: any) => {
        return {
          name: item.imgName,
          url: item.imgUrl
        };
      });
    }
  } catch {
    ElMessage.error('获取SPU图片失败!');
  }
};
const getSpuSaleAttrList = async () => {
  try {
    const res = await getSpuSaleAttrListAPI(props.data.id);
    console.log('spuSaleAttrList', res);
    if (res.code === 200) {
      form.value.spuSaleAttrList = res.data;
    }
  } catch {
    ElMessage.error('获取SPU销售属性失败');
    form.value.spuSaleAttrList = [
      {
        saleAttrName: '颜色',
        spuSaleAttrValueList: [
          {
            saleAttrValueName: '红色'
          },
          {
            saleAttrValueName: '蓝色'
          }
        ]
      }
    ];
  }
};
const getAllSaleAttrList = async () => {
  try {
    const res = await getSaleAttrListAPI();
    console.log('AllAttrListArr', res);
    if (res.code === 200) {
      AllAttrListArr.value = res.data;
    } else {
      AllAttrListArr.value = [];
    }
  } catch {
    ElMessage.error('获取全部销售属性失败!');
    AllAttrListArr.value = [
      {
        name: '颜色',
        id: 1
      },
      {
        name: '版本',
        id: 2
      },
      {
        name: '尺码',
        id: 3
      }
    ];
  }
};
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};
const handleRemove = (file: any, fileList: any) => {
  console.log(file, fileList);
};
const upload = (file) => {
  if (file.size / 1024 / 1024 > 4) {
    ElMessage.error('上传图片不能超过4M');
    return false;
  } else if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
    ElMessage.error('上传图片格式不正确');
    return false;
  }
  return true;
};
const uploadSuccess = (res, file) => {
  if (res.code === 200) {
    form.value.spuImageList.push({
      name: file.name,
      url: res.data
    });
  }
};
const addSelectAttr = () => {
  const [id, name] = selectAttr.value.split(':');
  const newAttr = {
    saleAttrName: name,
    baseSaleAttrId: id,
    spuSaleAttrValueList: []
  };
  form.value.spuSaleAttrList.push(newAttr);
  selectAttr.value = '';
};
const toTag = (row) => {
  // 点击添加属性值按钮后，将输入框的值添加到标签中
  if (row.addValue == '' || row.addValue == undefined) {
    ElMessage.error('请输入属性值');
    return;
  } else if (row.spuSaleAttrValueList.some((item) => item.saleAttrValueName == row.addValue)) {
    ElMessage.error('属性值已存在');
    return;
  } else {
    row.spuSaleAttrValueList.push({
      saleAttrValueName: row.addValue,
      baseSaleAttrId: row.baseSaleAttrId
    });
    row.addValue = '';
    row.flag = false;
  }
};
onMounted(async () => {
  if (props.data.id) {
    for (const key in props.data) {
      if (key == 'spuImageList') {
        props.data[key] = [];
      }
    }
    Object.assign(form.value, props.data);
    try {
      loading.value = true;
      await getAllTrademark();
      await getSpuImageList();
      await getSpuSaleAttrList();
      await getAllSaleAttrList();
      loading.value = false;
    } catch {
    } finally {
      loading.value = false;
    }
  } else {
    form.value.category3Id = props.data.category3Id;
    try {
      loading.value = true;
      await getAllTrademark();
      await getAllSaleAttrList();
      loading.value = false;
    } catch {
    } finally {
      loading.value = false;
    }
  }
});
const save = async () => {
  console.log('form', form.value);
  if (form.value.id) {
    //编辑
    form.value.spuImageList = form.value.spuImageList.map((item) => {
      return {
        imgName: item.name,
        imgUrl: item.url
      };
    });
    try {
      loading.value = true;
      const res = await addOrUpdateSpuAPI(form.value);
      if (res.code === 200) {
        ElMessage.success('编辑SPU成功');
        emit('changeScene', 0);
        loading.value = false;
        // 清空form
        form.value = {
          id: '',
          spuName: '',
          tmId: '',
          description: '',
          category3Id: '',
          spuImageList: [],
          spuSaleAttrList: []
        };
      }
    } catch {
      ElMessage.error('编辑SPU失败');
      loading.value = false;
    } finally {
      loading.value = false;
    }
  } else {
    //添加
    console.log('form', form.value);
    form.value.spuImageList = form.value.spuImageList.map((item) => {
      return {
        imgName: item.name,
        imgUrl: item.url
      };
    });
    form.value.tmId = '1';
    try {
      loading.value = true;
      const res = await addOrUpdateSpuAPI(form.value);
      if (res.code === 200) {
        ElMessage.success('添加SPU成功');
        emit('changeScene', 0);
        loading.value = false;
        // 清空form
        form.value = {
          id: '',
          spuName: '',
          tmId: '',
          description: '',
          category3Id: '',
          spuImageList: [],
          spuSaleAttrList: []
        };
      }
    } catch {
      ElMessage.error('添加SPU失败');
      loading.value = false;
    } finally {
      loading.value = false;
    }
  }
};
const cancel = () => {
  emit('changeScene', 0);
  form.value = {
    id: '',
    spuName: '',
    tmId: '',
    description: '',
    category3Id: '',
    spuImageList: [],
    spuSaleAttrList: []
  };
};
</script>

<style scoped lang="scss">
.SPUFormContainer {
  width: 100%;
  height: 100%;
  :deep(.el-input) {
    width: 200px;
  }
}
</style>
