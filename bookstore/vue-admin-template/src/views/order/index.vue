<template>
  <div class="app-container">
    <!-- 搜索条件 -->
    <div class="filter-container">
      <el-form class="filter-form" :model="listQuery" ref label-width="100px">
        <el-row>
          <el-col :span="6">
            <el-form-item label="下单姓名">
              <el-input
                class="filter-item"
                v-model="listQuery.orderOwnerName"
                clearable
                placeholder="搜索下单人姓名"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- 搜索订单号  可清空 -->
          <el-col :span="6">
            <el-form-item label="订单编号">
              <el-input
                label="订单号"
                class="filter-item"
                v-model="listQuery.orderCode"
                clearable
                placeholder="搜索订单号"
                style="width:100%;"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- 搜索手机号  可清空 -->
          <el-col :span="6">
            <el-form-item label="下单手机号">
              <el-input
                label="手机号"
                class="filter-item"
                v-model="listQuery.phoneNum"
                clearable
                placeholder="搜索手机号"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- 订单状态  可清空 -->
          <el-col :span="6">
            <el-form-item label="订单状态">
              <el-select
                label="订单状态"
                v-model="listQuery.orderStatus"
                clearable
                placeholder="请选择"
                style="width:100%"
              >
                <el-option
                  v-for="(item,index) in orderStatusMap"
                  :key="item+index"
                  :label="item.text"
                  :value="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="订单时间">
              <el-col :span="11">
                <el-date-picker
                v-model="listQuery.orderStartTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="开始时间"
                style="width:100%;"></el-date-picker>
              </el-col>
              <el-col :span="2" style="text-align:center;">至</el-col>
              <el-col :span="11">
                <el-date-picker
                v-model="listQuery.orderEndTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="结束时间"
                style="width:100%;"></el-date-picker>
              </el-col>              
            </el-form-item>
          </el-col>
          <el-col :span="8" class="filter-button">
            <!-- 查询按钮 -->
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="handleFilter"
            >查询</el-button>
            <!-- 重置按钮 -->
            <el-button class="filter-item" icon="el-icon-refresh" @click="handleReset">重置</el-button>
          </el-col>

        </el-row>
      </el-form>
    </div>
    <!-- 搜索条件结束 -->

    <!-- table主体 具备如下：
    等待动画
    数据绑定
    等待提示
    边框
    列宽度自适应
    高亮当前行
    隔行变色
    -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中..."
      border
      fit
      highlight-current-row
      style="width:100%"
    >
      <el-table-column align="center" label="#" width="80" type="index"></el-table-column>
      <!-- 订单号 -->
      <el-table-column label="订单编号" width="220" align="center" prop="orderCode"></el-table-column>
      <!-- 下单人id -->
      <el-table-column label="下单姓名" width="120" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.orderOwnerName }}</span>
          <el-tag type="info" v-if="scope.row.IsDelete =='1'">{{scope.row.IsDelete | delFilter}}</el-tag>
        </template>
      </el-table-column>
      <!-- 订单总价 -->
      <el-table-column label="订单总价" width="120" align="right" prop="orderAmount"></el-table-column>
      <!-- 下单手机号 -->
      <el-table-column label="下单手机号" width="160" align="center" prop="phoneNum"></el-table-column>

      <!-- 订单状态 -->
      <el-table-column label="订单状态" width="120" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.orderStatus|orderTypeFilter"
          >{{ scope.row.orderStatus|orderStatusFilter }}</el-tag>
        </template>
      </el-table-column>
      <!-- 下单时间 -->
      <el-table-column label="下单时间" width="220" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime|timeFilter }}</span>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleDetail(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- table主体结束 -->
    <!-- 分页 -->
    <!-- 每页显示多少个
        当前页
        总条数
        触发方法
    -->
    <Pagination
      :limit.sync="listQuery.pageSize"
      :page.sync="listQuery.pageNum"
      :total="total"
      @pagination="fetchData"
      v-show="total>0"
    />
    <!-- 订单详情 -->
    <el-dialog class="logDetail" title="订单详情" :visible.sync="detailFormVisible" width="50%">
      <div v-for="(order,index) in orderList" :key="index" class="orders">
        <el-row>
          <el-col :span="3"></el-col>
          <el-col :span="5">
            <el-image style="width: 100px; height: 100px" :src="order.images[0]"></el-image>
          </el-col>

          <el-col :span="16">
            <el-row>
              <p class="detailLabel">商品名称</p>
              <p class="detailValue skuName">
                <span>{{order.skuName}}</span>
              </p>
            </el-row>
            <el-row>
              <p class="detailLabel">订单号</p>
              <p class="detailValue">{{order.orderCode}}</p>
            </el-row>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <p class="detailLabel">售价</p>
            <p class="detailValue">{{order.salePrice}}</p>
          </el-col>
          <el-col :span="12">
            <p class="detailLabel">定价</p>
            <p class="detailValue">
              <span>{{order.costPrice}}</span>
            </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <p class="detailLabel">总金额</p>
            <p class="detailValue">{{order.skuAmount}}</p>
          </el-col>
          <el-col :span="12">
            <p class="detailLabel">购买数量</p>
            <p class="detailValue">{{order.shopNum}}</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <p class="detailLabel">id</p>
            <p class="detailValue">
              <span>{{order.id}}</span>
            </p>
          </el-col>
          <el-col :span="12">
            <p class="detailLabel">商品编码</p>
            <p class="detailValue">
              <span>{{order.skuCode}}</span>
              <el-tag type="warning" v-if="order.IsDelete == '1'">{{order.IsDelete|delFilter}}</el-tag>
            </p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <p class="detailLabel">创建人</p>
            <p class="detailValue">
              <span>{{order.createdBy}}</span>
            </p>
          </el-col>

          <el-col :span="12">
            <p class="detailLabel">创建时间</p>
            <p class="detailValue">{{order.createdTime|dateTimeFilter}}</p>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <p class="detailLabel">更新人</p>
            <p class="detailValue">
              <span>{{order.updatedBy}}</span>
            </p>
          </el-col>
          <el-col :span="12">
            <p class="detailLabel">更新时间</p>
            <p class="detailValue">{{order.updatedTime|dateTimeFilter}}</p>
          </el-col>
        </el-row>
      </div>
      <el-footer slot="footer" style="height:32px;">
        <el-button type="primary" size="small" @click="detailFormVisible = false">关闭</el-button>
      </el-footer>
    </el-dialog>
  </div>
</template>

<script>
import { getList, getOrderDetail } from "@/api/order";
import moment from "moment";
import Pagination from "@/components/Pagination";

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
  name: "order",
  components: {
    Pagination
  },
  filters: {
    // 删除标记
    delFilter(code) {
      var delMap = ["正常", "已删除"];
      return delMap[parseInt(code)];
    },
    // 订单状态
    orderStatusFilter(code) {
      return orderStatusMap[parseInt(code)].text;
    },
    orderTypeFilter(code) {
      return orderStatusMap[parseInt(code)].tag;
    },
    // 支付状态
    payFilter(code) {
      var payMap = ["未支付", "已支付"];
      return payMap[parseInt(code)];
    },
    // 支付状态样式
    payTypeFilter(code) {
      var payType = ["warning", "success"];
      return payType[parseInt(code)];
    },
    // 时间格式化
    dateTimeFilter(datetime) {
      if (datetime) {
        return moment(datetime).format("l");
      }
    },
    timeFilter(time){
      if(time){
        return moment(time).format("YYYY/MM/DD hh:mm:ss")
      }
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      // 订单状态码表
      orderStatusMap: orderStatusMap,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        // 下单人姓名
        orderOwnerName: undefined,
        // 订单编码
        orderCode: undefined,
        // 订单状态
        orderStatus: undefined,
        // 电话号码
        phoneNum: undefined,
        orderStartTime:undefined,
        orderEndTime:undefined
      },
      //订单详情
      orderList: {},
      // 弹窗可见性
      detailFormVisible: false
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      getList(this.listQuery).then(response => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.listQuery.pageNum = parseInt(response.data.pageNum);
        this.listQuery.pageSize = parseInt(response.data.pageSize);
        this.listLoading = false;
      });
    },
    // 订单详情
    handleDetail(row) {
      var _params = {
        orderCode: row.orderCode
      };
      getOrderDetail(_params).then(response => {
        this.orderList = response.data;
        // 改变弹窗状态
        this.detailFormVisible = true;
      });
    },
    // 查询
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.fetchData();
    },
    // 重置
    handleReset() {
      this.listQuery = Object.assign(this.listQuery, {
        pageNum: 1,
        pageSize: 10,
        // 下单人姓名
        orderOwnerName: undefined,
        // 订单编码
        orderCode: undefined,
        // 订单状态
        orderStatus: undefined,
        // 电话号码
        phoneNum: undefined
      });
      this.fetchData();
    }
  }
};
</script>

