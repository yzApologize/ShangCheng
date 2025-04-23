//属性管理接口
import request from '@/utils/request';
enum API {
  //获取产品列表
  GETPRODUCTLIST_URL = '/admin/product/list',
  //下架商品
  CANCELSALE_URL = '/admin/product/cancelSale/',
  //上架商品
  ONSALE_URL = '/admin/product/onSale/',
  //获取商品信息
  GETSKUINFO_URL = '/admin/product/getSkuInfo/',
  //删除商品
  DELETESKU_URL = '/admin/product/deleteSku/'
}
export const getProductListAPI = (page: number, limit: number) => {
  return request.get<any, any>(API.GETPRODUCTLIST_URL + `/${page}/${limit}`);
};
//下架商品
export const cancelSaleAPI = (id: number) => {
  return request.get<any, any>(API.CANCELSALE_URL + `${id}`);
};
//上架商品
export const onSaleAPI = (id: number) => {
  return request.get<any, any>(API.ONSALE_URL + `${id}`);
};
//获取商品信息
export const getSkuInfoAPI = (id: number) => {
  return request.get<any, any>(API.GETSKUINFO_URL + `${id}`);
};
//删除商品
export const deleteSkuAPI = (id: number) => {
  return request.delete<any, any>(API.DELETESKU_URL + `${id}`);
};
