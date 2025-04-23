//用户数据仓库
import { defineStore } from 'pinia';
import { ref } from 'vue';
let useLayoutSettingStore = defineStore('LayoutSetting', () => {
  const isfold = ref(false);

  return {
    isfold
  };
});

export default useLayoutSettingStore;
