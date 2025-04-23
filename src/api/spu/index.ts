//属性管理接口
import request from '@/utils/request';
enum API {
  GETSPU_URL = '/admin/product/',
  GETALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  IMAGE_URL = '/admin/product/spuImageList/',
  SPUSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  DELETE_URL = '/admin/product/deleteSpu/',
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  SKUINFO_URL = '/admin/product/findBySPuId/',
  DELETESPU_URL = '/admin/product/deleteSpu/'
}
//获取SPU列表接口
export const getSPUAPI = (page: number, limit: number, category3Id: number | string) => {
  return request.get<any, any>(API.GETSPU_URL + `${page}/${limit}?category3Id=${category3Id}`);
};

//获取全部的品牌
export const getAllTrademarkAPI = () => {
  return request.get<any, any>(API.GETALLTRADEMARK_URL);
};

//获取SPU的图片
export const getSpuImageListAPI = (spuId: number) => {
  return request.get<any, any>(API.IMAGE_URL + spuId);
};

//获取SPU的销售属性
export const getSpuSaleAttrListAPI = (spuId: number) => {
  return request.get<any, any>(API.SPUSALEATTR_URL + `${spuId}`);
};
//获取项目全部的销售属性
export const getSaleAttrListAPI = () => {
  return request.get<any, any>(API.ALLSALEATTR_URL);
};
//增新或者修改SPU
export const addOrUpdateSpuAPI = (data: any) => {
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data);
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data);
  }
};
//为SPU添加一个SKU
export const addSkuAPI = (data: any) => {
  return request.post<any, any>(API.ADDSKU_URL, data);
};

//获取SKU列表
export const getSkuListAPI = (spuId: number) => {
  return request.get<any, any>(API.SKUINFO_URL + spuId);
};

//删除SPU
export const deleteSpuAPI = (spuId: number) => {
  return request.delete<any, any>(API.DELETE_URL + spuId);
};
