<template>
  <div class="goods">
    <AppHeader title="分类"></AppHeader>
    <!-- 左侧菜单 -->
    <div class="menu-wrapper" ref="mw">
      <ul>
        <li
          v-for="(item,index) in goods"
          :key="index"
          class="menu_item"
          :class="{'current':currentIndex === index}"
          @click="handleSelect(index,$event)"
        >
          <span class="text">{{item.cateName}}</span>
        </li>
      </ul>
    </div>
    <!-- 右侧商品 -->
    <div class="goods-wrapper" ref="gw">
      <ul>
        <li v-for="(item,index) in goods" :key="index" class="good_list" ref="goodList">
          <ul>
            <h1 class="title">{{item.cateName}}</h1>
            <!-- 没有商品展示 -->
            <div v-if="item.goods.length === 0" class="none">
              <span>暂无商品，敬请期待...</span>
            </div>
            <li
              v-for="(good,index) in item.goods"
              :key="index"
              class="goods_item"
              @click="handleSelectGood(good,$event)"
            >
              <!-- 图片 -->
              <div class="icon">
                <img :src="good.images[0]" alt />
              </div>
              <div class="content">
                <h2 class="name">{{good.skuName}}</h2>
                <div class="desc">{{good.skuIntroduction}}</div>
                <div class="price">
                  <span class="now">￥{{good.salePrice}}</span>
                  <span class="old">￥{{good.costPrice}}</span>
                  <span class="saleNum">销量:{{good.saleNum}}</span>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 商品详情 -->
    <GoodDetail :visible.sync="GoodDetailVisible" :good="currentGood" />
  </div>
</template>

<script>
import { getCate, getGoods, getGoodDetail } from "@/api";
import GoodDetail from "@/components/GoodDetail";
import BScroll from "better-scroll";
import AppHeader from "@/components/AppHeader";

