import request from '@/utils/request'
import {getLoginAccount} from '@/utils/auth'
// 模块项目
// 轮播图列表
export function getList(params) {

  return request({
    url: 'http://w3n1043453.zicp.vip/picture/listPic',
    method: 'post',
    data:params
  })
}
// 新增
export function addPic(params) {
  var _params = {
    ...params,
    loginAccount:JSON.parse(sessionStorage.getItem('loginAccount'))
    // loginAccount:getLoginAccount()
  }
  return request({
    url: 'http://w3n1043453.zicp.vip/picture/addPicture',
    method: 'post',
    data:_params
  })
}
// 修改和删除
export function updatePic(params) {
  var _params = {
    ...params,
    loginAccount:JSON.parse(sessionStorage.getItem('loginAccount'))
  }
  return request({
    url:'http://w3n1043453.zicp.vip/picture/updatePic',
    method: 'post',
    data:_params
  })
}
