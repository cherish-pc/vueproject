import Mock from 'mockjs'
import {param2Obj} from '../src/utils'
import moment from 'moment'

const data = Mock.mock({
  'items|50': [{
    orderStartTime:'@datetime()',
    orderEndTime:'@datetime()',
    // 下单人id
    orderUserId: '@string("number",8)',
    // 订单号
    orderCode:'@string("number",11)',
    // 'orderCode|+1':1,

    // 订单总价
    orderAmount:'@float(0,9999,0,2)',
    // 订单状态 0：已下单 1：已发货 2：已完成未评价 3:已完成已评价 4：已取消
    'orderStatus|1':['0','1','2','3','4'],
    // 支付状态 0为未支付，1为已支付

    // TODO：接口文档没写
    'payStatus|1':['0','1'],
    // 商家编码
    businessCode:'@string(7)',
    // 订单状态名称
    statusName:null,
    // 下单人姓名
    orderUserName: '@cname()',
    // 下单人手机号
    phone:"@string('number',11)",
    // id
    id: '@id()',
    // 删除标记
    'IsDelete|1':['0','1'],
    // 创建时间
    createdTime: '@datetime()',
    // 创建人
    createdby:'@cname()',
    // 更新时间
    updatedTime: '@datetime()',
    // 更新人
    updatedby:'@cname()',


  }]
});
var orderStatusMap = ['已下单','已发货','已完成未评价','已完成已评价','已取消'];
data.items.map(v=>v.statusName = orderStatusMap[v.orderStatus]);

const detailData = Mock.mock({
  'items|50': [{
  orderCode:'',
   // 订单详情内容
   skuCode: '@string("number",8)',
   // 商品名称
   skuName: '@cword(6)',
   // 商品购买数量
   shopNum:"@integer(0,9999)",
   // 总金额
   skuSmount:'@float(0,9999,0,2)',
   // 售价
   salePrice:'@float(0,300,0,2)',
   // 定价
   costPrice:'@float(0,300,0,2)',
   // 图片
   images:['https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2953314138,1818681625&fm=26&gp=0.jpg',],
    // id
    id: '@id()',
    // 删除标记
    'IsDelete|1':['0','1'],
    // 创建时间
    createdTime: '@datetime()',
    // 创建人
    createdby:'@cname()',
    // 更新时间
    updatedTime: '@datetime()',
    // 更新人
    updatedby:'@cname()'
  }]
});
detailData.items.map((v,i)=>v.orderCode = data.items[i].orderCode);

// 详情
export default [
  // 订单列表
  {
    url: '/vue-admin-template/order/listOrders',
    type: 'post',
    response: (req,res) => {
      var {pageNum=1,pageSize=10,orderUserName,orderCode,orderStatus,phone,orderStartTime,orderEndTime} = param2Obj(req.url);
      // mock后的数据先条件过滤，再分页
      const items = data.items.filter(item=>{
        // 姓名过滤
        if(orderUserName && item.orderUserName.indexOf(orderUserName)<0) return false
        // 订单号过滤
        if(orderCode && item.orderCode.indexOf(orderCode)<0) return false
        // 订单状态过滤
        if(orderStatus && +item.orderStatus !== +orderStatus) return false
        // 手机号过滤
        if(phone && item.phone.indexOf(phone)<0) return false

        if(orderStartTime && moment(orderStartTime) > moment(item.orderStartTime)) return false

        if(orderEndTime && moment(orderEndTime) < moment(item.orderEndTime)) return false

        return true

      });
      // 当前页的条数
      var pageList = items.filter((item,index)=>index<pageSize*pageNum && index>= pageSize*(pageNum-1));
      return {
        code: 1,
        msg:'查询成功',
        success:true,
        data: {
          total: items.length,
          pageNum:pageNum,
          pageSize:pageSize,
          List: pageList
        }
      }
    }
  },
  // 查询订单详情
  {
    url: '/vue-admin-template/order/listOrderDetails',
    type: 'get',
    response: (req,res) => {
      var items = detailData.items;
      return {
        code: 1,
        msg:'查看成功',
        success:true,
        data: items
      }
    }
  }


]


