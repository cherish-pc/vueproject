<template>
  <div class="account_wrapper">
      <div class="left">
          <!-- 购物车图标 -->
          <div class="logo_wrapper">
              <div class="logo" :class="{'active':total.num !=0}">
                  <i class="iconfont icon-chart"></i>
              </div>
              <div class="num" v-show="total.num !=0">{{total.num}}</div>
          </div>
          <!-- 总价 -->
          <div class="price">
              ¥{{total.price}}
          </div>
          <!-- 内容描述 -->
          <div class="content">
              (实际价格以订单为准)
          </div>
      </div>
      <div class="right">
          <div class="pay" :class="{'active':total.price >0}"
            @click="handleAddOrder()">{{total.content}}</div>
      </div>
  </div>
  
</template>

<script>
import { createOrder} from '@/api'

var loginAccount = JSON.parse(sessionStorage.getItem('loginAccount'))

export default {
    name:"AccountBar",
    data(){
        return{

        }
    },
    props:{
        goodList:{
            type:Array,
            default(){
                return []
            }
        },
        selectGoods:{
            type:Array,
            default(){
                return []
            }
        }
    },
    computed:{
        total(){
            // console.log(this.selectGoods)
            var _total = this.selectGoods.reduce((acc,cur)=>{
                // console.log(cur);                
                acc.price += cur.price*cur.shopNum;
                acc.num += cur.shopNum;
                return acc;
            },{
                price:0,
                num:0
            });
            if(_total.price == 0){
                _total.content =  '请添加商品到购物车';
            }else{
                _total.content = '结算'
            }
            return _total;
        }
    },
    methods:{
        handleAddOrder(){
            var A_orderVos = this.selectGoods.map(v=>{
                return {
                    skuCode:v.skuCode,
                    businessCode:v.businessCode,
                    loginAccount:loginAccount,
                    shopNum:v.shopNum+''
                }
            })            
            createOrder(A_orderVos).then(response=>{
                // console.log(response.data);
                // 路由跳转到 我的订单
                this.$router.push('user')
            })
            this.$emit('fetch')
        }
    }

}
</script>

<style lang="scss" scoped>
  .account_wrapper{
      position: absolute;
      left:0;
      bottom:0px;
      width:100%;
      height:40px;
      display:flex;
      justify-content: space-between;
      background-color: #eee;
      .left{
          flex-grow: 1;
          display: flex;
          align-items: center;
          font-size: 0;
          .logo_wrapper{
              margin-left:1rem;
              box-sizing: border-box;
              position: relative;
              top:-10px;
              width:56px;
              height:56px;
              padding:6px;
              border-radius:50%;
              background:#eee;
              .logo{
                  background:#afa9a9;
                  border-radius:50%;
                  height:100%;
                  width:100%;
                  text-align: center;
                  &.active{
                      background:rgb(214, 145, 96);
                  }
                  .icon-chart{
                      font-size: 24px;
                      color:#eee;
                      line-height: 45px;
                  }

              }
              .num{
                      width: 16px;
                    height: 16px;
                    font-size: 8px;
                    background: #e22f2f;
                    color: white;
                    position: absolute;
                    line-height: 16px;
                    top: 9px;
                    right: 12px;
                    border-radius: 50%;
              }
          }
          .price{
              font-size:16px;
              max-width:150px;
              padding-right:12px;
              font-weight: bold;
              color:red;
            //   border-right:1px solid rgba($color: #000000, $alpha: .3);
          }
          .content{
              width: 122px;
              font-size: .7rem;    
            //   padding-left: 10px;
              margin-top: 12px;          
          }
      }
      .right{
          width:100px;
          flex-basis: 100px;
          .pay{
              height:100%;
              width:100%;
              font-size:12px;
              padding: 0 15px;
              text-align: center;
              box-sizing: border-box;
              word-break: break-all;
              background-color: rgba($color: #000000, $alpha: .2);
            // background:#afa9a9;
              display: flex;
              justify-content: center;
              align-items: center;
              &.active{
                  background-color: rgb(231, 135, 80);
                  color:#fff;
                  font-size:17px;
              }

          }
      }
  }
</style>