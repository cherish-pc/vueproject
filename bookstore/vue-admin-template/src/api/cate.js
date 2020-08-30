import request from '@/utils/request'
// 查询
export function getCate(params) {
  return request({
    url: 'http://w3n1043453.zicp.vip/cate/listCateTree',
    method: 'get',
    params
  })
}
// 新增
export function addCateGory(params) {
  var _params = {
    ...params,
    loginAccount:JSON.parse(sessionStorage.getItem('loginAccount'))
  }
  return request({
    url: 'http://w3n1043453.zicp.vip/cate/addCate',
    method: 'post',
    data:_params
  })
}
// 查询详情
export function findCateGoryByCode(params) {
  return request({
    url: 'http://w3n1043453.zicp.vip/cate/findCateByCode',
    method: 'get',
    params
  })
}
// 修改
export function updateCateGory(params) {
  var _params = {
    ...params,
    loginAccount:JSON.parse(sessionStorage.getItem('loginAccount'))
  }
  return request({
    url: 'http://w3n1043453.zicp.vip/cate/updateCateByCode',
    method: 'post',
    data:_params
  })
}
// 删除
export function deleteGory(params) {
  return request({
    url: 'http://w3n1043453.zicp.vip/cate/deleteCateByCode',
    method: 'get',
    params
  })
}
