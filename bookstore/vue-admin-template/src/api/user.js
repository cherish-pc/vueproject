import request from '@/utils/request'

// 登录
export function login(params) {
  return request({
    // url: 'http://39.106.228.102:8082/customer/login',
    url:'http://w3n1043453.zicp.vip/customer/login',

    method: 'post',
    data:params
  })
}
// 用户列表
export function getList(params) {
  return request({
    url: 'http://w3n1043453.zicp.vip/customer/listCustomers',
    method: 'post',
    data:params
  })
}

// 查询用户详情
export function getCustomerDetail(params) {
  // console.log(params);
  // debugger
  return request({
    url: 'http://w3n1043453.zicp.vip/customer/findCustomerById',
    method: 'get',
    params
  })
}

// 创建用户
export function createUser(params) {
  var _parmas = {
    ...params,
    loginAccount:JSON.parse(sessionStorage.getItem('loginAccount'))
  }
  // console.log(_parmas);

  return request({
    url: 'http://w3n1043453.zicp.vip/customer/addCustomer',
    method: 'post',
    data:_parmas
  })
}

// 更新
export function updateUser(params) {
  var _parmas = {
    ...params,
    loginAccount:JSON.parse(sessionStorage.getItem('loginAccount'))
  }

  return request({
    url: 'http://w3n1043453.zicp.vip/customer/updateCustomerById',
    method: 'post',
    data:_parmas
  })
}

// 删除用户
export function deleteUser(params) {

  return request({
    url: 'http://w3n1043453.zicp.vip/customer/deleteCustomerById',
    method: 'get',
    params
  })
}
//修改用户密码
export function changePassword(params) {

  return request({
    url: 'http://w3n1043453.zicp.vip/customer/updatePwd',
    method: 'get',
    params
  })
}

export function logout(params) {

  return request({
    url: 'http://w3n1043453.zicp.vip/customer/loginOut',
    method: 'get',
    params
  })
}
