<template>
  <div class="app-container">
    <!-- 搜索条件 -->
    <div class="filter-container">
      <!-- 商品名称  过滤首尾空格-->
      <el-input
        class="filter-item"
        v-model="listQuery.skuName"
        placeholder="搜索商品名称"
        style="width:200px"
      ></el-input>
      <!-- 商品名称  过滤首尾空格-->
      <el-input
        class="filter-item"
        v-model="listQuery.skuAd"
        placeholder="搜索广告词"
        style="width:200px"
      ></el-input>
      <!-- 商品状态  可清空 -->
      <el-select v-model="listQuery.skuStatus" clearable placeholder="请选择商品状态" style="width:200px">
        <el-option
          v-for="(item,index) in skuStatusMapper"
          :key="item+index"
          :label="item"
          :value="index"
        ></el-option>
      </el-select>
      <!-- 查询按钮 -->
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>
    <!-- 搜索条件结束 -->
    <!-- 添加 -->
    <div class="operator-container">
      <el-button class="fitler-item" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
    </div>
    <!-- table主体 具备如下：
    等待动画
    数据绑定
    等待提示
    边框
    列宽度自适应
    高亮当前行
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
      <el-table-column align="center" label="#" width="60" type="index"></el-table-column>
      <!-- 商品附带展示是否已经被删除 -->
      <el-table-column label="商品名称" width="280" align="center">
        <template slot-scope="scope">
          <span class="cursor" @click="handleDetail(scope.row)">{{ scope.row.skuName }}</span>
          <el-tag
            type="info"
            effect="plain"
            v-if="scope.row.isDelete =='1'"
          >{{ scope.row.isDelete|isDeleteFilter }}</el-tag>
        </template>
      </el-table-column>
      <!-- 标点符号一定要是英文半角，显示金额右对齐比较好看 -->
      <el-table-column label="售价(¥)" width="70" align="right">
        <template slot-scope="scope">{{ scope.row.salePrice }}</template>
      </el-table-column>

      <el-table-column label="广告词" min-width="200" align="center">
        <template slot-scope="scope">{{ scope.row.skuAd }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="商品状态" width="120" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.skuStatus|typeFilter">{{ scope.row.skuStatus|skuStatusFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime|dateTimeFilter }}</span>
        </template>
      </el-table-column>
      <!-- 操作栏 根据当前行的不同状态进行操作过滤 多个按钮左对齐好看-->
      <el-table-column label="操作" width="270" align="left">
        <template slot-scope="scope">
          <!-- 编辑 -->
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <!-- 发布:在未发布的状态才有 -->
          <el-button
            v-if="scope.row.skuStatus=='2'"
            type="success"
            @click="handlePutaway(scope.row,'0')"
            size="mini"
          >发布</el-button>
          <!-- 下架 -->
          <el-button
            v-if="scope.row.skuStatus=='0'"
            @click="handlePutaway(scope.row,'1')"
            type="warning"
            size="mini"
          >下架</el-button>
          <!-- 删除 -->
          <el-button
            v-if="scope.row.isDelete !='1'"
            @click="handleDelete(scope.row)"
            type="danger"
            size="mini"
          >删除</el-button>
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
      :class="{'hidden':total<=listQuery.pageNum?true:false}"
      :limit.sync="listQuery.pageSize"
      :page.sync="listQuery.pageNum"
      :total="total"
      @pagination="fetchData"
    />
    <!-- 添加、编辑商品弹窗 -->
    <!-- 向上传递得加sync -->
    <AddOrEditDialog
      :addFormVisible.sync="addFormVisible"
      :addFormStatus="addFormStatus"
      @fetch="fetchData"
      :updateGoods="currentRow"
      @fakeAddGoods="fakeAddGoods"
      @fakeUpdateGoods="fakeUpdateGoods"
    ></AddOrEditDialog>

    <!-- 商品详情弹窗 -->
    <el-dialog title="商品详情" :visible.sync="detailFormVisible" style="width:100%" width="60%">
      <!-- 商品信息表格 -->
      <el-table v-loading="listLoading" :data="goodsFormInfo" style="width: 100%">
        <!-- 可折叠 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="是否删除">
                <span>
                  <el-tag
                    type="info"
                    effect="plain"
                    v-if="props.row.isDelete =='1'"
                  >{{ props.row.isDelete| isDeleteFilter }}</el-tag>
                  <el-tag
                    type="success"
                    effect="plain"
                    v-if="props.row.isDelete =='0'"
                  >{{ props.row.isDelete| isDeleteFilter }}</el-tag>
                </span>
              </el-form-item>
              <el-form-item class-name="status-col" label="商品状态" align="left">
                <span>
                  <el-tag
                    :type="props.row.skuStatus|typeFilter"
                  >{{ props.row.skuStatus|skuStatusFilter}}</el-tag>
                </span>
              </el-form-item>
              <el-form-item label="商品介绍" align="left" style="width:80%;">
                <span>{{ props.row.skuIntroduction }}</span>
              </el-form-item>
              <el-form-item label="广告词" align="left" style="width:50%;">
                <span>{{ props.row.skuAd }}</span>
              </el-form-item>
              <el-form-item label="书号" style="width:50%;">
                <span>{{ props.row.isbn }}</span>
              </el-form-item>

              <el-form-item label="一级分类代码" style="width:50%;">
                <span>{{ props.row.firstCateCode }}</span>
              </el-form-item>

              <el-form-item label="二级分类代码" style="width:50%;">
                <span>{{ props.row.secondCateCode }}</span>
              </el-form-item>
              <el-form-item label="一级分类名称">
                <span>{{ props.row.firstCateName }}</span>
              </el-form-item>
              <el-form-item label="二级分类名称">
                <span>{{ props.row.secondCateName }}</span>
              </el-form-item>
              <el-form-item label="商品编码" label-width="80" align="left">
                <span>{{ props.row.skuCode}}</span>
              </el-form-item>

              <el-form-item label="上架时间">
                <span>{{ props.row.saleTime|dateTimeFilter }}</span>
              </el-form-item>
              <el-form-item label="创建人" align="left">
                <span>{{ props.row.createdBy }}</span>
              </el-form-item>
              <el-form-item align="left" prop="created_at" label="创建时间">
                <span>{{ props.row.createdTime|dateTimeFilter }}</span>
              </el-form-item>
              <el-form-item label="更新人" align="left">
                <span>{{ props.row.updatedBy }}</span>
              </el-form-item>
              <el-form-item align="left" prop="created_at" label="更新时间">
                <span>{{ props.row.updatedTime|dateTimeFilter }}</span>
              </el-form-item>
              <!-- 图片 -->
              <el-form-item label="图片" style="width:100%">
                <el-image
                  v-for="(item,index) in props.row.images"
                  :key="item+index"
                  :src="item"
                  alt="图片+index"
                  :preview-src-list="props.row.images"
                  style="width:20%;margin-left:5px"
                />
                <!-- 展示图片的弹窗 -->
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt />
                </el-dialog>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column min-width="150" label="商品名称" prop="skuName"></el-table-column>
        <el-table-column label="销售数量" prop="saleNum"></el-table-column>
        <el-table-column label="库存" prop="storeNum"></el-table-column>
        <el-table-column label="定价(¥)" prop="costPrice"></el-table-column>
        <el-table-column label="售价(¥)" prop="salePrice"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  getList,
  getGoodsDetail,
  deleteGood,
  uploadImage,
  updateGoodsStatus
} from "@/api/goods";
import { getCate } from "@/api/cate";
import AddOrEditDialog from "./AddOrEditDialog";
import Pagination from "@/components/Pagination";
import { formatTime, parseTime } from "@/utils/index";
import moment from "moment";

