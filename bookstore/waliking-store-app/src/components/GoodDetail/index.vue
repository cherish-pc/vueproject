<template>
  <transition name="move">
    <div class="goodDetail" v-show="visible">
      <div class="container">
        <!-- 头部 -->
        <div class="app-header">
          <div class="header-left" @click="handleBack">
            <i class="iconfont icon-return"></i>
          </div>
          <div class="header-title">详情</div>
        </div>
        <!-- 轮播图 -->
        <div class="banner" v-if="good">
          <!-- 轮播图组件 -->
          <AppSwipper :autoPlay="false" :loop="false" :bannerList="bannerList">
            <div class="img_wrap" v-for="(item,index) in bannerList" :key="index">
              <img :src="item" alt />
            </div>
          </AppSwipper>
        </div>
        <!-- 内容 -->
        <div class="content" v-if="good">
          <div class="intro">
            <h2>{{detail.skuName}}</h2>
            <div class="price">
              <span class="nowPrice">
                <small>&yen;</small>
                <span class="price">{{detail.salePrice}}</span>
              </span>
              <small class="oldPrice">
                <del>
                  &yen;
                  <span class="recentPrice">{{detail.costPrice}}</span>
                </del>
              </small>
              <span class="saleNum">销量:{{detail.saleNum}}</span>
            </div>
            <h3>{{detail.skuIntroduction}}</h3>
          </div>
        </div>
        <div class="footer">
          <div class="addChart">
            <div class="icon" @click="change('/home/chart')">
              <i class="iconfont icon-chart"></i>
            </div>
            <div class="chart" @click="handleFirstAdd">加入购物车</div>
            <div class="add" @click="handleAddOrder">立即购买</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import AppSwipper from "@/components/AppSwipper";
import { addChart, createOrder } from "@/api";


export default {
  name: "GoodDetail",
  components: {
    AppSwipper
  },
  data() {
    return {
      bannerList: undefined,
      detail: {}
    };
  },
  watch: {
    good() {
      this.bannerList = this.good.images;
      this.detail = this.good;
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    good: {
      type: Object,
      default: undefined
    }
  },
  methods: {
    // 页面跳转方法
    change(url) {
      this.$router.push(url);
      this.handleBack();
    },
    handleBack() {
      this.$emit("update:visible", false);
    },
    // 加入购物车
    handleFirstAdd() {
      var _params = {
        skuCode: this.good.skuCode,
        businessCode: this.good.businessCode,
        // shopNum: "1"
      };
      addChart(_params).then(response => {
        // console.log(response);
      });
    },
    // 结算
    handleAddOrder() {
      var curGood = [];
      curGood.push(this.good);
      var A_orderVos = curGood.map(v => {
        return {
          skuCode: v.skuCode,
          businessCode: v.businessCode,
          loginAccount: JSON.parse(sessionStorage.getItem("loginAccount")),
          shopNum: "1"
        };
      });
      createOrder(A_orderVos).then(response => {
        // console.log(response);
        this.$router.push("user");
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.goodDetail {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 100%;
  background: #efefef;
  .app-header {
    position: fixed;
    background: white;
    top: 0;
    left: 0;
    width: 100%;
    border-bottom: 1px solid rgba($color: #aaa, $alpha: 0.3);
    // 一般header是不会自适应的，不会改变高度
    height: 48px;
    // 父级字体设为0，避免空格占宽度，影响布局
    font-size: 0;
    // flex布局
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-left {
      flex-basis: 35px;
      width: 35px;
      height: 35px;
      line-height: 35px;
      color: #777;
      font-size: 20px;
      i {
        font-size: 20px;
      }
    }
    .header-title {
      flex-grow: 1;
      font-size: 1.3rem;
      font-family: "微软雅黑";
      color: #c39862;
      font-weight: 600;
    }
  }
  .banner {
    margin-top: 48px;
    background: #fff;
    .slider {
      .slider-group {
        .slider-item {
          img {
            margin: auto;
            padding: 20px;
            box-sizing: border-box;
            width: auto;
          }
        }
      }
    }
  }
  .content {
    margin: 15px 0;
    height: 175px;
    background: white;
    .intro {
      box-sizing: border-box;
      display: flex;
      justify-content: space-around;
      height: 100%;
      flex-direction: column;
      width: 100%;
      text-align: left;
      padding: 1rem;
      h2 {
        font-size: 1rem;
        color: rgba($color: #000000, $alpha: 0.7);
      }
      h3 {
        font-size: 0.8rem;
      }
      .price {
        .nowPrice {
          font-size: 1rem;
          color: red;
          font-weight: bolder;
        }
        .oldPrice {
          font-size: 0.2rem;
          color: grey;
        }
        .saleNum {
          float: right;
        }
      }
    }
  }
  .footer {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 60px;
    width: 100%;
    background: #fff;
    .addChart {
      display: flex;
      justify-content: space-around;
      float: right;
      color: white;
      width: 240px;
      font-size: 16px;
      margin: 8px 5px;
      .icon {
        display: flex;
        flex-direction: column;
        width: 20%;
        color: #cda46f;
        margin-right: 5px;
        i {
          font-size: 30px;
        }
      }
      .chart {
        width: 40%;
        margin-right: 10px;
        border: 1px solid rgb(205, 164, 111);
        color: rgb(205, 164, 111);
        padding: 10px 5px;
        border-radius: 10px;
      }
      .add {
        width: 40%;
        padding: 10px 0;
        border-radius: 10px;
        background: rgb(205, 164, 111);
      }
    }
  }
}
.move-enter-active,
.move-leave {
  transition: all 0.2s linear;
}
.move-enter,
.move-leave-active {
  transform: translate(100%, 0);
  transition: all 0.2s linear;
}
</style>