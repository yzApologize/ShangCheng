import { createApp } from 'vue';
import App from '@/App.vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import 'virtual:svg-icons-register'; //导入svg需要的配置代码
import SvgIcon from './components/SvgIcon.vue';
import '@/styles/index.scss';
import router from './router';
import '@/permission'; //路由鉴权
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'; //引入element-plus所有图标
import 'element-plus/theme-chalk/dark/css-vars.css'; //暗黑模式
// import useUserStore from './store/user';
import { hasButton } from './directive/hasButton';
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
let pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
// console.log(import.meta.env);
//自定义指令,判断按钮是否有权限
// app.directive('has', {
//   mounted(el, binding) {
//     //el:指令绑定的那个元素
//     //binding:指令等于号后面绑定的表达式的值
//     if (!userStore.buttonList.includes(binding.value)) {
//       el.parentNode?.removeChild(el); //如果没有权限就删除该元素
//     }
//   }
// });
hasButton(app);
app
  .use(ElementPlus, {
    //转换成中文
    locale: zhCn
  })
  .component('SvgIcon', SvgIcon) //注册成为全局组件
  .use(router)
  .use(pinia)
  // .directive('has', {
  //   mounted(el, binding) {
  //     //el:指令绑定的那个元素
  //     //binding:指令等于号后面绑定的表达式的值
  //     let userStore = useUserStore();
  //     if (!userStore.buttonList.includes(binding.value)) {
  //       el.parentNode?.removeChild(el); //如果没有权限就删除该元素
  //     }
  //   }
  // })
  .mount('#app');
