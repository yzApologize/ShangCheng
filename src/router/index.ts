import { createRouter, createWebHashHistory } from 'vue-router';
import { constantRoute } from './routes';
let router = createRouter({
  history: createWebHashHistory(), //路由模式设置为哈希
  routes: constantRoute,
  scrollBehavior() {
    //滚动行为
    return {
      left: 0,
      top: 0
    };
  }
});
export default router;
