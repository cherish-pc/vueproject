import Mock from 'mockjs'
import {param2Obj} from '../src/utils'

const data = Mock.mock({
  'items|20': [{
     // 图片
     picUrl:'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2953314138,1818681625&fm=26&gp=0.jpg',
    // 图片的状态（1：启用 2;禁用）
    'picStatus|1':['1','2'],
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

export default [
  // 轮播图列表
  {
    url: '/vue-admin-template/picture/listPic',
    type: 'post',
    response: (req,res) => {
      var {picStatus} = param2Obj(req.url);
      // // mock后的数据先条件过滤，再分页
      const items = data.items.filter(item=>{
        // 状态过滤
        if(picStatus && +item.picStatus !== +picStatus) return false
        return true

      });
      // // 当前页的条数
      // var pageList = items.filter((item,index)=>index<pageSize*pageNum && index>= pageSize*(pageNum-1));
      return {
        code: 1,
        msg:'查询成功',
        success:true,
        data: items
          // total: items.length,
          // pageNum:pageNum,
          // pageSize:pageSize,

      }
    }
  },
  // 新增
  {
    url: '/vue-admin-template/picture/addPic',
    type: 'post',
    response: (req,res) => {
      // var {picUrl} = param2Obj(req.url);
      // console.log(param2Obj(req.url));
      return {
        code: 1,
        msg:'添加成功',
        success:true,
        data: {}
      }
    }
  },
  // 修改和删除
  {
    url: '/vue-admin-template/picture/updatePic',
    type: 'get',
    response: config => {
      // var {picUrl} = param2Obj(config.url);
      console.log(param2Obj(config.url));
      return {
        code: 1,
        msg:'修改成功',
        success:true,
        data: {}
      }
    }
  },

]


