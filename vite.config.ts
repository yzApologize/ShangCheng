import { defineConfig, loadEnv } from 'vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'; //引入svg需要用到的插件
import vue from '@vitejs/plugin-vue';
import path from 'path';
// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  let env = loadEnv(mode, process.cwd());
  return {
    // 配置代理跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          //获取数据的服务器地址设置
          target: env.VITE_SERVE,
          //需要代理跨域
          changeOrigin: true,
          //路径重写
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    plugins: [
      vue(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]'
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve('./src') // 相对路径别名配置，使用 @ 代替 src
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";'
        }
      }
    }
  };
});

//   {
//   // 配置代理跨域
//   server: {
//     proxy: {
//       //loadEnv('', process.cwd()) 表示从当前工作目录加载环境变量，获取数据的服务器地址设置，使用方括号 [] 是 JavaScript 的计算属性名语法，意味着这个键的值是动态计算出来的。
//       [loadEnv('', process.cwd()).VITE_APP_BASE_API]: {
//         //获取数据的服务器地址设置
//         target: loadEnv('', process.cwd()).VITE_SERVE,
//         //需要代理跨域
//         changeOrigin: true,
//         //rewrite 是一个函数，用于对请求的路径进行重写，它接受请求的路径 path 作为参数，并使用正则表达式 /^\/api/ 匹配路径开头的 /api，然后将其替换为空字符串。
//         rewrite: (path) => path.replace(/^\/api/, '')
//       }
//     }
//   },
//   plugins: [
//     vue(),
//     createSvgIconsPlugin({
//       iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
//       symbolId: 'icon-[dir]-[name]'
//     })
//   ],
//   resolve: {
//     alias: {
//       '@': path.resolve('./src') // 相对路径别名配置，使用 @ 代替 src
//     }
//   },
//   css: {
//     preprocessorOptions: {
//       scss: {
//         javascriptEnabled: true,
//         additionalData: '@import "./src/styles/variable.scss";'
//       }
//     }
//   }
// });
