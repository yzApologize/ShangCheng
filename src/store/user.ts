//用户数据仓库
import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { LoginForm } from '@/api/user/type';
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes';
import { useRouter } from 'vue-router';
import { reqUserLogin, reqUserInfo, reqLogout } from '@/api/user';
import cloneDeep from 'lodash/cloneDeep';
//定义一个函数，用来过滤当前用户需要展示的异步路由
const filterAsyncRoute = (asyncRoute: any, routes: any) => {
  return asyncRoute.filter((item: any) => {
    if (item.children && item.children.length > 0) {
      item.children = filterAsyncRoute(item.children, routes);
    }
    return routes.includes(item.name);
  });
};
// console.log('引入函数', cloneDeep);
let useUserStore = defineStore(
  'User',
  () => {
    const router = useRouter();
    const userInfo = reactive({
      token: '',
      name: '',
      avatar: ''
    });
    const buttonList = ref([]);
    const menuRoutes = ref(constantRoute);
    const userAsyncRouteFlag = ref(false);
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
        buttonList.value = result.data.buttons;
        //计算当前用户需要展示的异步路由
        const userRoutes = filterAsyncRoute(cloneDeep(asyncRoute), result.data.routes);
        menuRoutes.value = [...constantRoute, ...userRoutes, ...anyRoute];
        //但是要把所有的异步路由全部添加到路由表中，否则会出现404
        [...userRoutes, ...anyRoute].forEach((item: any) => {
          router.addRoute(item);
        });
        userAsyncRouteFlag.value = true;
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
      menuRoutes,
      buttonList,
      userAsyncRouteFlag
    };
  },
  {
    persist: {
      // 指定使用 sessionStorage 存储
      storage: sessionStorage,
      // 只持久化 count 状态
      pick: ['userInfo']
    }
  }
);

export default useUserStore;
