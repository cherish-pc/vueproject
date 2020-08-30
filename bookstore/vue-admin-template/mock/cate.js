import Mock from 'mockjs'
import { param2Obj } from '../src/utils'
const data = Mock.mock({
  'items|3': [{
    // 菜单编码
    nodeId: '@guid',
    // 菜单名名称
    nodeName: '@ctitle(6)',
    // 节点菜单的所有属性
    attribute: {
      // 商品分类名称
      cateName: '@ctitle(6)',
      // 商品分类编码
      cateCode: '@integer(10)',
      // 父级商品分类编码
      parentCateCode: '',
      // 父级商品分类名称
      parentCateName: '',
      // 备注
      remark: '@csentence(20)',
      // 分类级别
      'level|1': ['1', '2'],
      // 用户id
      id: '@id',
      // 删除标记
      isDelete: '0',
      // 创建时间
      createdTime: '@datetime()',
      // 创建人
      createdby: '@cname()',
      // 更新时间
      updatedTime: '@datetime()',
      // 更新人
      updatedby: '@cname()',
    },
    // 子菜单集合
    childNodes: [
      {
        // 菜单编码
        nodeId: '@guid',
        // 菜单名名称
        nodeName: '@ctitle(6)',
        // 节点菜单的所有属性
        attribute: {
          // 商品分类名称
          cateName: '@ctitle(6)',
          // 商品分类编码
          cateCode: '@integer(10)',
          // 父级商品分类编码
          parentCateCode: '@integer(10)',
          // 父级商品分类名称
          parentCateName: '',
          // 备注
          remark: '@csentence(20)',
          // 分类级别
          'level|1': ['1', '2'],
          // 用户id
          id: '@id',
          // 删除标记
          isDelete: '0',
          // 创建时间
          createdTime: '@datetime()',
          // 创建人
          createdby: '@cname()',
          // 更新时间
          updatedTime: '@datetime()',
          // 更新人
          updatedby: '@cname()',
        },
      }
    ]

  }]
})

// 获取查询分类树
export default [
  {
    url: '/vue-admin-template/cateGory/findCateGoryTree',
    type: 'get',
    response: config => {
      return {
        code: 1,
        msg:'查询成功',
        data: data.items
      }
    }
  },
  // 新增
  {
    url: '/vue-admin-template/cateGory/addCateGory',
    type: 'post',
    response: (req,res) => {
      // console.log(req.url);
      return {
        code: 1,
        msg:'新增类别成功',
        data: {}
      }
    }
  },
  // 查询分类详情
  {
    url: '/vue-admin-template/cateGory/findCateGoryByCode',
    type: 'get',
    response: config => {
      return {
        code: 1,
        msg:'查询详情成功',
        data: data.items[0]
      }
    }
  },
  // 修改分类
  {
    url: '/vue-admin-template/cateGory/updateCateGory',
    type: 'post',
    response: (req,res) => {
      // console.log(req.url);
      console.log(param2Obj(req.url));

      return {
        code: 1,
        msg:'更新成功',
        data: {}
      }
    }
  },
  // 删除
  {
    url: '/vue-admin-template/cateGory/deleteGoryBycode',
    type: 'get',
    response: config => {
      console.log(param2Obj(config.url));
      return {
        code: 1,
        msg:'删除成功',
        data: {}
      }
    }
  },

]
