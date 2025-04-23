<template>
  <div class="loginbox">
    <div class="form">
      <div class="title">
        <h1>Hello</h1>
        <p>欢迎登录硅谷甄选</p>
      </div>
      <el-form :model="loginForm" :rules="rules" ref="loginFormInstance" hide-required-asterisk>
        <el-form-item label="账号" prop="username">
          <el-input :prefix-icon="User" v-model="loginForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            :prefix-icon="Lock"
            type="password"
            show-password
            v-model="loginForm.password" />
        </el-form-item>
        <el-form-item>
          <el-button @click="btnReset">重置</el-button>
          <el-button type="primary" @click="btnLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { User, Lock } from '@element-plus/icons-vue';
import useUserStore from '@/store/user';
import { useRouter } from 'vue-router';
import { ElNotification, ElForm, ElMessage } from 'element-plus';
import { getTime } from '@/utils/time';
const router = useRouter();
let userStore = useUserStore(); //引入user数据仓库
const loginFormInstance = ref<InstanceType<typeof ElForm> | null>(null);
const loginForm = reactive({
  username: '',
  password: ''
});
const checkUsername = (rule: any, value: string, callback: any) => {
  //rule是规则对象，value是表单项输入的值，callback是回调函数，如果输入的值符合规则，就调用callback函数直接通过，否则调用callback函数并传入错误信息
  if (!/^[a-z]+$/i.test(value)) {
    callback(new Error('账号只能是字母组成'));
  } else if (value.length < 5 || value.length > 10) {
    callback(new Error('账号长度在 5 到 10 个字符'));
  } else {
    callback();
  }
};
const rules = reactive({
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    // { min: 5, max: 10, message: '账号长度在 5 到 10 个字符', trigger: 'blur' },
    // { pattern: /^[a-z]+$/i, message: '账号只能是字母组成', trigger: 'blur' }
    { validator: checkUsername, trigger: 'blur' }
  ],
  passwsord: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少是6个字符', trigger: 'blur' }
  ]
});

const btnLogin = async () => {
  //点击登录按钮
  if (!(await loginFormInstance.value.validate())) return;
  try {
    await userStore.userLogin(loginForm);
    await userStore.userInfoFun();
    router.push('/');
    ElNotification({
      title: '登录成功',
      message: `${getTime()}!`,
      type: 'success'
    });
  } catch (error: any) {
    ElMessage({
      message: error,
      type: 'error'
    });
  }
};
const btnReset = () => {
  Object.assign(loginForm, {
    username: '',
    password: ''
  });
};
</script>

<style scoped lang="scss">
.loginbox {
  width: 100%;
  height: 100%;
  background-image: url('@/assets/images/login.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  .form {
    margin: auto;
    width: 500px;
    height: 300px;
    background-color: rgba($color: #50c8e0, $alpha: 0.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    :deep(.el-form-item:last-child) {
      .el-form-item__content {
        display: flex;
        justify-content: center;
      }
    }
    :deep(.el-form-item) {
      .el-form-item__label {
        color: white;
      }
    }
    .title {
      width: 100%;
      h1 {
        font-size: 25px;
        font-weight: bolder;
        color: white;
        margin-left: 30px;
      }
      p {
        color: white;
        margin-left: 30px;
        margin-bottom: 30px;
      }
    }
  }
}
</style>
