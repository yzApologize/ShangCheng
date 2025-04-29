<template>
  <div class="userContainer">
    <el-card class="top">
      <el-form label-width="100px" :inline="true">
        <el-form-item label="角色名称">
          <el-input v-model="rolename" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchRole" :disabled="rolename == ''">查询</el-button>
          <el-button type="primary" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="bottom">
      <div style="display: flex">
        <el-button icon="Plus" type="primary" @click="addRole">添加角色</el-button>
      </div>
      <el-table
        :data="roleList"
        @selection-change="handleSelect"
        style="width: 100%; height: 100%"
        border
        v-loading="loading">
        <el-table-column type="index" width="50px" label="#" align="center"></el-table-column>
        <el-table-column prop="id" label="ID" width="200px" align="center"></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="300px"
          align="center"></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="300px"
          align="center"></el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          width="300px"
          align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <div style="width: 100%; height: 100%; display: flex; justify-content: center">
              <el-button
                size="small"
                type="primary"
                icon="User"
                @click="assignPermission(scope.row)"
                >分配权限</el-button
              >
              <el-button
                size="small"
                type="success"
                icon="Edit"
                @click="editRole(scope.row)"></el-button>
              <el-popconfirm title="确定要删除吗？" @confirm="deleteUser(scope.row)">
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
        @size-change="getAllRoles"
        @current-change="getAllRoles"></el-pagination>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog v-model="dialogShow" :title="dialogTitle" width="500" @close="dialogClose">
      <el-form label-width="80px" :model="roleForm" :rules="rules" ref="formInstance">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submit">确定</el-button>
        <el-button @click="dialogShow = false">取消</el-button>
      </template>
    </el-dialog>
    <el-drawer v-model="drawer" title="分配权限" direction="rtl" @close="cancel">
      <el-tree
        style="max-width: 600px"
        ref="treeInstance"
        :data="data"
        v-loading="drawerLoading"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedKeys"
        :props="defaultProps" />
      <template #footer>
        <el-button type="primary" @click="doAssign">确定</el-button>
        <el-button @click="drawer = false">取消</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import {
  getAllRolesAPI,
  addOrUpdateRoleAPI,
  getAllPermissionAPI,
  assignPermissionAPI,
  deleteRoleAPI
} from '@/api/acl';
const rolename = ref('');
const roleList = ref([]);
const drawer = ref(false);
const drawerLoading = ref(false);
//关闭抽屉时清空数据
const cancel = () => {
  console.log('抽屉关闭');
  drawer.value = false;
  checkedKeys.value = [];
  treeInstance.value.setCheckedKeys([]);
  roleForm.value = {
    roleName: ''
  };
};
const dialogShow = ref(false);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const dialogTitle = ref('');
const roleForm = ref({
  roleName: ''
});
const formInstance = ref();
const treeInstance = ref();
const rules = {
  roleName: [
    {
      required: true,
      message: '请输入角色名称',
      trigger: 'blur'
    },
    {
      trigger: 'blur',
      validator: (rule: any, value: any, callback: any) => {
        if (value.trim().length >= 2) {
          callback();
        } else {
          callback(new Error('角色名称不能小于2个字符'));
        }
      }
    }
  ]
};
// 树形结构配置数据
const defaultProps = {
  children: 'children', //子节点字段
  label: 'name' //展示数据用哪个字段
};
const data = ref([]);
const checkedKeys = ref([]);
const addRole = () => {
  dialogTitle.value = '添加角色';
  dialogShow.value = true;
};
const editRole = (row: any) => {
  dialogTitle.value = '编辑角色';
  roleForm.value.roleName = row.roleName;
  roleForm.value.id = row.id;
  dialogShow.value = true;
};
const dialogClose = () => {
  roleForm.value = {
    roleName: ''
  };
  formInstance.value?.resetFields();
  // dialogShow.value = false;
};
const getAllRoles = async () => {
  loading.value = true;
  try {
    const res = await getAllRolesAPI(currentPage.value, pageSize.value, rolename.value);
    console.log(res);
    if (res.code == 200) {
      roleList.value = res.data.records;
      total.value = res.data.total;
      loading.value = false;
    } else {
      ElMessage({
        type: 'error',
        message: '获取角色列表失败'
      });
    }
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '获取角色列表失败'
    });
  } finally {
    loading.value = false;
  }
};
const searchRole = () => {
  currentPage.value = 1;
  getAllRoles();
};
const reset = () => {
  rolename.value = '';
  currentPage.value = 1;
  getAllRoles();
};
const submit = async () => {
  await formInstance.value?.validate(async (valid: any) => {
    if (valid) {
      try {
        const res = await addOrUpdateRoleAPI(roleForm.value);
        if (res.code == 200) {
          ElMessage({
            type: 'success',
            message: roleForm.value.id ? '编辑角色成功' : '添加角色成功'
          });
          dialogShow.value = false;
          getAllRoles();
        } else {
          ElMessage({
            type: 'error',
            message: roleForm.value.id ? '编辑角色失败' : '添加角色失败'
          });
        }
      } catch (error) {
        ElMessage({
          type: 'error',
          message: roleForm.value.id ? '编辑角色失败' : '添加角色失败'
        });
      }
    }
  });
};
//递归遍历树形结构，获取选中的节点的id
const getCheckedNodes = (tree: any) => {
  tree.forEach((node: any) => {
    if (node.children && node.children.length > 0) {
      getCheckedNodes(node.children);
    } else {
      if (node.select) {
        checkedKeys.value.push(node.id);
      }
    }
  });
};
//打开分配权限抽屉
const assignPermission = async (row: any) => {
  drawer.value = true;
  roleForm.value.id = row.id;
  try {
    drawerLoading.value = true;
    const res = await getAllPermissionAPI(row.id);
    if (res.code == 200) {
      console.log(res);
      data.value = res.data;
      getCheckedNodes(data.value);
      console.log('递归完成', checkedKeys.value);
      drawerLoading.value = false;
    }
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '获取权限列表失败'
    });
  } finally {
    drawerLoading.value = false;
  }
};
//分配权限提交
const doAssign = async () => {
  const checkedArray1 = treeInstance.value?.getCheckedKeys();
  const checkedArray2 = treeInstance.value?.getHalfCheckedKeys();
  const checkedArray = checkedArray1.concat(checkedArray2);
  console.log('已选中的权限', checkedArray);
  try {
    const res = await assignPermissionAPI(roleForm.value.id, checkedArray);
    if (res.code == 200) {
      ElMessage({
        type: 'success',
        message: '分配权限成功'
      });
      drawer.value = false;
      window.location.reload();
    }
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '分配权限失败'
    });
  }
};
//删除角色
const deleteUser = async (row: any) => {
  try {
    const res = await deleteRoleAPI(row.id);
    if (res.code == 200) {
      ElMessage({
        type: 'success',
        message: '删除角色成功'
      });
      getAllRoles();
    }
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '删除角色失败'
    });
  }
};
onMounted(async () => {
  await getAllRoles();
});
</script>

<style scoped lang="scss">
.userContainer {
  width: 100%;
  height: 100%;
  .top {
    height: 10%;
    :deep(.el-card__body) {
      width: 100%;
      height: 100%;
      padding: 0 0;
    }
    :deep(.el-form) {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .el-form-item {
        margin: 0px 0px;
        &:nth-child(2) {
          margin-right: 30px;
        }
      }
    }
  }
  .bottom {
    min-height: 90%;
    .el-table {
      margin-top: 10px;
    }
  }
}
:deep(.el-pagination) {
  width: 95%;
  margin-top: 10px;
}
</style>
