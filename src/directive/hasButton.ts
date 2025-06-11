//判断是否有按钮权限
import { createPinia } from 'pinia';
import useUserStore from '@/store/user';
const pinia = createPinia();
let userStore = useUserStore(pinia);
export const hasButton = (app) => {
  app.directive('has', {
    mounted(el: any, binding: any) {
      //el:指令绑定的那个元素
      //binding:指令等于号后面绑定的表达式的值
      // let userStore = useUserStore();
      if (!userStore.buttonList.includes(binding.value)) {
        el.parentNode?.removeChild(el); //如果没有权限就删除该元素
      }
    }
  });
};
