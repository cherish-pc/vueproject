<template>
  <div class="app-container">
    <!-- 搜索条件 -->
    <div class="filter-container">
      <el-form class="filter-form" :model="listQuery" ref label-width="100px">
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item label="面值">
               <!-- 面值  可清空 -->
              <el-input class="filter-item" v-model="listQuery.faceValue" clearable placeholder="请输入面值"></el-input>
            </el-form-item>          
          </el-col>
          <el-col :span="6">
            <!-- 卡密  过滤首尾空格-->
            <el-form-item label="卡密">
              <el-input
              label="卡密" 
              class="filter-item"
              v-model="listQuery.rechargeCardCode"
              clearable
              placeholder="卡密"
              ></el-input>
            </el-form-item>      
          </el-col>
          <el-col :span="6">
            <el-form-item label="使用状态">
              <!-- 商品状态  可清空 -->
              <el-select label="使用状态" v-model="listQuery.cardStatus" clearable placeholder="请选择使用状态">
                <el-option
                  v-for="(item,index) in cardStatusKeyValue"
                  :key="item+index"
                  :label="index"
                  :value="cardStatusKeyValue[index]"
                ></el-option>
              </el-select>
            </el-form-item>      
          </el-col>
        </el-row>
        <el-row :gutter="12">
          <el-col :span="6">
            <el-form-item label="剩余天数">
              <!-- 有效时长  过滤首尾空格-->
              <el-input
                class="filter-item"
                label="剩余天数" 
                v-model.number="listQuery.validDayNum"
                clearable
                placeholder="剩余天数"
              ></el-input>
            </el-form-item>      
          </el-col>
          <el-col :span="6">
            <el-form-item label="使用者">
              <!-- 使用者  可清空 -->
              <el-input label="使用者" class="filter-item" v-model="listQuery.updatedBy" clearable placeholder="使用者"></el-input>
            </el-form-item>      
          </el-col>
          <el-col :span="6">
            <el-form-item label="删除状态">
              <!-- 是否删除  可清空 -->
              <el-select label="删除状态" v-model="listQuery.isDelete" clearable placeholder="请选择删除状态">
                <el-option
                  v-for="(item,index) in deleteStatusMapper"
                  :key="item+index"
                  :label="item"
                  :value="index"
                ></el-option>
              </el-select>
            </el-form-item>      

          </el-col>
          <el-col :span="6">
            <!-- 查询按钮 -->
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              @click="handleFilter"
            >查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 搜索条件结束 -->
    <div class="operator-container">
      <el-button @click="toggleSelection()">取消选择</el-button>
      <el-button class="fitler-item" type="primary" icon="el-icon-plus" @click="handleCreate">生成</el-button>
      <el-button type="danger" @click="deleteData()">{{text}}</el-button>
      <el-checkbox v-model="checked" :change="showTips(checked)">永久删除</el-checkbox>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="id" width="60">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column prop="rechargeCardCode" label="卡密" width="200"></el-table-column>
      <el-table-column prop="faceValue" label="面值" width="80"></el-table-column>
      <el-table-column label="使用状态" width="120">
        <template slot-scope="scope">
          <span>
            <el-tag :type="scope.row.cardStatus|cardTypeFilter">{{ scope.row.cardStatus}}</el-tag>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="截至日期" min-width="180" align="center">
        <template slot-scope="scope">{{ scope.row.validUntilDate|timeFilter }}</template>
      </el-table-column>
      <el-table-column label="是否删除" width="120">
        <template slot-scope="scope">
          <span>
            <el-tag
              :type="scope.row.isDelete|deleteTypeFilter"
            >{{ scope.row.isDelete|deleteFilter }}</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="validDayNum" label="剩余天数" width="120"></el-table-column>
      <el-table-column prop="createdBy" label="生成者" width="150"></el-table-column>
      <el-table-column prop="updatedBy" label="使用者" width="150"></el-table-column>
    </el-table>

    <el-dialog title="新建卡密" :visible.sync="addFormVisible" width="30%">
      <el-form :rules="rules" ref="cardForm" label-width="100px" :model="cardFormTemp">
        <el-row>
          <el-col>
            <!-- 面值 -->
            <el-form-item label="面值" prop="faceValue" class="items">
              <el-input v-model.number="cardFormTemp.faceValue" />
              <span class="tips">面值在1~5000之间</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <!-- 数量 -->
            <el-form-item label="数量" prop="num" class="items">
              <el-input v-model.number="cardFormTemp.num" />
              <span class="tips">数量在1~20之间</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <!-- 数量 -->
            <el-form-item label="有效期" prop="validDayNum" class="items">
              <el-input v-model.number="cardFormTemp.validDayNum" />
              <span class="tips">有效时间在1~365之间</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 底部确定取消按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData()">确定</el-button>
      </div>
    </el-dialog>
    <!-- 分页 -->
    <Pagination
      :limit.sync="listQuery.pageSize"
      :page.sync="listQuery.pageNum"
      :total="total"
      @pagination="fetchData"
      v-show="total>0"
    />
  </div>
</template>

<script>
import { getList, addCard, deleteCard } from "@/api/recharge";
import Pagination from "@/components/Pagination";
import moment from "moment";
// var cardStatusMapper = ['有效','已使用','已过期','已删除'];
var deleteStatusMapper = ["未删除", "已删除"];
var cardStatusMapper = [
  {
    key: "0",
    value: "有效"
  },
  {
    key: "1",
    value: "已使用"
  },
  {
    key: "2",
    value: "已过期"
  },
  {
    key: "3",
    value: "已删除"
  }
];
var cardStatusKeyValue = cardStatusMapper.reduce((acc, cur) => {
  acc[cur.value] = cur.key;
  return acc;
}, {});

