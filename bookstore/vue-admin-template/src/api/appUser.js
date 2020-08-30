import request from '@/utils/request'
// 模块项目
var siteName = 'http://w3n1043453.zicp.vip'
export function getList(params) {
  // console.log(params);
  return request({
    url: siteName+'/customer/listCustomers',
    method: 'post',
    data:params
  })
}
// 查询用户详情
export function getCustomerDetail(params) {
  // console.log(params);
  return request({
    url: siteName+'/customer/findCustomerById',
    method: 'post',
    data:params
  })
}
