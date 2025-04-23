//用户数据仓库
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { LoginForm } from '@/api/user/type';
import { constantRoute } from '@/router/routes';
import { reqUserLogin, reqUserInfo, reqLogout } from '@/api/user';
let useUserStore = defineStore(
  'User',
  () => {
    const userInfo = reactive({
      token: '',
      name: '',
      avatar: ''
    });
    const menuRoutes = ref(constantRoute);
    const userLogin = async (loginForm: LoginForm) => {
      //用户登录
      let result = await reqUserLogin(loginForm);
      console.log('用户登录结果', result);
      if (result.code == 200) {
        userInfo.token = result.data as string;
        return 'ok';
      } else {
        return Promise.reject(new Error(result.message));
      }
    };
    const userInfoFun = async () => {
      //获取用户信息
      let result = await reqUserInfo();
      console.log('用户信息', result);
      if (result.code == 200) {
        userInfo.name = result.data.name;
        userInfo.avatar = result.data.avatar;
        return 'ok';
      } else {
        return Promise.reject(new Error('获取用户信息失败'));
      }
    };
    const userLogout = async () => {
      //用户退出
      for (const key in userInfo) {
        if (userInfo.hasOwnProperty(key)) {
          const value = userInfo[key];
          if (Array.isArray(value)) {
            // 如果是数组，清空数组
            userInfo[key] = [];
          } else if (typeof value === 'object' && value !== null) {
            // 如果是对象，递归清空
            userLogout(value);
          } else {
            // 其他类型，置为空字符串
            userInfo[key] = '';
          }
        }
      }
      let result = await reqLogout();
      if (result.code == 200) {
        return 'ok';
      } else {
        return Promise.reject('退出失败');
      }
    };
    return {
      userLogin,
      userInfoFun,
      userLogout,
      userInfo,
      menuRoutes
    };
  },
  {
    persist: {
      // 指定使用 sessionStorage 存储
      storage: sessionStorage,
      // 只持久化 count 状态
      paths: ['userInfo']
    }
  }
);

export default useUserStore;
