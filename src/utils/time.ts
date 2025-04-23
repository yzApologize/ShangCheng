export const getTime = () => {
  let hour = new Date().getHours();
  if (hour < 6) {
    return '凌晨好';
  } else if (hour < 9) {
    return '早上好';
  } else if (hour < 12) {
    return '上午好';
  } else if (hour < 14) {
    return '中午好';
  } else if (hour < 17) {
    return '下午好';
  } else if (hour < 19) {
    return '傍晚好';
  } else if (hour < 22) {
    return '晚上好';
  } else {
    return '夜里好';
  }
};
