//路由鉴权
import router from './router';
import useUserStore from './store/user';
import nprogress from 'nprogress';
import 'nprogress/nprogress.css';
//进度条配置
nprogress.configure({ showSpinner: false });
//全局守卫，每次路由切换之前都会触发
//全局前置守卫
router.beforeEach((to, from, next) => {
  //to:要访问的路由
  //from:从哪个路由跳转来的
  //next:函数，next()放行，next(path)放行到指定路由
  //进度条开始
  let userStore = useUserStore();
  console.log('当前用户token为:', userStore.userInfo.token);
  nprogress.start();
  // 判断是否登录
  if (userStore.userInfo.token) {
    console.log('已登录,允许访问');
    if (to.path === '/login') {
      next({ path: '/' });
    } else {
      next();
    }
  } else {
    console.log('未登录,不允许访问');
    to.path === '/login' ? next() : next({ path: '/login' });
  }
  // next();
});
//全局后置守卫
router.afterEach((to, from) => {
  //to:要访问的路由
  //from:从哪个路由跳转来的

  //进度条结束
  nprogress.done();
});
