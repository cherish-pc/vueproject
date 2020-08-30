import request from '@/utils/request'

// 兑换
export function getExchange(params){

    return request({
        url:'http://w3n1043453.zicp.vip/recharge/useRechargeCard',
        method:'get',
        params
    })
}


// 获取商品分类
export function getCate(params){

    return request({
        url:'http://w3n1043453.zicp.vip/cate/listCateTree',
        method:'get',
        params
    })
}

// 获取商品列表
export function getGoods(params){
    return request({
        url:'http://w3n1043453.zicp.vip/goods/listGoods',
        method:'post',
        data:params
    })
}

// 获取banner列表
export function getBanner(params){

    return request({
        url:'http://w3n1043453.zicp.vip/picture/listPic',
        method:'post',
        data:params
    })
}

// 获取购物车列表
export function getChart(params){

    return request({
        url:'http://w3n1043453.zicp.vip/shoppingcar/findGoodsFromCar',
        method:'get',
        params
    })
}

// 获取商家信息
export function getBusiness(params){
    return request({
        url:'http://w3n1043453.zicp.vip/goods/listBusiness',
        method:'get',
        params
    })
}

// 添加到购物车
export function addChart(params){
    var _params = {
        ...params,
        loginAccount:JSON.parse(sessionStorage.getItem('loginAccount'))
    }
    console.log(_params);
    // debugger
    return request({
        url:'http://w3n1043453.zicp.vip/shoppingcar/addShoppingCar',
        method:'post',
        data:_params
    })
}
// 删除购物车
export function deleteChart(params){
    return request({
        url:'http://w3n1043453.zicp.vip/shoppingcar/deleteGoodsFromCar',
        method:'post',
        data:params
    })
}
// 创建订单
export function createOrder(params){
    var _params = [
        ...params,
    ]
    return request({
        url:'http://w3n1043453.zicp.vip/order/addOrder',
        method:'post',
        data:_params
    })
}
// 查询订单
export function searchOrder(params){
    return request({
        url:'http://w3n1043453.zicp.vip/order/listGoodsFromOrders',
        method:'get',   
        params
    })
}

// 商品详情
export function getGoodDetail(params){
    return request({
        url:'http://w3n1043453.zicp.vip/goods/findGoodsBySkuCode',
        method:'get',
        params
    })
}
// 用户登录
export function login(params){

    return request({
        url:'http://w3n1043453.zicp.vip/customer/login',
        method:'post',
        data:params
    })
}
// 用户退出
export function loginOut(params){

    return request({
        url:'http://w3n1043453.zicp.vip/customer/loginOut',
        method:'get',
        params
    })
}
// 注册
export function register(params){

    return request({
        url:'http://w3n1043453.zicp.vip/customer/addCustomer',
        method:'post',
        data:params
    })
}

// 修改密码
export function updatePwd(params){

    return request({
        url:'http://w3n1043453.zicp.vip/customer/updatePwd',
        method:'get',
        params
    })
}