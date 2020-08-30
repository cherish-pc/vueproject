//接收mock数据
const {
    cate,
    goods,
    banner,
    chart,
    bussiness
} = require('./mockData')


const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}


module.exports = {
    devServer: {
        before(app){
            // 商品类别
            app.post('/api/cate/listCateTree', (req, res) => {
                res.json(cate)
                }),
            // 商品列表
            app.post('/api/goods/listGoods', (req, res) => {
                res.json(goods)
                })
            // banner列表
            app.post('/api/picture/listPic', (req, res) => {
                res.json(banner)
                })
            // 购物车列表
            app.get('/api/shoppingCar/findGoodsFromCar', (req, res) => {
                res.json(chart)
                })
            // 购物车列表
            app.get('/api/goods/listBusiness', (req, res) => {
                res.json(bussiness)
                })
            // 购物车添加
            app.post('/api/shoppingCar/addShoppingCar', (req, res) => {
                res.json({
                    "msg": "添加成功",
                    "code": 1,
                    "success": true,
                    data:{}

                })
            })
            // 购物车添加
            app.post('/api/shoppingCar/deleteGoodsFromCar', (req, res) => {
                res.json({
                    "msg": "删除成功",
                    "code": 1,
                    "success": true,
                    data:{}
                })
            })
            // 订单添加
            app.post('/api/order/addOrder', (req, res) => {
                res.json({
                    "msg": "创建订单成功",
                    "code": 1,
                    "success": true,
                    data:{}

                })
            })
            // 查询商品详情
            app.get('/api/goods/findGoodsBySkuCode', (req, res) => {
                res.json({
                    "msg": "查询成功",
                    "code": 1,
                    "success": true,
                    data:goods.data.list[0]

                })
            })




        }
    },
    // 路径别名
    chainWebpack(config){
        config.resolve.alias
            .set('@',resolve('src'))
    },
    configureWebpack: {
        resolve: {
          alias: {
            'vue$': 'vue/dist/vue.esm.js' 
          }
        }
    }
}