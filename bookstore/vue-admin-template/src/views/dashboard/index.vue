<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <el-row :gutter="20" class="panel-group">
        <el-col :span="6">
          <div class="card-panel" @click="changeUrl('/appUser/index')">
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="member" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">会员数</div>
              <div class="card-panel-num">{{memberTotal}}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="card-panel" @click="changeUrl('/order/index')">
            <div class="card-panel-icon-wrapper icon-message">
              <svg-icon icon-class="orderTotal" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">订单数</div>
              <div class="card-panel-num">{{ordersTotal}}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="card-panel" @click="changeUrl('/order/index')">
            <div class="card-panel-icon-wrapper icon-money">
              <svg-icon icon-class="money" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">成交金额</div>
              <div class="card-panel-num">{{moneyTotal}}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="card-panel" @click="changeUrl('/goods/index')">
            <div class="card-panel-icon-wrapper icon-goods">
              <svg-icon icon-class="allGoods" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">商品数</div>
              <div class="card-panel-num">{{goodsTotal}}</div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <div class="ordertitle">各分类销量</div>
          <div :class="className" :style="{height:height,width:width}" ref="bar"/>
        </el-col>
        <el-col :span="12">
          <div class="ordertitle">近七日增长</div>
          <div :class="className" :style="{height:height,width:width}" ref="line"/>

        </el-col>
       
      </el-row>
      <el-row>
        <el-col :span="18">
          <div class="ordertitle">最近订单</div>
          <el-table :data="orderData" style="width:100%">
            <el-table-column prop="orderCode" label="订单号" width="250" align="center"></el-table-column>
            <el-table-column prop="orderAmount" label="订单总价" width="120">
              <template slot-scope="scope">¥{{scope.row.orderAmount}}</template>
            </el-table-column>
            <!-- 订单状态 -->
            <el-table-column label="订单状态" width="150" align="center">
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.orderStatus|orderTypeFilter"
                >{{ scope.row.orderStatus|orderStatusFilter }}</el-tag>
              </template>
            </el-table-column>
            <!-- 订单状态 -->
            <el-table-column label="创建时间" width="300" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.createdTime|dateTimeFilter }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :span="6">
          <div class="ordertitle">团队成员</div>
          <div class="group">
            <span class="group_title">前端<i class="tip">（点击姓名跳转到基本信息）</i></span>
            
            <span class="group_content front" @click="changeUrl('userInfo/index')">张培超</span>
           
            
          </div>
           <div class="group">
            <span class="group_title">后端<i class="tip">（点击功能跳转到相应模块）</i></span>
            <span class="group_content">孙博文 —— <i></i>、<i @click="changeUrl('category/index')"></i></span>
            <span class="group_content">胡御恒 —— <i @click="changeUrl('goods/index')"></i>、<i @click="changeUrl('banner/index')"></i></span>
           
          </div>

        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getCount, getCateCount, getOrder,getIncrease } from "@/api/count";
import echarts from "echarts";
require("echarts/theme/macarons"); // echarts theme
import resize from "@/components/Resize";
import moment from "moment";

