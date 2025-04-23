import request from '@/utils/request';
enum API {
  //获取管理用户分页列表
  ALLUSER_URL = '/admin/acl/user/',
  ADDUSER_URL = '/admin/acl/user/save',
  UPDATEUSER_URL = '/admin/acl/user/update',
  //获取职位信息
  ALLROLE_URL = '/admin/acl/user/toAssign/',
  //给用户分配职位
  ASSIGNROLE_URL = '/admin/acl/user/doAssignRole',
  //删除单个用户
  DELETEUSER_URL = '/admin/acl/user/remove/',
  //批量删除
  DELETEALLUSER_URL = '/admin/acl/user/batchRemove'
}
export const getAllUserAPI = (page: number, limit: number, username: string) => {
  return request.get<any, any>(API.ALLUSER_URL + `${page}/${limit}/?username=${username}`);
};

export const addOrUpdateUserAPI = (data: any) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data);
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data);
  }
};

export const getAllRoleAPI = (userId: number | string) => {
  return request.get<any, any>(API.ALLROLE_URL + userId);
};

export const assignRoleAPI = (data: any) => {
  return request.post<any, any>(API.ASSIGNROLE_URL, data);
};

export const deleteUserAPI = (id: number | string) => {
  return request.delete<any, any>(API.DELETEUSER_URL + id);
};

export const deleteAllUserAPI = (ids: number[] | string[]) => {
  return request.delete<any, any>(API.DELETEALLUSER_URL, { data: ids });
};
