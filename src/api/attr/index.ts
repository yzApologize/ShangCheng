//属性管理接口
import request from '@/utils/request';
enum API {
  C1_URL = '/admin/product/getCategory1',
  C2_URL = '/admin/product/getCategory2/',
  C3_URL = '/admin/product/getCategory3/',
  GETATTR_URL = '/admin/product/attrInfoList/',
  ADDORUPDATEATTR_URL = '/admin/product/saveAttrInfo',
  DELETEATTR_URL = '/admin/product/deleteAttr/'
}

export const getC1API = async () => {
  return await request.get(API.C1_URL);
};

export const getC2API = async (c1Id: number | string) => {
  return await request.get(API.C2_URL + `${c1Id}`);
};
export const getC3API = async (c2Id: number | string) => {
  return await request.get(API.C3_URL + `${c2Id}`);
};
export const getAttrListAPI = async (
  c1Id: number | string,
  c2Id: number | string,
  c3Id: number | string
) => {
  return await request.get(API.GETATTR_URL + `${c1Id}/${c2Id}/${c3Id}`);
};
export const addOrUpdateAttrAPI = async (data: any) => {
  return await request.post(API.ADDORUPDATEATTR_URL, data);
};
export const deleteAttrAPI = async (attrId: number | string) => {
  return await request.delete(API.DELETEATTR_URL + `${attrId}`);
};