const animationDuration = 6000;
// 订单状态码表
var orderStatusMap = [
  {
    text: "已下单",
    tag: ""
  },
  {
    text: "已发货",
    tag: "success"
  },
  {
    text: "未评价",
    tag: "warning"
  },
  {
    text: "已完成",
    tag: "info"
  },
  {
    text: "已取消",
    tag: "danger"
  }
];
export default {
  name: "Dashboard",
  filters: {
    // 订单状态
    orderStatusFilter(code) {
      return orderStatusMap[parseInt(code)].text;
    },
    orderTypeFilter(code) {
      return orderStatusMap[parseInt(code)].tag;
    },
    // 时间格式化
    dateTimeFilter(datetime) {
      if (datetime) {
        return moment(datetime).format("YYYY/MM/DD hh:mm:ss");
      }
    }
  },
  data() {
    return {
      moneyTotal: "",
      ordersTotal: "",
      memberTotal: "",
      goodsTotal: "",
      chart: null,
      cateData: null,
      orderData: [],
      front:['蒙婷','李健','罗鑫'],
      datas:null,
      chart2:null,
      increseData:null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  },
  beforeDestroy() {
    if (!this.chart ||!this.chart2) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
    this.chart2.dispose();
    this.chart2 = null;
  },
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "300px"
    }
  },
  created() {
    this.fetchData();
    this.fetchOrder();
  },
  methods: {
    // 面板数据
    fetchData() {
      getCount().then(response => {
        var data = response.data;
        this.moneyTotal = data.moneyTotal;
        this.ordersTotal = data.ordersTotal;
        this.memberTotal = data.memberTotal;
        this.goodsTotal = data.goodsTotal;
      });
    },
    // 最近订单
    fetchOrder() {
      getOrder().then(response => {
        this.orderData = response.data;
      });
    },
    changeUrl(url){
      this.$router.push(url)
    },
    group(arr,A_length){
      var index = 0;
      var newArray = [];
      while(index < arr.length) {
          newArray.push(arr.slice(index, index += A_length));
      }
      return newArray;
    },
    // 初始化pie图表
    initChart() {
      this.chart = echarts.init(this.$refs.bar, "macarons");
      this.chart2 = echarts.init(this.$refs.line, "macarons");

      getCateCount().then(response => {
        this.cateData = response.data;
        var _cateNames = [];
        var _totals = [];
        this.cateData.forEach(item => {
          _cateNames.push(item.cateName);
          _totals.push(item.total);
        });
        this.datas = this.cateData.map(item=>{
          return{
            value:item.total,
            name:item.cateName
          }
        })
        this.chart.setOption({
          //提示框，鼠标悬浮交互时的信息提示
          tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: _cateNames
        },
        series: [
          {
            name: '销量占比',
            type: 'pie',
            roseType: 'radius',
            // 一项是内半径，第二项是外半径
            radius: [15, 95],
            center: ['50%', '38%'],
            data: this.datas,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
        });
      });
      getIncrease().then(response=>{
        this.increseData = response.data;
        // console.log(this.increseData);
        var temp = null;
        var _values = Object.values(this.increseData);       
        // 日期 
        var _dates = [];
        // 所有的数据
        var _arr = [];
        // 已拆分的数据
        var _nums = [];
        _values[0].forEach(item=>{
          temp = moment(item.date).format("MM/DD");
          _dates.push(temp)
        })
        _values.forEach(item=>{
          item.forEach(v=>{
            if(v.total == null){
              v.total = 0
            }
            _arr.push(v.total)
          })
        })
        _nums = this.group(_arr,7)        
        this.chart2.setOption({
          xAxis: {
          data: _dates,
          boundaryGap: false,
          axisTick: {
            show: false
          }
            },
            grid: {
              left: 10,
              right: 10,
              bottom: 20,
              top: 30,
              containLabel: true
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'cross'
              },
              padding: [5, 10]
            },
            yAxis: {
              axisTick: {
                show: false
              }
            },
            legend: {
              data: ['商品','订单','金额','会员'],
              selected:{
                '商品':true,
                '订单':true,
                '金额':false,
                '会员':true,
              }

            },
            series: [{
              name:'商品', itemStyle: {
                normal: {
                  color: '#FF005A',
                  lineStyle: {
                    color: '#FF005A',
                    width: 2
                  }
                }
              },
              
              type: 'line',
              data: _nums[0],
              animationDuration: 2800,
              animationEasing: 'cubicInOut'
            },
            {
              name: '订单',
              
              type: 'line',
              itemStyle: {
                normal: {
                  color: '#40c9c6',
                  lineStyle: {
                    color: '#40c9c6',
                    width: 2
                  },
                  areaStyle: {
                    color: '#f3f8ff'
                  }
                }
              },
              data: _nums[1],
              animationDuration: 2800,
              animationEasing: 'quadraticOut'
            },
            {
              name: '金额',
              type: 'line',
              itemStyle: {
                normal: {
                  color: '#3888fa',
                  lineStyle: {
                    color: '#3888fa',
                    width: 2
                  },
                  areaStyle: {
                    color: '#f3f8ff'
                  }
                }
              },
              data: _nums[2],
              animationDuration: 2800,
              animationEasing: 'quadraticOut'
            },
            {
              name: '会员',              
              type: 'line',
              itemStyle: {
                normal: {
                  color: 'rgb(182,162,222)',
                  lineStyle: {
                    color: 'rgb(182,162,222)',
                    width: 2
                  },
                  areaStyle: {
                    color: '#f3f8ff'
                  }
                }
              },
              data: _nums[3],
              animationDuration: 2800,
              animationEasing: 'quadraticOut'
            },
            ]
          });
        })
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
    .panel-group {
      margin-top: 18px;
      .card-panel-col {
        margin-bottom: 32px;
      }
      .card-panel {
        height: 108px;
        cursor: pointer;
        font-size: 12px;
        position: relative;
        overflow: hidden;
        color: #666;
        background: #fff;
        box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
        border-color: rgba(0, 0, 0, 0.05);
        .icon-people {
          color: #40c9c6;
        }
        .icon-message {
          color: #36a3f7;
        }
        .icon-money {
          color: #f4516c;
        }
        .icon-shopping {
          color: #34bfa3;
        }
        .icon-goods {
          color: pink;
        }
        .card-panel-icon-wrapper {
          float: left;
          margin: 14px 0 0 14px;
          padding: 16px;
          transition: all 0.38s ease-out;
          border-radius: 6px;
        }
        .card-panel-icon {
          float: left;
          font-size: 48px;
        }
        .card-panel-description {
          float: right;
          font-weight: bold;
          margin: 26px;
          margin-left: 0px;
          .card-panel-text {
            line-height: 18px;
            color: rgba(0, 0, 0, 0.45);
            font-size: 16px;
            margin-bottom: 12px;
          }
          .card-panel-num {
            font-size: 20px;
          }
        }
      }
    }
    /deep/.el-row {
      margin-bottom: 20px;
      .ordertitle {
        color: rgb(0, 140, 206);
        font-size: 20px;
      }
      .group{
        width:100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-direction: column;
        span{    
            .tip{
              font-size:14px;
              font-weight: normal;
              cursor:text;
            }     
            i{
              cursor: pointer;              
            }
           &.group_title{
            width:90%;
            text-align: left;
            font-size: 20px;
            color: cadetblue;
            font-weight: bold;
          }
          &.front{
            cursor: pointer;
          }
          &.group_content{
            width:80%;
            text-align: left;
            font-size: 17px;
            color:#40c9c6;
          }

        }
       
      }
      

      
    }
  }
 
}
</style>
