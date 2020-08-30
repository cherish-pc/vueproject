<template>
  <div class="chart">
    <AppHeader title="购物车"></AppHeader>
    <!-- 列表 -->
    <div class="goods-wrapper" ref="chart">
      <ul v-if="chartList">
        <li
          class="good-item"
          v-for="(good,index) in chartList"
          :key="index"
          @click="handleDetail(good)"
        >
          <!-- 图片 -->
          <div class="icon">
            <img :src="good.images[0]" alt />
          </div>
          <div class="content">
            <div class="name">{{good.skuName}}</div>
            <div class="datetime">{{good.busName}}</div>
            <div class="price">
              <span class="now">¥{{good.salePrice}}</span>
            </div>
            <div class="control">
              <CartControl :good="good" @fetch="fetchData"></CartControl>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 购物车结算 -->
    <AccountBar :selectGoods="selectGoods" @fetch="fetchData"></AccountBar>
    <!-- 商品详情 -->
    <GoodDetail :visible.sync="GoodDetailVisible" :good="currentGood" />
  </div>
</template>

<script>
import moment from "moment";
import BScroll from "better-scroll";
import { getChart, getBusiness, getGoodDetail } from "@/api";
import CartControl from "@/components/CartControl";
import AccountBar from "@/components/AccountBar";
import GoodDetail from "@/components/GoodDetail";
import AppHeader from "@/components/AppHeader";

export default {
  components: {
    CartControl,
    AccountBar,
    GoodDetail,
    AppHeader
  },
  data() {
    return {
      chartList: [],
      chartQueryList: {
        userId: "",
        pageNum: 1,
        pageSize: 50
      },
      // 商品详情
      // 弹窗可见性
      GoodDetailVisible: false,
      currentGood: {},
      business: undefined
    };
  },
  watch: {},
  filters: {
    timeFilter(date) {
      if (date) {
        return moment(date).format("YYYY/MM/DD hh:mm");
      }
    }
  },

  created() {
    this.fetchData();
  },
  computed: {
    selectGoods() {
      var _list = [];
      if (this.chartList) {
        this.chartList.forEach(v => {
          if (v.shopNum > 0) {
            _list.push({
              ...v,
              price: v.salePrice,
              userId: this.chartQueryList.userId,
              shopNum: v.shopNum
            });
          }
        });
      }

      return _list;
    }
  },
  methods: {
    fetchData() {
      this.chartQueryList.userId = JSON.parse(sessionStorage.getItem("userId"));
      getChart(this.chartQueryList).then(response => {
        if (response.data == null) {
          this.chartList = [];
        } else {
          this.chartList = response.data.list;
        }
        this._initScroll();
      });
      // 获取商家信息
      getBusiness().then(response => {
        this.business = response.data;
        
        if (this.chartList) {
          this.chartList.forEach(item => {
            this.business.forEach(v => {
              if (item.businessCode == v.businessCode) {
                var key = "busName";
                item[key] = v.businessName;
              }
            });
          });
        }

      });
    },

    // 初始化滚动
    _initScroll() {
      this.$nextTick(() => {
        this.chartScroll = new BScroll(this.$refs.chart, {
          click: true,
          scrollY: true
        });
      });
    },
    handleDetail(good) {
      var _params = {
        skuCode: good.skuCode
      };
      getGoodDetail(_params).then(response => {
        this.currentGood = response.data;
        this.GoodDetailVisible = true;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.chart {
  position: absolute;
  left: 0;
  top: 48px;
  right: 0;
  bottom: 60px;
  overflow: hidden;
  display: flex;
  background-color: rgba($color: #ccc, $alpha: 0.2);
  .goods-wrapper {
    width: 100%;
    position: relative;
    bottom: 25px;
    ul {
      position: absolute;
    }
  }
}
.good-item {
  display: flex;
  padding: 10px;
  margin: 18px;
  border-bottom: 1px solid #ccc;
  justify-content: space-around;
  align-items: center;
  border-radius: 4px;
  background-color: white;
  &:last-child {
    border: none;
    margin-bottom: 0;
  }
  .icon {
    flex-basis: 80px;
    height: 100px;
    margin-right: 0.75rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .content {
    flex: 1;
    overflow: hidden;
    position: relative;
    text-align: left;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    .name {
      font-size: 1rem;
      font-weight: bold;
      word-break: break-all;
      height: 2.5rem;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2; //2行
      -webkit-box-orient: vertical;
    }
    .datetime {
      font-size: 0.85rem;
      padding: 0.25rem 0;
    }
    .price {
      font-size: 1rem;
      color: red;
      font-weight: bolder;
      margin-bottom: 0;
    }
    .control {
      position: absolute;
      right: 0;
      bottom: 0;
      // width: 4rem;
    }
  }
}
</style>