// 码表
// 商品状态码表
var skuStatusMapper = ["在售", "已下架", "未发布"];
var infos = [];
export default {
  components: {
    Pagination,
    AddOrEditDialog
  },
  filters: {
    // 商品状态名称
    skuStatusFilter(status) {
      return skuStatusMapper[parseInt(status)];
    },
    // 商品状态样式
    typeFilter(status) {
      const statusTypeMap = ["success", "danger", "info"];
      return statusTypeMap[parseInt(status)];
    },
    // 是否删除
    isDeleteFilter(status) {
      const statusMap = ["正常", "已删除"];
      // console.log(statusMap[parseInt(status)]);
      return statusMap[parseInt(status)];
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
      list: null,
      fileList: [],
      fileImg: [],
      //商品详情
      goodsFormInfo: [],
      listLoading: true,
      headers: {},
      // 分页
      total: 10,
      hidden: false,
      // 查询条件
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        //可增加其他搜索条件
        // 避免为空时传给后台
        skuName: undefined,
        skuStatus: undefined,
        skuAd: undefined
      },
      skuStatusMapper,
      // 添加弹窗的数据
      // 弹窗状态
      addFormStatus: "",
      // 弹窗可见性
      addFormVisible: false,
      // 弹窗可见性
      detailFormVisible: false,
      currentRow: null,
      // 图片上传
      dialogImageUrl: "",
      dialogVisible: false
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
    // 点击添加处理
    handleCreate() {
      this.addFormStatus = "create";
      this.addFormVisible = true;
    },
    // 编辑按钮
    handleUpdate(row) {
      var _parma = {
        skuCode: row.skuCode
      };
      // 调用详情接口
      getGoodsDetail(_parma).then(response => {
        this.currentRow = response.data;
        // 改变弹窗状态
        this.addFormStatus = "update";
        this.addFormVisible = true;
      });
    },
    // 显示商品详情
    handleDetail(row) {
      this.goodsFormInfo = [];
      var _parma = {
        skuCode: row.skuCode
      };
      getCate()
        .then(response => {
          var cateData = response.data;
          // console.log(cateData);
          // 将类别数据初始化
          var cates = cateData.reduce((acc, cur) => {
            var _children = [];
            if (cur.childNodes) {
              cur.childNodes.forEach(item => {
                _children.push({
                  label: item.attribute.cateName,
                  value: item.attribute.cateCode
                });
              });
            }
            acc.push({
              label: cur.attribute.cateName,
              value: cur.attribute.cateCode,
              children: _children
            });
            return acc;
          }, []);
          return cates;
        })
        .then(cates => {
          var _cates = [...cates];
          getGoodsDetail(_parma).then(response => {
            _cates.forEach(item => {
              if (item.value == response.data.firstCateCode) {
                response.data.firstCateName = item.label;
              }
              item.children.forEach(i => {
                if (i.value == response.data.secondCateCode) {
                  response.data.secondCateName = i.label;
                }
              });
            });
            this.goodsFormInfo.push(response.data);
            // 改变弹窗状态
            this.detailFormVisible = true;
          });
        });
    },
    // 删除商品
    handleDelete(row) {
      var _parma = {
        skuCode: row.skuCode,
        loginAccount: JSON.parse(sessionStorage.getItem("loginAccount"))
      };
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteGood(_parma).then(response => {
            this.fetchData();
            this.$notify({
              title: "成功",
              message: response.msg,
              type: "success"
            });
          });
        })
        .catch(() => {
          this.$notify({
            title: "取消",
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 发布
    handlePutaway(row, status) {
      var _parma = {
        skuCode: row.skuCode,
        skuStatus: status,
        loginAccount: JSON.parse(sessionStorage.getItem("loginAccount"))
      };
      // 调用商品状态接口
      updateGoodsStatus(_parma).then(response => {
        this.fetchData();
        this.$notify({
          title: "成功",
          message: response.msg,
          type: "success"
        });
      });
    },
    fakeAddGoods(goodData) {
      this.list.unshift(goodData);
    },
    fakeUpdateGoods(data) {
      this.list.forEach(item => {
        // 使用商品的唯一标识
        if (item.skuCode === data.skuCode) {
          var _index = this.list.indexOf(item);
          // 对数组指定位置的元素进行替换
          this.list.splice(_index, 1, data);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__header {
  background-color: #edf1f5;
}
/deep/ .el-dialog__title {
  color: #516673;
  font-weight: 600;
}
.filter-container {
  // height: 100px;
  // border: 1px solid red;
  padding: 5px 0 20px 0;
}
.operator-container {
  margin-bottom: 7px;
}
.cursor {
  cursor: pointer;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 80px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
