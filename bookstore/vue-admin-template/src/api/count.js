import request from '@/utils/request'


// 查询
export function getCount(params) {
  // debugger
  return request({
    url: 'http://w3n1043453.zicp.vip/dashboard/getCardPanel',
    method: 'get',
    params
  })
}

// 查询分类下的销售量
export function getCateCount(params) {
  // debugger
  return request({
    url: 'http://w3n1043453.zicp.vip/dashboard/getFirstCateSoldTotal',
    method: 'get',
    params
  })
}
// 查询增长量
export function getIncrease(params) {
  // debugger
  return request({
    url: 'http://w3n1043453.zicp.vip/dashboard/getRecentlyIncrease',
    method: 'get',
    params
  })
}

// 查询最近订单
export function getOrder(params) {
  // debugger
  return request({
    url: 'http://w3n1043453.zicp.vip/dashboard/getRecentOrders',
    method: 'get',
    params
  })
}
