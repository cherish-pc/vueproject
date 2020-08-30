import request from '@/utils/request'
// 模块项目
export function getList(params) {
  // console.log(params);
  return request({
    url: 'http://w3n1043453.zicp.vip/order/listOrders',
    method: 'post',
    data:params
  })
}
// 详情
export function getOrderDetail(params) {
  return request({
    url:'http://w3n1043453.zicp.vip/order/listOrderDetails',
    method: 'get',
    params
  })
}
