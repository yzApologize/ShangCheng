//对外暴露常量路由
export const constantRoute = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login',
    meta: {
      title: '登录',
      hidden: true,
      icon: ''
    }
  },
  {
    path: '/',
    component: () => import('@/views/layout/index.vue'),
    name: 'Layout',
    meta: {
      title: 'layout',
      hidden: false,
      icon: ''
    },
    redirect: '/home',
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        name: 'Home',
        meta: {
          title: '首页',
          hidden: false,
          icon: 'HomeFilled'
        }
      }
    ]
  },
  {
    path: '/screen',
    component: () => import('@/views/screen/index.vue'),
    name: 'Screen',
    meta: {
      title: '数据大屏',
      hidden: false,
      icon: 'DataLine'
    }
  },
  // {
  //   path: '/acl',
  //   component: () => import('@/views/layout/index.vue'),
  //   name: 'Acl',
  //   meta: {
  //     title: '权限管理',
  //     hidden: false,
  //     icon: 'Lock'
  //   },
  //   redirect: '/acl/user',
  //   children: [
  //     {
  //       path: '/acl/user',
  //       component: () => import('@/views/acl/User.vue'),
  //       name: 'User',
  //       meta: {
  //         title: '用户管理',
  //         hidden: false,
  //         icon: 'User'
  //       }
  //     },
  //     {
  //       path: '/acl/role',
  //       component: () => import('@/views/acl/Role.vue'),
  //       name: 'Role',
  //       meta: {
  //         title: '角色管理',
  //         hidden: false,
  //         icon: 'UserFilled'
  //       }
  //     },
  //     {
  //       path: '/acl/permission',
  //       component: () => import('@/views/acl/Permission.vue'),
  //       name: 'Permission',
  //       meta: {
  //         title: '菜单管理',
  //         hidden: false,
  //         icon: 'Menu'
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/product',
  //   component: () => import('@/views/layout/index.vue'),
  //   name: 'product',
  //   meta: {
  //     title: '商品管理',
  //     hidden: false,
  //     icon: 'Goods'
  //   },
  //   redirect: '/product/trademark',
  //   children: [
  //     {
  //       path: '/product/trademark',
  //       component: () => import('@/views/product/TradeMark.vue'),
  //       name: 'trademark',
  //       meta: {
  //         title: '品牌管理',
  //         hidden: false,
  //         icon: 'ShoppingCartFull'
  //       }
  //     },
  //     {
  //       path: '/product/attribute',
  //       component: () => import('@/views/product/Attribute.vue'),
  //       name: 'attribute',
  //       meta: {
  //         title: '属性管理',
  //         hidden: false,
  //         icon: 'Stamp'
  //       }
  //     },
  //     {
  //       path: '/product/sku',
  //       component: () => import('@/views/product/SKU.vue'),
  //       name: 'SKU',
  //       meta: {
  //         title: 'SKU管理',
  //         hidden: false,
  //         icon: 'Calendar'
  //       }
  //     },
  //     {
  //       path: '/product/spu',
  //       component: () => import('@/views/product/SPU.vue'),
  //       name: 'SPU',
  //       meta: {
  //         title: 'SPU管理',
  //         hidden: false,
  //         icon: 'Brush'
  //       }
  //     }
  //   ]
  // },
  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404',
    meta: {
      title: '404',
      hidden: true,
      icon: ''
    }
  }
  // {
  //   path: '/:pathMatch(.*)*', //如果都没匹配上，重定向到404页面
  //   redirect: '/404',
  //   name: 'any',
  //   meta: {
  //     title: '任意路由',
  //     hidden: true,
  //     icon: ''
  //   }
  // }
];

//对外暴露异步路由
export const asyncRoute = [
  {
    path: '/acl',
    component: () => import('@/views/layout/index.vue'),
    name: 'Acl',
    meta: {
      title: '权限管理',
      hidden: false,
      icon: 'Lock'
    },
    redirect: '/acl/user',
    children: [
      {
        path: '/acl/user',
        component: () => import('@/views/acl/User.vue'),
        name: 'User',
        meta: {
          title: '用户管理',
          hidden: false,
          icon: 'User'
        }
      },
      {
        path: '/acl/role',
        component: () => import('@/views/acl/Role.vue'),
        name: 'Role',
        meta: {
          title: '角色管理',
          hidden: false,
          icon: 'UserFilled'
        }
      },
      {
        path: '/acl/permission',
        component: () => import('@/views/acl/Permission.vue'),
        name: 'Permission',
        meta: {
          title: '菜单管理',
          hidden: false,
          icon: 'Menu'
        }
      }
    ]
  },
  {
    path: '/product',
    component: () => import('@/views/layout/index.vue'),
    name: 'Product',
    meta: {
      title: '商品管理',
      hidden: false,
      icon: 'Goods'
    },
    redirect: '/product/trademark',
    children: [
      {
        path: '/product/trademark',
        component: () => import('@/views/product/TradeMark.vue'),
        name: 'Trademark',
        meta: {
          title: '品牌管理',
          hidden: false,
          icon: 'ShoppingCartFull'
        }
      },
      {
        path: '/product/attribute',
        component: () => import('@/views/product/Attribute.vue'),
        name: 'Attribute',
        meta: {
          title: '属性管理',
          hidden: false,
          icon: 'Stamp'
        }
      },
      {
        path: '/product/sku',
        component: () => import('@/views/product/SKU.vue'),
        name: 'Sku',
        meta: {
          title: 'SKU管理',
          hidden: false,
          icon: 'Calendar'
        }
      },
      {
        path: '/product/spu',
        component: () => import('@/views/product/SPU.vue'),
        name: 'Spu',
        meta: {
          title: 'SPU管理',
          hidden: false,
          icon: 'Brush'
        }
      }
    ]
  }
];

//对外暴露任意路由
export const anyRoute = [
  {
    path: '/:pathMatch(.*)*', //如果都没匹配上，重定向到404页面
    redirect: '/404',
    name: 'any',
    meta: {
      title: '任意路由',
      hidden: true,
      icon: ''
    }
  }
];
