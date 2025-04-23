//产品接口api
import request from '@/utils/request';
enum API {
  //获取所有品牌
  TRADEMARK_URL = '/admin/product/baseTrademark',
  //添加品牌
  ADD_TRADEMARK_URL = '/admin/product/baseTrademark/save',
  //更新品牌
  UPDATE_TRADEMARK_URL = '/admin/product/baseTrademark/update',
  //删除品牌
  DELETE_TRADEMARK_URL = '/admin/product/baseTrademark/remove'
}
//获取商标分页数据
export const getTradeMarkPageAPI = (page: number, size: number) => {
  return request({
    url: `${API.TRADEMARK_URL}/${page}/${size}`,
    method: 'get'
  });
};
//添加或修改品牌
export const addOrUpdateTradeMarkAPI = (data: any) => {
  if (data.id) {
    return request.put(API.UPDATE_TRADEMARK_URL, data);
  } else {
    return request({
      url: API.ADD_TRADEMARK_URL,
      method: 'post',
      data
    });
  }
};
//删除品牌
export const deleteTradeMarkAPI = (id: number) => {
  return request.delete(API.DELETE_TRADEMARK_URL + `/${id}`);
};
