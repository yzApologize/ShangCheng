<template>
  <div class="attributeContainer">
    <el-card style="height: 10%">
      <el-form :model="form" :inline="true">
        <el-form-item label="一级分类" prop="category1">
          <el-select
            v-model="form.category1"
            placeholder="请选择一级分类"
            v-loading="loading1"
            :disabled="!isDisplay">
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
            :disabled="!isDisplay">
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
            :disabled="!isDisplay">
            <el-option
              v-for="(item, index) in categoryArr3"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card style="min-height: 90%">
      <div class="display" v-if="isDisplay">
        <el-button
          icon="Plus"
          type="primary"
          style="margin-bottom: 10px"
          :disabled="!(form.category1 && form.category2 && form.category3)"
          @click="isDisplay = false"
          >添加属性</el-button
        >
        <el-table :data="tableData" border style="width: 100%" v-loading="tableLoading">
          <el-table-column type="index" label="序号" align="center" width="100px"></el-table-column>
          <el-table-column
            label="属性名称"
            prop="attrName"
            align="center"
            width="150px"></el-table-column>
          <el-table-column label="属性值名称" align="center">
            <template #default="scope">
              <div class="spanBox">
                <el-tag
                  v-for="(item, index) in scope.row.attrValueList"
                  :key="index"
                  type="primary"
                  >{{ item.valueName }}</el-tag
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="tmName" align="center" width="200px">
            <template #default="scope">
              <el-button type="primary" icon="Edit" @click="editAttr(scope.row)">编辑</el-button>
              <el-popconfirm
                :title="`确定删除${scope.row.attrName}吗?`"
                @confirm="deleteAllAttr(scope.row)">
                <template #reference>
                  <el-button type="danger" icon="Delete">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="add" v-else>
        <el-form
          ><el-form-item label="属性名称:"
            ><el-input v-model="attrParama.attrName"></el-input></el-form-item
        ></el-form>
        <div style="display: flex">
          <el-button
            type="primary"
            icon="Plus"
            :disabled="!attrParama.attrName"
            @click="addAttrValue"
            >添加属性值</el-button
          >
          <el-button>取消</el-button>
        </div>
        <el-table
          :data="attrParama.attrValueList"
          border
          style="width: 100%"
          v-loading="tableLoading">
          <el-table-column type="index" label="序号" align="center" width="100px"></el-table-column>
          <el-table-column label="属性值名称" align="center">
            <template #default="scope">
              <el-input
                v-model="scope.row.valueName"
                v-if="scope.row.flag"
                placeholder="请输入属性值名称"
                :ref="(item) => (inputInstanceArr[scope.$index] = item)"
                @blur="tolook(scope.row, scope.$index)"></el-input>
              <div
                v-else
                @click="toedit(scope.row, scope.$index)"
                style="
                  width: 100%;
                  min-height: 40px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                ">
                {{ scope.row.valueName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="tmName" align="center">
            <template #default="scope">
              <el-button type="danger" icon="Delete" @click="deleteAttr(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div style="display: flex">
          <el-button
            type="primary"
            @click="addAttr(attrParama)"
            :disabled="attrParama.attrValueList.length == 0"
            >保存</el-button
          >
          <el-button @click="isDisplay = true">取消</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import {
  getC1API,
  getC2API,
  getC3API,
  getAttrListAPI,
  addOrUpdateAttrAPI,
  deleteAttrAPI
} from '@/api/attr/index';
const form = reactive({
  category1: '',
  category2: '',
  category3: ''
});
const categoryArr1 = ref([]);
const categoryArr2 = ref([]);
const categoryArr3 = ref([]);
const loading1 = ref(false);
const loading2 = ref(false);
const loading3 = ref(false);
const tableLoading = ref(false);
const tableData = ref([]);
const isDisplay = ref(true);
const attrParama = ref({
  attrName: '',
  categoryId: '',
  categoryLevel: 3,
  attrValueList: []
});
const inputInstanceArr = ref([]); //存储input实例,可以给一个元素或组件绑定 ref，并将一个函数赋值给它，当元素或组件挂载后，这个函数会被调用，并且会传入对应的元素或组件实例作为参数
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
const getTableData = async () => {
  try {
    tableLoading.value = true;
    const res = await getAttrListAPI(form.category1, form.category2, form.category3);
    console.log('表格数据', res);
    if (res.code === 200) {
      tableData.value = res.data;
    }
  } catch {
    ElMessage.error('获取属性失败');
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
        await getTableData();
      }
    }
  }
);
//编辑属性
const editAttr = (row) => {
  console.log(row);
  isDisplay.value = false;
  //深度克隆
  Object.assign(attrParama.value, JSON.parse(JSON.stringify(row)));
};
const addAttrValue = () => {
  attrParama.value.attrValueList.push({ valueName: '', flag: true });
  nextTick(() => {
    //自动聚焦
    inputInstanceArr.value[attrParama.value.attrValueList.length - 1].focus();
  });
};
const tolook = (row, index) => {
  if (row.valueName.trim() === '') {
    ElMessage.error('属性值名称不能为空');
    attrParama.value.attrValueList.splice(index, 1); //删除当前行
    return;
  }
  //判断是否重复
  const arr = attrParama.value.attrValueList.filter((item) => item.valueName === row.valueName);
  if (arr.length > 1) {
    ElMessage.error('属性值名称不能重复');
    attrParama.value.attrValueList.splice(index, 1); //删除当前行
    return;
  }
  row.flag = false;
};
const toedit = (row, index) => {
  row.flag = true;
  nextTick(() => {
    inputInstanceArr.value[index].focus();
  });
};
const deleteAttr = (scope) => {
  console.log(scope.$index);
  attrParama.value.attrValueList.splice(scope.$index, 1);
};
const deleteAllAttr = async (row) => {
  try {
    let res = await deleteAttrAPI(row.id);
    if (res.code === 200) {
      ElMessage.success('删除属性成功');
      await getTableData();
    }
  } catch {
    ElMessage.error('删除属性失败');
  }
};
const addAttr = async (parama) => {
  //添加属性
  parama.categoryId = form.category3;
  try {
    let res = await addOrUpdateAttrAPI(parama);
    if (res.code === 200) {
      ElMessage.success({
        message: parama.id ? '修改属性成功' : '添加属性成功',
        type: 'success'
      });
    }
    //重置表单
    attrParama.value = {
      attrName: '',
      categoryId: '',
      categoryLevel: 3,
      attrValueList: []
    };
    isDisplay.value = true;
    await getTableData();
  } catch {
    ElMessage.success({
      message: parama.id ? '修改属性失败' : '添加属性失败',
      type: 'error'
    });
  }
};

onMounted(async () => {
  await getC1();
});
</script>

<style scoped lang="scss">
.attributeContainer {
  width: 100%;
  height: 100%;
  :deep(.el-select) {
    width: 200px;
  }
  .spanBox {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    .el-tag {
      margin: 10px 10px 10px 0;
    }
  }
  .add {
    span {
      font-size: 14px;
    }
    .el-input {
      width: 200px;
      margin-left: 10px;
    }
    .el-button {
      margin-bottom: 10px;
    }
    .el-table {
      margin-bottom: 10px;
    }
  }
}
</style>
