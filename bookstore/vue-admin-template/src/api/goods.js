import request from '@/utils/request'

export function getList(params) {

  return request({
    url: 'http://w3n1043453.zicp.vip/goods/listGoods',
    method: 'post',
    data:params
  })
}
// 创建商品
export function createGood(params) {
  var _params = {
    ...params,
    loginAccount:JSON.parse(sessionStorage.getItem('loginAccount'))
  }
  // console.log(_params);

  return request({
    url: 'http://w3n1043453.zicp.vip/goods/addGoods',
    method: 'post',
    data:_params
  })
}
// 详情
export function getGoodsDetail(params) {
  // console.log(params);
  // debugger
  return request({
    url: 'http://w3n1043453.zicp.vip/goods/findGoodsBySkuCode',
    method: 'get',
    params
  })
}
// 更新商品
export function updateGood(params) {
  var _params = {
    ...params,
    loginAccount:JSON.parse(sessionStorage.getItem('loginAccount'))
  }
  return request({
    url: 'http://w3n1043453.zicp.vip/goods/updateGoodsInfo',
    method: 'post',
    data:_params
  })
}
// 上架和下架
export function updateGoodsStatus(params) {
  return request({
    url: 'http://w3n1043453.zicp.vip/goods/updateGoodsStatus',
    method: 'get',
    params
  })
}
// 删除商品
export function deleteGood(params) {
  return request({
    url: 'http://w3n1043453.zicp.vip/goods/deleteGoods',
    method: 'get',
    params
  })
}
// 上传图片
export function uploadImage(params) {

  return request({
    url: 'http://w3n1043453.zicp.vip/goods/uploadImage',
    method: 'post',
    data:params
  })
}
// 商家信息
export function getBusiness(params) {
  return request({
    url: 'http://w3n1043453.zicp.vip/goods/listBusiness',
    method: 'get',
    params
  })
}
