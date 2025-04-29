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
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
let pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
// console.log(import.meta.env);
app
  .use(ElementPlus, {
    //转换成中文
    locale: zhCn
  })
  .component('SvgIcon', SvgIcon) //注册成为全局组件
  .use(router)
  .use(pinia)
  .mount('#app');
