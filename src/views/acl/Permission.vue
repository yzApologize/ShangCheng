<template>
  <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="id" border>
    <el-table-column prop="name" label="名称" align="center" />
    <el-table-column prop="code" label="权限值" align="center" />
    <el-table-column prop="updateTime" label="更新时间" align="center" />
    <el-table-column label="操作" align="center">
      <template #default="scope">
        <div style="width: 100%; height: 100%; display: flex; justify-content: center">
          <el-button
            size="small"
            type="success"
            icon="Plus"
            @click="addMenu(scope.row)"
            :disabled="scope.row.level == 4">
            {{ scope.row.level == 3 ? '添加功能' : '添加菜单' }}
          </el-button>
          <el-button
            size="small"
            type="primary"
            icon="Edit"
            @click="editMenu(scope.row)"
            :disabled="scope.row.level == 1">
            编辑
          </el-button>
          <el-popconfirm title="确定要删除吗？" @confirm="deleteMenu(scope.row)">
            <template #reference>
              <el-button size="small" type="danger" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog :title="dialogTitle" v-model="dialogVisible" width="500px" @close="close">
    <el-form :model="form" :rules="rules" label-width="80px" ref="formInstance">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入菜单/功能名称"></el-input>
      </el-form-item>
      <el-form-item label="权限值" prop="code">
        <el-input v-model="form.code" placeholder="请输入权限值"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button type="danger" @click="cancel">取 消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllMenuAPI, addOrUpdateMenuAPI, deleteMenuAPI } from '@/api/acl';
import { ElMessage } from 'element-plus';
const tableData = ref([]);
const dialogTitle = ref('');
const dialogVisible = ref(false);
const form = ref({
  name: '',
  code: '',
  pid: 0,
  level: 0,
  id: 0
});
const formInstance = ref();
const rules = ref({
  name: [{ required: true, message: '请输入菜单/功能名称', trigger: 'blur' }],
  code: [{ required: true, message: '请输入权限值', trigger: 'blur' }]
});
const getAllMenu = async () => {
  try {
    const res = await getAllMenuAPI();
    console.log(res);
    if (res.code === 200) {
      tableData.value = res.data;
      ElMessage({
        type: 'success',
        message: '获取菜单列表成功'
      });
    }
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '获取菜单列表失败'
    });
  }
};
const addMenu = (row) => {
  if (row.level == 3) {
    dialogTitle.value = '添加功能';
  } else {
    dialogTitle.value = '添加菜单';
  }
  form.value.pid = row.id;
  form.value.level = row.level + 1;
  dialogVisible.value = true;
};
const editMenu = (row) => {
  dialogTitle.value = '编辑菜单';
  form.value.name = row.name;
  form.value.code = row.code;
  form.value.id = row.id;
  form.value.level = row.level;
  form.value.pid = row.pid;
  dialogVisible.value = true;
};
const deleteMenu = async (row) => {
  try {
    const res = await deleteMenuAPI(row.id);
    if (res.code === 200) {
      await getAllMenu();
      ElMessage({
        type: 'success',
        message: '删除菜单成功'
      });
    } else {
      ElMessage({
        type: 'error',
        message: '删除菜单失败'
      });
    }
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '删除菜单失败'
    });
  }
};
const close = () => {
  form.value = {
    name: '',
    code: '',
    pid: 0,
    level: 0,
    id: 0
  };
  formInstance.value?.clearValidate();
};
const submit = async () => {
  try {
    const res = await addOrUpdateMenuAPI(form.value);
    if (res.code === 200) {
      dialogVisible.value = false;
      await getAllMenu();
      ElMessage({
        type: 'success',
        message: form.value.id ? '编辑成功' : '添加成功'
      });
    } else {
      ElMessage({
        type: 'error',
        message: form.value.id ? '编辑失败' : '添加失败'
      });
    }
  } catch (error) {
    ElMessage({
      type: 'error',
      message: form.value.id ? '编辑失败' : '添加失败'
    });
  }
};
onMounted(async () => {
  await getAllMenu();
});
</script>

<style scoped lang="scss"></style>