export default {
  filters: {
    timeFilter(time) {
      if (time) {
        return moment(time).format("YYYY/MM/DD hh:mm:ss");
      }
    },
    cardTypeFilter(status) {
      var typeMap = ["success", "primary", "warning", "danger"];
      return typeMap[parseInt(cardStatusKeyValue[status])];
    },
    deleteTypeFilter(status) {
      var typeMap = ["success", "danger"];
      return typeMap[parseInt(status)];
    },
    deleteFilter(code) {
      return deleteStatusMapper[parseInt(code)];
    }
  },
  data() {
    // 校验数量
    var checkNum = (rule, value, callback) => {
      if (value <= 0 || value > 20) {
        callback(new Error("数量在1~20之间"));
      } else {
        callback();
      }
    };
    // 校验有效期
    var checkDay = (rule, value, callback) => {
      if (value <= 0 || value > 365) {
        callback(new Error("有效期在1~365之间"));
      } else {
        callback();
      }
    };
    // 校验有效期
    var checkValue = (rule, value, callback) => {
      if (value <= 0 || value > 5000) {
        callback(new Error("面值在1~5000之间"));
      } else {
        callback();
      }
    };
    return {
      addFormVisible: false,
      cardStatusKeyValue,
      deleteStatusMapper,
      // 添加
      cardFormTemp: {
        faceValue: null,
        num: null,
        validDayNum: null,
        loginAccount: JSON.parse(sessionStorage.getItem("loginAccount"))
      },
      checked: false,
      text: "删除",
      total: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        rechargeCardCode: undefined,
        validDayNum: undefined,
        cardStatus: undefined,
        updatedBy: undefined,
        isDelete: undefined,
        faceValue: undefined
      },
      rules: {
        faceValue: [
          {
            required: true,
            message: "请输入面值",
            trigger: "blur"
          },
          {
            type: "number",
            message: "必须为数字",
            trigger: "blur"
          },
          {
            validator: checkValue,
            trigger: "blur"
          }
        ],
        num: [
          {
            required: true,
            message: "请输入数量",
            trigger: "blur"
          },
          {
            type: "number",
            message: "必须为数字",
            trigger: "blur"
          },
          {
            validator: checkNum,
            trigger: "blur"
          }
        ],
        validDayNum: [
          {
            required: true,
            message: "请输入有效期",
            trigger: "blur"
          },
          {
            type: "number",
            message: "必须为数字",
            trigger: "blur"
          },
          {
            validator: checkDay,
            trigger: "blur"
          }
        ]
      },
      tableData: [],
      multipleSelection: []
    };
  },
  components: {
    Pagination
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getList(this.listQuery).then(response => {
        if (response.data == null) {
          this.tableData = null;
        } else {
          this.tableData = response.data.list;
          this.total = response.data.total;
          this.listQuery.pageNum = parseInt(response.data.pageNum);
          this.listQuery.pageSize = parseInt(response.data.pageSize);
        }
      });
    },
    // 查询
    handleFilter() {
      this.listQuery.pageNum = 1;
      this.fetchData();
    },
    showTips(value) {
      if (value == true) {
        this.text = "永久删除";
        this.$message({
          message: "勾选后永久删除且不可恢复",
          type: "warning"
        });
      } else {
        this.text = "删除";
      }
    },
    // 取消选择
    toggleSelection() {
      this.$refs.multipleTable.clearSelection();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    handleCreate() {
      // 重置表单
      this.cardFormTemp = {
        faceValue: null,
        num: null,
        validDayNum: null,
        loginAccount: JSON.parse(sessionStorage.getItem("loginAccount"))
      };
      this.addFormVisible = true;
      // 禁用表单校验
      this.$nextTick(() => {
        // 在弹窗加载之初，不用进行校验
        this.$refs.cardForm.clearValidate();
      });
    },
    // 新增商品
    createData() {
      this.$refs.cardForm.validate(valid => {
        if (valid) {
          // 调用请求接口
          addCard(this.cardFormTemp).then(response => {
            // 关闭弹窗
            this.addFormVisible = false;
            this.fetchData();
            // 提示信息
            this.$notify({
              title: "成功",
              message: response.msg,
              type: "success",
              duration: 3000
            });
          });
        }
      });
    },
    // 删除
    deleteData() {
      var deletes = [];
      this.multipleSelection.forEach(item => {
        deletes.push({
          id: item.id
        });
      });
      var _params = {
        loginAccount: JSON.parse(sessionStorage.getItem("loginAccount")),
        rechargeCardIdVoList: deletes,
        isPhysicalDelete: this.checked + 0
      };

      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteCard(_params).then(response => {
             this.fetchData();
            this.$notify({
              title: "成功",
              message: response.msg,
              type: "success"
            });
          });
          this.checked = false;
        })
        .catch(() => {
          this.$notify({
            title: "取消",
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.filter-container {
  padding: 5px 0 10px 0;
  /deep/.el-row {
    margin-bottom: 20px;
  }
}
.operator-container {
  margin-bottom: 27px;
}
.items {
  position: relative;
  .tips {
    position: absolute;
    right: 5px;
    color: #c2c3c3;
  }
}
</style>