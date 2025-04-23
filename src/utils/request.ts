//axios二次封装
import axios from 'axios';
import useUserStore from '@/store/user';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, //基础路径会携带/api
  timeout: 5000 //超时时间设置
});
//添加请求拦截器
request.interceptors.request.use((config) => {
  //config是请求拦截器回调注入的配置对象，配置对象身上有个headers属性，可以通过请求头携带公共参数token
  let userStore = useUserStore();
  if (userStore.userInfo.token) {
    config.headers.token = userStore.userInfo.token;
  }
  return config;
});

//设置响应拦截器
request.interceptors.response.use(
  (response) => {
    //响应拦截器成功的回调，一般进行简化数据
    return response.data; //返回数据会成为axios请求返回的数据
  },
  (error) => {
    //处理http网络错误
    const status = error.response.status;
    let msg = '';
    let userStore = useUserStore();
    let router = useRouter();
    switch (status) {
      case 401:
        msg = 'token过期';
        userStore.userLogout();
        router.push('/login');
        break;
      case 403:
        msg = '无权访问';
        break;
      case 404:
        msg = '请求地址错误';
        break;
      case 500:
        msg = '服务器出现问题';
        break;
      default:
        msg = '无网络';
    }
    ElMessage({
      type: 'error',
      message: msg
    });
    return Promise.reject(error);
  }
);
export default request;
