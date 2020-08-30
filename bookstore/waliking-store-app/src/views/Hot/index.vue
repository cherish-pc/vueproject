<template>
  <div class="hot_container">
    <AppHeader title="首页"></AppHeader>
    <div class="hot" ref="hot">
      <div class="scroll" >
        <div v-if="bannerList" class="banner">
          <!-- 轮播组件 -->
          <AppSwipper :bannerList="bannerList">
            <div class="img_wrap"
              v-for="(item,index) in bannerList"
              :key="index">
              <img :src="item.picUrl" alt="">
            </div>
          </AppSwipper>
        </div>
        <!-- 下方列表 -->
        <div class="good-list">
          <div class="title">热门商品</div>
          <div class="container" ref="goodC">   
            <div :key="index"
              v-for="(book,index) in goods" 
              class="show"
              @click.stop="handleDetail(book)">
              <a @click.stop="handleDetail(book)">
                <img :src="book.images[0]" alt />
              </a>
              <div class="intro">
                <h3>{{book.skuName}}</h3>
                <div class="price">
                  <span class="nowPrice">
                    <small>&yen;</small>
                    <span class="price">{{book.salePrice}}</span>
                  </span>
                  <small class="oldPrice">
                    <del>
                      &yen;
                      <span class="recentPrice">{{book.costPrice}}</span>
                    </del>
                  </small>
                  <span class="saleNum">销量:{{book.saleNum}}</span>
                </div>
              </div>
            </div>       
          </div>
        </div>
      </div>
      <!-- 商品详情 -->
      <GoodDetail
        :visible.sync="GoodDetailVisible"
        :good="currentGood"/>
    </div>
    
  </div>

</template>
<script>
import { getBanner,getGoods,getGoodDetail } from '@/api'
import AppSwipper from '@/components/AppSwipper'
import GoodDetail from '@/components/GoodDetail'
import BScroll from 'better-scroll'
import AppHeader from '@/components/AppHeader'

export default {
  components:{
    AppSwipper,
    GoodDetail,
    AppHeader
  },
  data(){
    return{
      bannerList:undefined,
      bannerQueryList:{
        picStatus:'1',
        pageNum:'1',
        pagesize:'100'
      },
      goods:[],
      goodsQueryList:{
        pageNum:'1',
        pageSize:'100'
      },
      // 商品详情
      // 弹窗可见性
      GoodDetailVisible:false,
      currentGood:{}
    }
  },
  created(){
    //获取数据
    this.fetchbanner();
    this.fetchGood();
    // 启动商品列表滚动
    this._initScroll();
  },
  methods:{
    fetchbanner(){
      // 获取轮播图
      getBanner(this.bannerQueryList).then(response=>{
        this.bannerList = response.data
      })
    },
    fetchGood(){
      // 获取商品
      getGoods(this.goodsQueryList).then(response=>{
        response.data.list.forEach(item=>{
          if(item.skuStatus == 0){
            this.goods.push(item)
          }
        });             
      })
    },
    // 商品滚动
    _initScroll(){
      this.$nextTick(()=>{
        this.goodListScroll = new BScroll(this.$refs.hot,{
          click:true,
          scrollY:true
        })
      })
    },
    // 点击商品进入详情
    handleDetail(good){
      getGoodDetail({skuCode:good.skuCode}).then(response=>{
        this.currentGood = response.data;
        this.GoodDetailVisible = true;       
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.hot{
  position:absolute;
  left:0;
  top:48px;
  right:0;
  bottom:58px;
  overflow: hidden;
  // 轮播图
  .banner{
    width:100%;
    height:auto;
    .img_wrap{
      height:100%;
    }
  }
  // 商品列表
  .good-list{
    background-color: rgba($color: #ccc, $alpha: .2);
    .title{
      text-align: left;
      // width: 90%;
      margin-left:1rem;
      font-size: 1rem;
      font-weight: bold;
      color: #c39862;
      height: 30px;
      line-height: 30px;
    }
    .container {
      // width: 90%;
      margin: 0 auto;
      height: 100%;
      display: flex;
      justify-content: space-around;
      flex-wrap: wrap;
      box-sizing:border-box;
      &::after{
        content: '';
        width: 160px;
        height: 0;
        display: block;
      }
      /* 商品内容 */
      .show {
        width: 10rem;
        height:250px;
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        background: white;
        border-radius: 8px;
        padding: .5rem 1rem;
        box-sizing: border-box;
        img {
        width: 7rem;
        max-height:8rem;
        }
        .intro {
          width: 100%;
          text-align: left;
          padding: .5rem;
          h3 {
          font-size: .75rem;
          height: 2rem;
          word-break: break-all;
          overflow: hidden;
          font-weight: bold;
          }
          .price {
            margin-top: .5rem;
            .nowPrice {
              font-size: 1rem;
              color: red;
              font-weight: bolder;
            }
            .oldPrice {
              font-size: .2rem;
              color: grey;
            }
            .saleNum{
              float: right;
            }
          }
        }
      }
    }
  }
}




</style>