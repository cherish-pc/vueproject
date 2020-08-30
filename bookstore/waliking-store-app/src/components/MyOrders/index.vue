<template>
  <div class="goodDetail" v-show="visible">
    <div class="container">
      <!-- 头部 -->
      <div class="app-header">
        <div class="header-left" @click="handleBack">
          <i class="iconfont icon-return"></i>
        </div>
        <div class="header-title">我的订单</div>
      </div>
      <!-- 内容 -->
      <div class="order_container" ref="orders">
        <ul>
          <li class="good-item" v-for="(good,index) in detail" :key="index">
            <!-- 头部 -->
            <div v-for="(item,index) in good.orderUserSku" :key="index" class="margins">
              <div class="order_header">
                <div class="shopName">
                  <i class="iconfont icon-dingdan"></i>
                  {{item.skuCode}}
                </div>
                <div class="orderStatus">{{good.orderStatus|orderStatusFilter}}</div>
              </div>
              <!-- 订单内容 -->
              <div class="content">
                <div class="icon">
                  <img :src="item.images[0]" alt />
                </div>
                <div class="detail">
                  <div class="name">{{item.skuIntroduction}}</div>
                  <div class="price">
                    <div class="now">¥{{item.salePrice}}</div>
                    <div class="num">×{{item.shopNum}}</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="foot">
              <!-- <span class="amountText">共{{good.orderUserSku[0].shopNum}}件商品</span> -->
              <span class="amount">总价</span>
              <span class="allPrice">¥{{good.orderAmount}}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import AppSwipper from "@/components/AppSwipper";
import { getBusiness } from "@/api";

export default {
  name: "MyOrders",
  components: {
    AppSwipper
  },
  data() {
    return {
      detail: []
    };
  },
  filters: {
    orderStatusFilter(code) {
      var orderStatusMap = [
        "买家已下单",
        "卖家已发货",
        "订单未评价",
        "交易成功 ",
        "已取消订单"
      ];
      return orderStatusMap[parseInt(code)];
    }
  },
  created() {},
  watch: {
    order() {
      this.detail = this.order;
      this.getBus();
      this._initScroll();
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    order: {
      type: Array,
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
    // 商品滚动
    _initScroll() {
      this.$nextTick(() => {
        this.orderScroll = new BScroll(this.$refs.orders, {
          click: true,
          scrollY: true
        });
      });
    },
    getBus() {
      // 获取商家信息
      getBusiness().then(response => {
        this.business = response.data;
        // console.log(this.detail);
        var key = "busName";
        // debugger
        if (this.detail.list) {
          this.detail.list.forEach(item => {
            this.business.forEach(v => {
              if (item.businessCode == v.businessCode) {
                item[key] = v.businessName;
              }
            });
          });
        }
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
  .container {
    height: 100%;
    overflow: hidden;
    .app-header {
      position: fixed;
      background: white;
      z-index: 100;
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
    .order_container {
      height: 100%;
      width: 100%;
      padding-top: 50px;
      box-sizing: border-box;
      overflow: hidden;
      ul {
        position: relative;
        padding-top: 40px;
      }
      .margins {
        margin-bottom: 10px;
      }
      .good-item {
        display: flex;
        padding: 12px;
        margin: 18px;
        // height: 150px;
        box-shadow: #ccc 3px 3px 8px;
        border-bottom: 1px solid #ccc;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        border-radius: 10px;
        background-color: white;
        .shopName {
          .iconfont {
            color: #c39862;
            font-size: 0.9rem;
          }
        }
        &:last-child {
          border: none;
          margin-bottom: 0;
        }
        .order_header {
          height: 40px;
          line-height: 40px;
          display: flex;
          justify-content: space-between;
          width: 100%;
          font-size: 12px;
          .orderStatus {
            color: #c39862;
            text-align: right;
          }
        }
        .content {
          flex: 1;
          width: 100%;
          overflow: hidden;
          position: relative;
          text-align: left;
          display: flex;
          justify-content: space-between;
          .icon {
            flex-basis: 65px;
            height: 80px;
            margin-right: 0.75rem;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .detail {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding-right: 5px;
            width: 210px;
            .price {
              font-size: 12px;
              margin-bottom: 0;
              text-align: right;
              .now {
                color: #f54f26;
              }
            }
            .name {
              font-size: 12px;
              word-break: break-all;
              height: 2rem;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 2; //2行
              -webkit-box-orient: vertical;
            }
          }

          .datetime {
            font-size: 12px;
            padding: 0.25rem 0;
          }
        }
        .foot {
          text-align: right;
          width: 100%;
          height: 30px;
          line-height: 30px;
          font-size: 12px;
          padding-right: 10px;
          .amountText {
            padding-right: 5px;
          }
          .amount {
            letter-spacing: 2px;
            padding-right: 2px;
          }
        }
      }
    }
  }
}
</style>