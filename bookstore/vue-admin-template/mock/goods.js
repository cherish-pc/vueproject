import Mock from 'mockjs'
import {param2Obj} from '../src/utils'
const data = Mock.mock({
  'items|50': [{
    id: '@id',
    // 商品编码
    skuCode:'@string(5)',
    // 商品名称
    skuName:'@cword(5,16)',
    // 定价
    costPrice:'@float(0,200,0,2)',
    // 售价
    salePrice:'@float(0,200,0,2)',
    // 销售数量
    saleNum:'@integer(0,9999)',
    // 一级分类代码
    firstCateCode:'@string(6)',
    // 一级分类名称
    firstCateName:'@cword(5,10)',
    // 二级分类代码
    secondCateCode:'@string(6)',
    // 二级分类名称
    secondCateName:'@cword(5,10)',
    // 广告词
    skuAd:'@csentence(2,10)',
    // 商品介绍
    skuIntroduction:'@csentence(7,18)',
    // 商品状态(0:在售 1; 已下架，2：未发布)
    'skuStatus|1':['0','1','2'],
    // 上架时间
    saleTime:'@datetime()',
    // 浏览量
    visiteNum:'@integer(0,29999)',
    // 商家编码
    businessCode:'@string(6)',
    // 商家名称
    businessName:'@cword(3,8)',
    // 库存
    storeNum:'@integer(0,9999)',
    // Isbn书号
    ISBN:'@string("number",6)',
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
    // images:["@image('300x400', '#fb0a2a')"]
  }]
})

export default [
  // 查询商品列表
  {
    url: '/goods/listGoods',
    type: 'post',
    response: (req,res) => {
      var {pageNum=1,pageSize=10,skuName,skuStatus,skuAd} = param2Obj(req.url);
      // console.log(param2Obj(req.url));
      // mock后的数据先条件过滤，再分页
      const items = data.items.filter(item=>{
        // 商品名称过滤
        if(skuName && item.skuName.indexOf(skuName)<0) return false
        // 广告词过滤
        if(skuAd && item.skuAd.indexOf(skuAd)<0) return false
        // 商品状态过滤
        if(skuStatus && item.skuStatus !==skuStatus) return false
        return true

      });
      var pageList = items.filter((item,index)=>index<pageNum*pageSize && index>= pageSize*(pageNum-1));
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
  // 新增商品接口
  {
    url: '/vue-admin-template/goods/addGoods',
    type: 'post',
    response: (req,res) => {
      // console.log(param2Obj(req.url));
      return {
        code: 1,
        msg:'添加商品成功',
        success:true,
        data: {}
      }
    }
  },
  // 更新商品接口
  {
    url: '/vue-admin-template/goods/updateGoodsInfo',
    type: 'post',
    response:(req,res) => {
      // console.log(param2Obj(req.url));
      return {
        code: 1,
        msg:'更新成功',
        success:true,
        data: {}
      }
    }
  },
  // 查询商品详情
  {
    url: '/vue-admin-template/goods/findGoodsBySkuCode',
    type: 'get',
    response: config => {
      // console.log(param2Obj(config.url));
      var item = data.items[0];
      item.images = ["@image('300x400', '#fb0a2a')","@image('300x400', '#fb0a2a')"];
      return {
        code: 1,
        msg:'查询成功',
        success:true,
        data: item
      }
    }
  },
    // 上架和下架
    {
      url: '/vue-admin-template/goods/updateGoodsStatus',
      type: 'get',
      response:config => {
        // console.log(param2Obj(req.url));
        return {
          code: 1,
          msg:'更新成功',
          success:true,
          data: {}
        }
      }
    },
  // 删除商品接口
  {
    url: '/vue-admin-template/goods/deleteGoods',
    type: 'get',
    response: config => {
      console.log(param2Obj(config.url));

      return {
        code: 1,
        msg:'删除成功',
        success:true,
        data: {}
      }
    }
  },
  // 上传图片接口
  {
    url: '/vue-admin-template/goods/uploadImage',
    type: 'post',
    response: (req,res) => {
      return {
        code: 1,
        msg:'上传成功',
        success:true,
        data:'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2953314138,1818681625&fm=26&gp=0.jpg'
      }
    }
  },
  // 查询商家信息
  {
    url: '/vue-admin-template/goods/listBusiness',
    type: 'get',
    response: config => {
      // console.log(param2Obj(config.url));
      var A_busList = data.items.reduce((acc,cur)=>{
        acc.push({
          businessCode:cur.businessCode,
          businessName: cur.businessName
        })
        return acc
      },[])
      return {
        code: 1,
        msg:'查询成功',
        success:true,
        data: A_busList
      }
    }
  },
]
