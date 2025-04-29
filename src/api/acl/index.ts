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
  DELETEALLUSER_URL = '/admin/acl/user/batchRemove',
  //获取角色列表
  ALLROLES_URL = '/admin/acl/role/',
  //添加新的角色
  ADDROLE_URL = '/admin/acl/role/save',
  //更新角色
  UPDATEROLE_URL = '/admin/acl/role/update',
  //获取角色全部菜单
  ALLPERMISSION_URL = '/admin/acl/permission/toAssign/',
  //给角色分配权限
  ASSIGNPERMISSION_URL = '/admin/acl/permission/doAssign?',
  //删除角色
  DELETEROLE_URL = '/admin/acl/role/remove/',
  //获取全部菜单
  ALLMENU_URL = '/admin/acl/permission/',
  //新增菜单
  ADDMENU_URL = '/admin/acl/permission/save',
  //更新菜单
  UPDATEMENU_URL = '/admin/acl/permission/update',
  //删除菜单
  DELETEMENU_URL = '/admin/acl/permission/remove/'
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

export const getAllRolesAPI = (page: number, limit: number, roleName: string) => {
  return request.get<any, any>(API.ALLROLES_URL + `${page}/${limit}/?roleName=${roleName}`);
};

// export const addOrUpdateRoleAPI = (data: any) => {
//   if (data.id) {
//     return request.put<any, any>(API.UPDATEROLE_URL, data);
//   }else{
//     return request.post<any, any>(API.ADDROLE_URL, data);
//   }
// }
export const addOrUpdateRoleAPI = (data: any) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data);
  } else {
    return request({
      method: 'post',
      url: API.ADDROLE_URL,
      data: data
    });
  }
};

export const getAllPermissionAPI = (roleId: number | string) => {
  return request.get<any, any>(API.ALLPERMISSION_URL + roleId);
};

export const assignPermissionAPI = (roleId: number | string, permissionIds: number[]) => {
  return request.post<any, any>(
    API.ASSIGNPERMISSION_URL + `roleId=${roleId}&permissionId=${permissionIds}`
  );
};

export const deleteRoleAPI = (id: number | string) => {
  return request.delete<any, any>(API.DELETEROLE_URL + id);
};

export const getAllMenuAPI = () => {
  return request.get<any, any>(API.ALLMENU_URL);
};

export const addOrUpdateMenuAPI = (data: any) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEMENU_URL, data);
  } else {
    return request.post<any, any>(API.ADDMENU_URL, data);
  }
};

export const deleteMenuAPI = (id: number | string) => {
  return request.delete<any, any>(API.DELETEMENU_URL + id);
};