<style lang="scss" scoped>
.filter-container {
  padding: 5px 0 20px 0;
}
.filter-button {
  margin-left: 35px;
}
.detailInfo {
  width: 49%;
  display: inline-block;
  font-size: 14px;
}
.orders {
  border-bottom: 1px solid #ccc;
  margin-bottom: 30px;
  &:last-child {
    border: none;
    margin-bottom: 0;
  }
}
// 订单详情弹窗
/deep/ .el-dialog__header {
  background-color: #edf1f5;
}
/deep/ .el-dialog__title {
  color: #516673;
  font-weight: 600;
}
/deep/.detailLabel {
  font-weight: bold;
  color: #516673;
  font-size: 15px;
  margin: 8px;
}
/deep/.detailValue {
  padding-left: 35px;
  margin: 7px;
  font-size: 15px;
  background-color: #f7f8fa;
  height: 38px;
  line-height: 38px;
  border-radius: 10px;
}
/deep/.skuName {
  height: auto;
  padding: 0 20px;
}
/deep/.el-dialog__body {
  padding: 20px 20px 10px;
}
/deep/.el-dialog__footer {
  padding: 10px;
}
.detailImg /deep/.el-image {
  padding: 7px;
}
.detailImg .el-image /deep/.el-image__inner {
  height: 110px;
  border-radius: 7px;
}
</style>
