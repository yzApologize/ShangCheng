<template>
  <div class="userContainer">
    <el-card class="top">
      <el-form label-width="100px" :inline="true">
        <el-form-item label="角色名称">
          <el-input v-model="username" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchUser" :disabled="username == ''">查询</el-button>
          <el-button type="primary" @click="resetUser">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="bottom">
      <div style="display: flex">
        <el-button icon="Plus" type="primary" @click="addRole">添加角色</el-button>
        <el-button icon="Delete" type="danger" @click="deleteAllUser">批量删除</el-button>
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
    <!-- 添加角色对话框 -->
    <el-dialog v-model="dialogShow" title="添加角色" width="500"></el-dialog>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
// const showUserList = ref([]);
const dialogShow = ref(false);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const addRole = () => {
  dialogShow.value = true;
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
