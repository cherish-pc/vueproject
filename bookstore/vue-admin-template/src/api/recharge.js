import request from '@/utils/request'
// 模块项目
// 获取卡密列表
export function getList(params) {
  return request({
    url: 'http://w3n1043453.zicp.vip/recharge/listRechargeCard',
    method: 'post',
    data:params
  })
}
// 生成卡密
export function addCard(params) {

  return request({
    url:'http://w3n1043453.zicp.vip/recharge/generateCard',
    method: 'get',
    params
  })
}

// 生成卡密
export function deleteCard(params) {

  return request({
    url:'http://w3n1043453.zicp.vip/recharge/deleteRechargeCard',
    method: 'post',
    data:params
  })
}