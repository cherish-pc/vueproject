import Mock from 'mockjs'
import {param2Obj} from '../src/utils'

const data = Mock.mock({
  'items|50': [{
    // 用户账号
    userAccount: '@string("number",8)',
    // 用户姓名
    userName: '@cname()',
    // 用户性别
    'userSex|1':['0','1','2'],
    // 手机号
    phone:"@string('number',11)",
    // 用户邮箱
    email:'@email()',
    // 身份证
    idCard:"@id()",
    // 用户密码
    password:'@string(6)',
    // 获取的积分金额
    frontScore:'@float(0,9999,0,2)',
    // 管理员标记
    isAdmin:0,
    // 用户id
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
})


export default [
  // 用户列表
  {
    url: '/vue-admin-template/customer/listCustomers',
    type: 'post',
    response: (req,res) => {

      var {pageNum=1,pageSize=10,userAccount,userName} = param2Obj(req.url);
      // mock后的数据先条件过滤，再分页
      const items = data.items.filter(item=>{
        // 账号过滤
        if(userAccount && item.userAccount.indexOf(userAccount)<0) return false
        // 姓名过滤
        if(userName && item.userName.indexOf(userName)<0) return false
        return true

      });
      var pageList = items.filter((item,index)=>index<pageSize*pageNum && index>= pageSize*(pageNum-1));

      return {
        code: 1,
        msg:'调用成功',
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
  // 查询用户详情
  {
    url: '/vue-admin-template/customer/findCustomerById',
    type: 'post',
    response: (req,res) => {
      var items = data.items;
      return {
        code: 1,
        msg:'调用成功',
        success:true,

        data: items[0]

      }
    }
  }
]


