//用户相关请求接口api
import request from '@/utils/request';
enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout'
}

export const reqUserLogin = (data: any) => {
  return request.post<any, any>(API.LOGIN_URL, data);
};

export const reqUserInfo = () => {
  return request.get<any, any>(API.USERINFO_URL);
};

export const reqLogout = () => {
  return request.post<any, any>(API.LOGOUT_URL);
};