export default {
  data() {
    return {
      goods: [],
      goodsQueryList: {
        pageNum: "1",
        pageSize: "100"
      },
      // 分类备份
      cateList: [],
      // 分类备份
      goodList: [],
      // currentIndex:0,
      scrollY: 0,
      // 存放每个分类商品高度的容器
      listHeight: [],
      // 商品详情
      // 弹窗可见性
      GoodDetailVisible: false,
      currentGood: {}
    };
  },
  components: {
    GoodDetail,
    AppHeader
  },
  computed: {
    // 动态计算商品类别
    currentIndex() {
      for (var i = 0; i < this.listHeight.length; i++) {
        var h1 = this.listHeight[i];
        var h2 = this.listHeight[i + 1];
        if (!h2 || (this.scrollY >= h1 && this.scrollY < h2)) {
          return i;
        }
      }
      return 0;
    }
  },
  created() {
    // 格式化数据
    this._initData();
    // this._otherinitData();
    this._initScroll();
  },
  methods: {
    //只要有类别 就展示
    _initData() {
      // 获取分类
      getCate()
        .then(response => {
          // 先保留一份
          this.cateList = response.data;
          console.log(this.cateList);
          
          // 只取出一级分类
          var A_cateList = response.data.reduce((acc, cur) => {
            var O_cate = {
              cateCode: cur.attribute.cateCode,
              cateName: cur.attribute.cateName,
              goods: []
            };
            acc.push(O_cate);
            return acc;
          }, []);
          // 将A_cateList返回同步请求
          return A_cateList;
        })
        .then(cateList => {
          // 复制一份
          var _cateList = [...cateList];
          getGoods(this.goodsQueryList).then(response => {
            // 先保留一份
            this.goodList = response.data.list;
            response.data.list.forEach(item => {
              for (var i = 0; i < cateList.length; i++) {
                if (
                  cateList[i].cateCode == item.firstCateCode &&
                  item.skuStatus == 0
                ) {
                  cateList[i].goods.push(item);
                }
              }
            });
            this.goods = cateList;
            // 在渲染之前计算每个商品的高度
            this.heightCalculation();
          });
        });
    },
    // 没有商品的分类不进行展示
    _otherinitData() {
      getGoods(this.goodsQueryList).then(response => {
        // 构造商品类别数组并去重
        var A_cateList = [];
        response.data.list.forEach(item => {
          A_cateList.push(item.firstCateCode);
        });
        //  去重
        var A_cateList = [...new Set(A_cateList)].map(code => {
          return {
            cateCode: code,
            cateName: "",
            goods: []
          };
        });
        // 逐个将商品分类到指定类别下
        this.goods = response.data.list.reduce((acc, cur) => {
          for (var i = 0; i < acc.length; i++) {
            // 如果有就添加在goods数组 里面
            if (acc[i].cateCode == cur.firstCateCode) {
              acc[i].cateName = cur.firstCateName;
              acc[i].goods.push(cur);
              continue;
            }
          }
          return acc;
        }, A_cateList);
        // 在渲染之前计算每个商品的高度
        this.heightCalculation();
      });
    },
    // 启动滚动插件
    _initScroll() {
      this.$nextTick(() => {
        // 初始化实例
        // 菜单滚动
        this.menuScroll = new BScroll(this.$refs.mw, {
          click: true
        });
        // 商品滚动
        this.goodScroll = new BScroll(this.$refs.gw, {
          click: true,
          //实时监听滚动位置1:不监听 2:合适的时候监听 3:实时监听
          probeType: 3
        });
        // 监听滚动事件
        this.goodScroll.on("scroll", pos => {
          // 记录每次滚动的Y值
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      });
    },
    // 点击分类跳转到相应
    handleSelect(index, event) {
      // 消除PC端的重复点击事件
      if (event._constracted) {
        return;
      }
      // 找到当前DOM
      var _el = this.$refs.goodList[index];
      // 使用Bs进行滚动
      this.goodScroll.scrollToElement(_el, 500);
    },
    // 点击商品显示详情
    handleSelectGood(good) {
      getGoodDetail({ skuCode: good.skuCode }).then(response => {
        this.currentGood = response.data;
        this.GoodDetailVisible = true;
      });
    },
    // 计算每个商品高度
    heightCalculation() {
      this.$nextTick(() => {
        // 获取每个商品的高度
        var DOM_goodList = this.$refs.goodList;
        // 初始化高度
        var height = 0;
        this.listHeight.push(height);
        // 将每个商品的高度push到listHeight
        for (var i = 0; i < DOM_goodList.length; i++) {
          height += DOM_goodList[i].clientHeight;
          this.listHeight.push(height);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.goods {
  // border:1px solid red;
  position: absolute;
  box-sizing: border-box;
  top: 48px;
  left: 0;
  bottom: 58px;
  overflow: hidden;
  display: flex;
  .menu-wrapper {
    flex: 0 0 100px;
    background-color: #fff;
    .menu_item {
      box-sizing: border-box;
      height: 54px;
      width: 84px;
      padding: 0 8px;
      text-align: left;
      font-size: 0;
      display: table;
      line-height: 1rem;
      .text {
        display: table-cell;
        width: 100%;
        font-size: 1rem;
        vertical-align: middle;
        border-bottom: 1px solid rgba($color: #000000, $alpha: 0.3);
        // padding-left:1rem
      }
      &:last-child .text {
        border: none;
      }

      &.current {
        position: relative;
        color: #c39862;
        background-color: #f6f6f6;
        margin-top: -1px;
        font-weight: bold;
        z-index: 9;
      }
    }
  }
  .goods-wrapper {
    overflow: hidden;
    flex: 1;
    box-sizing: border-box;
    .title {
      margin-left: 8px;
      padding-left: 1rem;
      height: 26px;
      line-height: 26px;
      font-size: 1rem;
      color: #aaa;
      font-weight: normal;
      border-left: #c8a272 4px solid;
      background-color: #f6f6f6;
    }
    .none {
      height: 100px;
      font-size: 20px;
      line-height: 100px;
      background: #fff;
    }
    .goods_item {
      display: flex;
      // padding-bottom: 8px;
      padding: 8px;
      border-bottom: rgb(196, 192, 192) 1px solid;
      margin: 8px;
      &:last-child {
        border: none;
      }
      .icon {
        flex-basis: 70px;
        img {
          width: 60px;
          height: 100px;
        }
      }
      .content {
        position: relative;
        flex-grow: 1;
        padding: 0 0.5rem;
        // height: 100px;
        .name {
          margin-bottom: 8px;
          font-size: 1rem;
          height: 1.2rem;
          line-height: 1.2rem;
          overflow: hidden;
          // white-space: nowrap;
        }
        .desc {
          max-height: 50px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3; //2行
          -webkit-box-orient: vertical;
          text-align: left;
          line-height: 1rem;
          font-size: 12px;
          opacity: 0.7;
          margin-bottom: 6px;
        }
        .price {
          text-align: left;
          font-size: 16px;
          .now {
            margin-right: 8px;
            font-size: 1.25rem;
            color: red;
          }
          .old {
            text-decoration: line-through;
            opacity: 0.7;
            font-size: 10px;
          }
          .saleNum {
            float: right;
          }
        }
      }
    }
  }
}
</style>