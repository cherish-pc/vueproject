<template>
  <div class="app-container">
    <!-- 搜索条件 -->
    <div class="filter-container">
      <!-- 商品名称  过滤首尾空格-->
      <el-input
        class="filter-item"
        v-model="listQuery.userAccount"
        clearable
        placeholder="用户账号"
        style="width:200px"
      ></el-input>
      <!-- 商品状态  可清空 -->
      <el-input
        class="filter-item"
        v-model="listQuery.userName"
        clearable
        placeholder="用户姓名"
        style="width:200px"
      ></el-input>
      <!-- 查询按钮 -->
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
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
      stripe
      style="width:100%"
    >
      <!-- 如果没有特殊要求，每条数据的id是不方便在前台展示的 -->
      <el-table-column align="center" label="#" width="60" type="index"></el-table-column>
      <!-- 账号 -->
      <el-table-column label="账号" width="150" align="left">
        <template slot-scope="scope">
          <span>{{ scope.row.userAccount }}</span>
          <el-tag type="info" v-if="scope.row.IsDelete =='1'">{{scope.row.IsDelete | delFilter}}</el-tag>
        </template>
      </el-table-column>
      <!-- 姓名 -->
      <el-table-column label="姓名" width="150" align="center" prop="userName"></el-table-column>
      <!-- 性别 -->
      <el-table-column label="性别" width="80" align="center">
        <template slot-scope="scope">{{ scope.row.userSex|sexFilter }}</template>
      </el-table-column>
      <!-- 邮箱 -->
      <el-table-column label="邮箱" width="250" align="center" prop="email"></el-table-column>
      <!-- 积分金额 -->
      <el-table-column label="积分金额" width="100" align="right" prop="score"></el-table-column>
      <!-- 创建人 -->
      <el-table-column label="创建人" align="center" width="150" prop="createdBy"></el-table-column>
      <!-- 创建时间 -->
      <el-table-column align="center" prop="created_at" label="创建时间" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime|dateTimeFilter }}</span>
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
      :class="{'hidden':total<listQuery.pageSize?true:false}"
      :limit.sync="listQuery.pageSize"
      :page.sync="listQuery.pageNum"
      :total="total"
      @pagination="fetchData"
    />
    <!-- 用户详情 -->
    <el-dialog class="logDetail" title="用户详情" :visible.sync="detailFormVisible" width="50%">
      <el-row>
        <el-col :span="12">
          <p class="detailLabel">用户id</p>
          <p class="detailValue">{{customer.id}}</p>
          <el-tag type="info" v-if="customer.IsDelete =='1'">{{customer.IsDelete | delFilter}}</el-tag>
        </el-col>
        <el-col :span="12">
          <p class="detailLabel">用户名</p>
          <p class="detailValue">
            <span>{{customer.userName}}</span>
            <el-tag type="warning" v-if="customer.IsDelete == '1'">{{customer.IsDelete|delFilter}}</el-tag>
          </p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <p class="detailLabel">账号</p>
          <p class="detailValue">
            <span>{{customer.userAccount}}</span>
          </p>
        </el-col>
        <el-col :span="12">
          <p class="detailLabel">性别</p>
          <p class="detailValue">{{customer.userSex|sexFilter}}</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <p class="detailLabel">手机号</p>
          <p class="detailValue">
            <span>{{customer.phone}}</span>
          </p>
        </el-col>
        <el-col :span="12">
          <p class="detailLabel">邮箱</p>
          <p class="detailValue">{{customer.email}}</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <p class="detailLabel">身份证</p>
          <p class="detailValue">
            <span>{{customer.idCard}}</span>
          </p>
        </el-col>
        <el-col :span="12">
          <p class="detailLabel">积分金额</p>
          <p class="detailValue">{{customer.score}}</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <p class="detailLabel">创建人</p>
          <p class="detailValue">
            <span>{{customer.createdBy}}</span>
          </p>
        </el-col>
        <el-col :span="12">
          <p class="detailLabel">创建时间</p>
          <p class="detailValue">{{customer.createdTime |dateTimeFilter}}</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <p class="detailLabel">更新人</p>
          <p class="detailValue">
            <span>{{customer.updatedBy}}</span>
          </p>
        </el-col>
        <el-col :span="12">
          <p class="detailLabel">更新时间</p>
          <p class="detailValue">{{customer.updatedTime|dateTimeFilter}}</p>
        </el-col>
      </el-row>
      <el-footer slot="footer" style="height:32px;">
        <el-button type="primary" size="small" @click="detailFormVisible = false">关闭</el-button>
      </el-footer>
    </el-dialog>
  </div>
</template>

<script>
import { getList, getCustomerDetail } from "@/api/user";
import Pagination from "@/components/Pagination";
import moment from "moment";
var sexMap = ["女", "男", "未知"];
export default {
  name: "appUser",
  components: {
    Pagination
  },
  filters: {
    // 删除标记
    delFilter(code) {
      var delMap = ["正常", "已删除"];
      return delMap[parseInt(code)];
    },
    // 性别
    sexFilter(status) {
      return sexMap[parseInt(status)];
    },
    adminFilter(code) {
      var adminMap = ["否", "是"];
      return adminMap[parseInt(code)];
    },
    // 时间格式化
    dateTimeFilter(datetime) {
      if (datetime) {
        return moment(datetime).format("l");
      }
    }
  },
  data() {
    return {
      list: [],
      listLoading: true,
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        //可增加其他搜索条件
        // 避免为空时传给后台
        userName: undefined,
        userAccount: undefined,
        // 是否是PC端用户，此页面用于展示app端用户
        isAdmin: "0"
      },
      // 性别
      sexMap,
      //用户详情
      customer: {},
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
    // 查询
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.fetchData();
    },
    // 显示商品详情
    handleDetail(row) {
      var _params = {
        id: row.id
      };
      getCustomerDetail(_params).then(response => {
        this.customer = response.data;
        // 改变弹窗状态
        this.detailFormVisible = true;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.filter-container {
  padding: 5px 0 20px 0;
}
.detailInfo {
  width: 49%;
  display: inline-block;
  font-size: 14px;
}
/deep/.el-dialog__header {
  background-color: #edf1f5;
}
/deep/.el-dialog__title {
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
  padding-left: 40px;
  margin: 7px;
  font-size: 15px;
  background-color: #f7f8fa;
  height: 38px;
  line-height: 38px;
  border-radius: 10px;
}
/deep/.el-dialog__footer {
  padding: 10px;
}
</style>
