import request from '@/utils/request'
// 模块项目
// 获取公告列表
export function getList(params) {
  return request({
    url: 'http://w3n1043453.zicp.vip/announce/listAnnounces',
    method: 'post',
    data:params
  })
}

// 删除
export function deleteCode(params) {
  return request({
    url: 'http://w3n1043453.zicp.vip/announce/deleteAnnounce',
    method: 'get',
    params
  })
}

// 新增
export function addAnnounce(params) {
  return request({
    url: 'http://w3n1043453.zicp.vip/announce/addAnnounce',
    method: 'post',
    data:params
  })
}
updateAnnounce
// 新增
export function updateAnnounce(params) {
  return request({
    url: 'http://w3n1043453.zicp.vip/announce/setAnnounceStatus',
    method: 'get',
    params
  })
}