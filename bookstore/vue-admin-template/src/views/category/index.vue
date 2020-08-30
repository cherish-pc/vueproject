<template>
  <div class="app-container">
    <el-row class="marginBott">
      <el-col>
        <el-button type="primary" size="small" @click="handleAdd">添加</el-button>
        <el-button size="small" @click="deleteCate">删除</el-button>

        <el-button size="small" @click="resetChecked">清空</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="6">
        <el-tree
          :data="cateData"
          show-checkbox
          default-expand-all
          node-key="nodeId"
          ref="tree"
          highlight-current
          :props="defaultProps"
          @node-click="handleNodeClick"
          check-strictly
        />
      </el-col>
      <el-col :span="18">
        <el-card>
          <div slot="header">
            <span>商品类别</span>
            <el-button type="text" style="float:right;padding:3px 0;" @click="edit">编辑</el-button>
          </div>
          <!-- 商品类别详情 -->
          <el-form
            class="detail"
            ref="form"
            :model="form"
            :rules="formRules"
            label-width="110px"
            :disabled="formStatus =='info'"
          >
            <el-form-item label="商品分类名称" style="width:49%" prop="cateName">
              <el-input v-model="form.cateName"></el-input>
            </el-form-item>
            <el-form-item label="id" prop="id" style="width:49%">
              <el-input v-model="form.id"></el-input>
            </el-form-item>
            <el-form-item label="商品分类编码" prop="cateCode" style="width:100%">
              <el-input v-model="form.cateCode"></el-input>
            </el-form-item>
            <el-form-item label="父级分类编码" prop="parentCateCode" style="width:100%">
              <el-input v-model="form.parentCateCode" disabled></el-input>
            </el-form-item>

            <el-form-item label="备注" style="width:49%">
              <el-input v-model="form.remark"></el-input>
            </el-form-item>
            <el-form-item label="删除标记" style="width:49%">
              <el-input v-model="form.isDelete" disabled></el-input>
            </el-form-item>
            <el-form-item label="创建人" style="width:49%">
              <el-input v-model="form.createdBy" disabled></el-input>
            </el-form-item>
            <el-form-item label="创建时间" style="width:49%">
              <el-input v-model="form.createdTime" disabled></el-input>
            </el-form-item>
            <el-form-item label="更新人" style="width:49%">
              <el-input v-model="form.updatedBy" disabled></el-input>
            </el-form-item>
            <el-form-item label="更新时间" disabled style="width:49%">
              <el-input v-model="form.updatedTime" disabled></el-input>
            </el-form-item>
            <el-form-item v-if="formStatus =='edit'">
              <el-button @click="formStatus='info'">取消</el-button>
              <el-button type="primary" @click="submit">确定</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <!-- 添加节点弹框 -->
    <el-dialog title="添加节点" :visible.sync="dialogFormVisible">
      <el-form :model="addForm" label-width="80">
        <el-form-item label="类别名称">
          <el-input v-model="addForm.cateName"></el-input>
        </el-form-item>
        <el-form-item label="父级节点编码">
          <el-input disabled v-model="addForm.frontCateCode"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addForm.remark" type="textarea" :rows="2" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCate,
  addCateGory,
  findCateGoryByCode,
  updateCateGory,
  deleteGory
} from "@/api/cate";
import moment from "moment";

