<template>
  <div class="userContainer">
    <el-card class="top">
      <el-form label-width="100px" :inline="true">
        <el-form-item label="用户名称">
          <el-input v-model="username" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchUser" :disabled="username == ''">查询</el-button>
          <el-button type="primary" @click="resetUser">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="bottom">
      <div style="display: flex">
        <el-button icon="Plus" type="primary" @click="addUser">添加用户</el-button>
        <el-button
          icon="Delete"
          type="danger"
          @click="deleteAllUser"
          :disabled="selectUser.length == 0"
          >批量删除</el-button
        >
      </div>
      <el-table
        :data="userList"
        @selection-change="handleSelect"
        style="width: 100%; height: 100%"
        border
        v-loading="loading">
        <el-table-column type="selection" width="50px" align="center" />
        <el-table-column type="index" width="50px" label="#" align="center"></el-table-column>
        <el-table-column prop="id" label="ID" width="200px" align="center"></el-table-column>
        <el-table-column
          prop="username"
          label="用户名字"
          width="200px"
          align="center"></el-table-column>
        <el-table-column
          prop="name"
          label="用户名称"
          width="200px"
          align="center"></el-table-column>
        <el-table-column
          prop="roleName"
          label="用户角色"
          width="200px"
          show-overflow-tooltip
          align="center"></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="200px"
          align="center"></el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          width="200px"
          align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <div style="width: 100%; height: 100%; display: flex; justify-content: center">
              <el-button size="small" type="primary" icon="User" @click="assignRole(scope.row)"
                >分配权限</el-button
              >
              <el-button
                size="small"
                type="success"
                icon="Edit"
                @click="editUser(scope.row)"></el-button>
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
        @size-change="getUserList"
        @current-change="getUserList"></el-pagination>
    </el-card>
    <!-- 添加，编辑抽屉 -->
    <el-drawer v-model="drawer1" :title="drawerTitle" direction="rtl" @close="cancel">
      <el-form label-width="80px" :model="userForm" :rules="rules" ref="formInstance1">
        <el-form-item label="用户姓名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入用户昵称"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="drawerTitle == '添加用户'">
          <el-input v-model="userForm.password" placeholder="请输入用户密码"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="submit">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </template>
    </el-drawer>
    <!-- 分配角色抽屉 -->
    <el-drawer
      v-model="drawer2"
      title="分配角色"
      direction="rtl"
      v-loading="drawer2Loading"
      @close="cancel2"
      @open="openDrawer2">
      <el-form label-width="80px" :model="userForm" ref="formInstance2">
        <el-form-item label="用户姓名" prop="username">
          <el-input
            placeholder="请输入用户姓名"
            v-model="userForm.username"
            :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange">
            全选
          </el-checkbox>
          <el-checkbox-group v-model="checkedroles" @change="handleCheckedRolesChange">
            <el-checkbox v-for="(item, index) in roles" :key="index" :label="item">
              {{ item.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="assignRoleConfirm">确定</el-button>
        <el-button @click="cancel">取消</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import {
  getAllUserAPI,
  addOrUpdateUserAPI,
  assignRoleAPI,
  getAllRoleAPI,
  deleteUserAPI,
  deleteAllUserAPI
} from '@/api/acl';
const username = ref('');
const userList = ref([]);
const selectUser = ref([]);
// const showUserList = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const drawer1 = ref(false);
const drawerTitle = ref('');
const drawer2Loading = ref(false);
const userForm = ref({
  name: '',
  username: '',
  password: ''
});
const formInstance1 = ref(null);
const rules = ref({
  name: [
    { required: true, message: '请输入用户昵称', trigger: 'blur' },
    { min: 5, message: '长度应大于5个字符', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入用户姓名', trigger: 'blur' },
    { min: 5, message: '长度应大于5个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入用户密码', trigger: 'blur' },
    { min: 6, message: '长度应大于6个字符', trigger: 'blur' }
  ]
});
const drawer2 = ref(false);
const checkAll = ref(false);
const isIndeterminate = ref(false);
const checkedroles = ref([]);
const roles = ref([]);
const formInstance2 = ref(null);
const cancel2 = () => {
  console.log('关闭并清空');
  userForm.value = {
    name: '',
    username: '',
    password: ''
  };
  checkedroles.value = [];
  drawer2.value = false;
};
const assignRole = (row: any) => {
  userForm.value.username = row.username;
  userForm.value.id = row.id;
  drawer2.value = true;
};
const handleCheckAllChange = (val) => {
  console.log(val);
  checkedroles.value = val ? roles.value : [];
  isIndeterminate.value = false;
};
const handleCheckedRolesChange = (val) => {
  console.log(val);
  let checkedCount = val.length;
  checkAll.value = checkedCount === roles.value.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < roles.value.length;
};
const openDrawer2 = async () => {
  try {
    drawer2Loading.value = true;
    const res = await getAllRoleAPI(userForm.value.id || 0);
    console.log(res);
    if (res.code === 200) {
      roles.value = res.data.allRolesList;
      checkedroles.value = res.data.assignRoles;
      drawer2Loading.value = false;
    }
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '获取角色信息失败'
    });
  } finally {
    drawer2Loading.value = false;
  }
};
const assignRoleConfirm = async () => {
  console.log('已选择职位', checkedroles.value);
  try {
    drawer2Loading.value = true;
    const res = await assignRoleAPI({
      roleIdList: checkedroles.value.map((item) => {
        return item.id || 0;
      }),
      userId: userForm.value.id || 0
    });
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '分配角色成功'
      });
      drawer2Loading.value = false;
      drawer2.value = false;
      getUserList();
    } else {
      ElMessage({
        type: 'error',
        message: '分配角色失败'
      });
    }
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '分配角色失败'
    });
  } finally {
    drawer2Loading.value = false;
  }
};
const getUserList = async () => {
  try {
    loading.value = true;
    const res = await getAllUserAPI(currentPage.value, pageSize.value, username.value);
    console.log(res);
    if (res.code === 200) {
      userList.value = res.data.records;
      total.value = res.data.total;
      userList.value = userList.value;
    }
    loading.value = false;
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '获取用户列表失败'
    });
  } finally {
    loading.value = false;
  }
};
const searchUser = () => {
  currentPage.value = 1;
  getUserList();
};
const resetUser = () => {
  username.value = '';
  currentPage.value = 1;
  getUserList();
};
const addUser = () => {
  drawerTitle.value = '添加用户';
  drawer1.value = true;
};
const editUser = (row: any) => {
  drawerTitle.value = '编辑用户';
  drawer1.value = true;
  userForm.value.id = row.id;
  userForm.value.name = row.name;
  userForm.value.username = row.username;
};
const deleteUser = async (row: any) => {
  try {
    const res = await deleteUserAPI(row.id);
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '删除成功'
      });
      getUserList();
    } else {
      ElMessage({
        type: 'error',
        message: '删除失败'
      });
    }
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '删除失败'
    });
  }
};
const handleSelect = (selection) => {
  console.log(selection);
  selectUser.value = selection;
};
const deleteAllUser = async () => {
  try {
    const res = await deleteAllUserAPI(selectUser.value.map((item) => item.id));
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: '批量删除成功'
      });
      selectUser.value = [];
      getUserList();
    } else {
      ElMessage({
        type: 'error',
        message: '批量删除失败'
      });
    }
  } catch (error) {
    ElMessage({
      type: 'error',
      message: '批量删除失败'
    });
  }
};
const cancel = () => {
  console.log('关闭并清空');
  drawerTitle.value = '';
  userForm.value = {
    name: '',
    username: '',
    password: ''
  };
  formInstance1.value.resetFields();
  drawer1.value = false;
};

const addOrUpdateUser = async (data) => {
  try {
    const res = await addOrUpdateUserAPI(data);
    if (res.code === 200) {
      ElMessage({
        type: 'success',
        message: data.id ? '编辑成功' : '添加成功'
      });
      // cancel();
      // getUserList();
      window.location.reload();
    } else {
      ElMessage({
        type: 'error',
        message: data.id ? '编辑失败' : '添加失败'
      });
    }
  } catch (error) {
    ElMessage({
      type: 'error',
      message: data.id ? '编辑失败' : '添加失败'
    });
  }
};

const submit = async () => {
  if (!formInstance1.value) {
    return;
  }
  formInstance1.value.validate(async (valid) => {
    if (valid) {
      await addOrUpdateUser(userForm.value);
    } else {
      console.log('error submit!');
    }
  });
};
onMounted(async () => {
  await getUserList();
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