// var cateId = 7;
export default {
  filters: {
    // 时间格式化
    dateTimeFilter(datetime) {
      if (datetime) {
        return moment(datetime).format("l");
      }
    }
  },
  data() {
    return {
      defaultProps: {
        children: "childNodes",
        label: data => data.attribute.cateName
      },
      cateData: [],
      // 商品类别详情
      form: {},
      // 校验
      formRules: {
        cateName: [
          {
            required: true,
            message: "请输入类别名称",
            trigger: "blur"
          }
        ],
        cateCode: [
          {
            required: true,
            message: "请输入商品分类编码",
            trigger: "blur"
          }
        ],
        parentCateCode: [
          {
            required: true,
            message: "请输入父级分类编码",
            trigger: "blur"
          }
        ],
        id: [
          {
            required: true,
            message: "请输入商品分类id",
            trigger: "blur"
          }
        ],
        frontCateCode: [
          {
            required: true,
            message: "请选择商品分类级别",
            trigger: "change"
          }
        ]
      },
      // input是否禁用 info edit
      formStatus: "info",
      // 添加弹框可见性
      dialogFormVisible: false,
      addForm: {
        cateName: "",
        frontCateCode: "",
        remark: ""
      }
    };
  },
  created() {
    this.fetchData();
  },

  methods: {
    // 获取数据
    fetchData() {
      getCate().then(response => {
        this.cateData = response.data;
      });
    },
    // 点击节点显示内容
    handleNodeClick(nodeData) {
      // 变量映射
      var _param = {
        cateCode: nodeData.attribute.cateCode
      };
      findCateGoryByCode(_param).then(response => {
        
        // 重置表单状态
        this.formStatus = "info";
        // 复制一份
        var tempData = Object.assign({}, response.data);
        tempData.createdTime = moment(tempData.createdTime).format(
          "YYYY/MM/DD"
        );
        if (tempData.updatedTime) {
          tempData.updatedTime = moment(tempData.updatedTime).format(
            "YYYY/MM/DD"
          );
        }
        // 赋值
        this.form = tempData;
      });
    },
    // 编辑按钮
    edit() {
      // 改变状态
      this.formStatus = "edit";
    },
    // 确认
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          var _params = {
            cateCode: this.form.cateCode,
            id: this.form.id,
            cateName: this.form.cateName,
            frontCateCode: this.form.parentCateCode,
            remark: this.form.remark
          };
          // 调用更新接口
          updateCateGory(_params).then(response => {
            this.$notify({
              title: "成功",
              message: response.msg,
              type: "success"
            });
            // 重新请求数据
            this.fetchData();
            // 改变表单状态
            this.formStatus = "info";
          });
        } else {
          console.log(失败);
          return false;
        }
      });
    },
    // 添加类别
    createCate() {
      // 调用接口
      addCateGory(this.addForm).then(response => {
        this.$notify({
          title: "成功",
          message: response.msg,
          type: "success"
        });
        this.dialogFormVisible = false;
        // 清空表单
        this.addForm = {
          cateName: "",
          frontCateCode: "",
          remark: ""
          // level:''
        };
        // 重新请求数据
        this.fetchData();
      });
    },
    // 点击添加类别
    handleAdd() {
      // 获取当前点击节点
      var _curNode = this.$refs.tree.getCheckedNodes();
      // 选择多个节点
      if (_curNode.length > 1) {
        this.$message.error("选择的节点大于一个，请重选");
        return;
      }
      // 显示弹框
      // 没有节点
      if (_curNode.length === 0) {
        this.addForm.frontCateCode = "";
      } else {
        this.addForm.frontCateCode = _curNode[0].attribute.cateCode;
      }
      this.dialogFormVisible = true;
    },
    // 删除
    deleteCate() {
      // 获取当前节点
      var _curNode = this.$refs.tree.getCheckedNodes();
      // 只能选中一个
      if (_curNode.length !== 1) {
        this.$message.error("只能选择一个节点，请重选");
        return;
      }
      var _param = {
        cateCode: _curNode[0].attribute.cateCode
      };
      // 调用删除接口
      deleteGory(_param).then(response => {
        this.$notify({
          title: "成功",
          message: response.msg,
          type: "success"
        });
        this.fetchData();
      });
    },
    // 清空
    resetChecked() {
      this.$refs.tree.setCheckedKeys([]);
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__header,
/deep/ .el-card__header {
  background-color: #edf1f5;
}
/deep/ .el-dialog__title,
/deep/ .el-card__header:first-child {
  color: #516673;
  font-weight: 600;
}
.marginBott {
  margin: 0 0 5px 0;
}
.detail .el-form-item {
  display: inline-block;
}
</style>

