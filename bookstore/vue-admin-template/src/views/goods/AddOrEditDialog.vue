<template>
  <el-dialog
    width="50%"
    :title="addFormStatus == 'create'?'新建商品':'编辑商品'"
    :visible.sync="visible"
    @close="closeDialog"
  >
    <!-- 商品添加表单 -->
    <el-form :rules="rules" ref="goodsForm" label-width="100px" :model="goodsFormTemp">
      <el-row>
        <el-col :span="24">
          <el-form-item label="商品名称" prop="skuName">
            <el-input
              v-model="goodsFormTemp.skuName"
              placeholder="请输入商品名称"
              maxlength="20"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <!-- 商品介绍 -->
          <el-form-item label="商品介绍">
            <el-input v-model="goodsFormTemp.skuIntroduction" type="textarea" rows="3" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <!-- 广告词 -->
          <el-form-item label="广告词" prop="skuAd">
            <el-input
              v-model="goodsFormTemp.skuAd"
              placeholder="请输入广告词"
              maxlength="20"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <!-- 书号 -->
          <el-form-item label="书号" prop="isbn">
            <el-input v-model.number="goodsFormTemp.isbn" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <!-- 分类 -->
          <el-form-item label="商品分类" prop="firstCateCode">
            <el-cascader
              v-model="cascader.value"
              :options="cascader.options"
              @change="handleCascaderChange"
              :props="{ checkStrictly: true }"
            ></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- 商家编码 -->
          <el-form-item label="商家编码" prop="businessCode">
            <el-select v-model="goodsFormTemp.businessCode">
              <el-option
                v-for="(item,index) in businessCodeMapper"
                :key="item.businessCode+index"
                :label="item.businessName"
                :value="item.businessCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <!-- 定价 -->
          <el-form-item label="定价" prop="costPrice">
            <el-input v-model.number="goodsFormTemp.costPrice" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <!-- 售价 -->
          <el-form-item label="售价" prop="salePrice">
            <el-input v-model.number="goodsFormTemp.salePrice" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <!-- 库存 -->
          <el-form-item label="库存" prop="storeNum">
            <el-input v-model.number="goodsFormTemp.storeNum" />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="addFormStatus == 'update'">
          <!-- 销售数量 -->
          <el-form-item label="销售数量" prop="saleNum">
            <el-input v-model.number="goodsFormTemp.saleNum" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-form-item label="商品状态" props="skuStatus">
            <el-radio-group v-model="goodsFormTemp.skuStatus">
              <el-radio :label="0">在售</el-radio>
              <el-radio :label="2">未发布</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <!-- 图片 -->
          <el-form-item label="图片">
            <el-upload
              action="http://w3n1043453.zicp.vip/goods/uploadImage"
              list-type="picture-card"
              :file-list="fileList"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :limit="5"
              :on-success="onSuccess"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <!-- 展示图片的弹窗 -->
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 底部确定取消按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="addFormStatus == 'create'?createData():updateData()">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createGood, updateGood, uploadImage, getBusiness } from "@/api/goods";
import { getCate } from "@/api/cate";
export default {
  name: "AddOrEditDialog",
  data() {
    return {
      visible: this.addFormVisible,
      goodsFormTemp: {
        skuName: "",
        costPrice: "",
        salePrice: "",
        frontCostPrice: "",
        frontSalePrice: "",
        saleNum: "0",
        isbn: "",
        firstCateCode: "",
        secondCateCode: "",
        skuAd: "",
        skuStatus: "0",
        visiteNum: "0",
        skuIntroduction: "",
        businessCode: "",
        storeNum: "0",
        images: []
      },
      // 级联下拉框
      cascader: {
        value: [],
        options: []
      },
      // 商家信息
      businessCodeMapper: [],
      // 展示已有图片
      fileList: [],
      // 图片上传
      dialogImageUrl: "",
      dialogVisible: false,
      rules: {
        skuName: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur"
          },
          {
            max: 20,
            message: "商品名称过长",
            trigger: "blur"
          }
        ],
        isbn: [
          {
            required: true,
            message: "请输入isbn码",
            trigger: "blur"
          }
        ],
        saleNum: [
          {
            required: true,
            message: "请输入销售数量",
            trigger: "blur"
          },
          {
            type: "number",
            message: "必须为数字",
            trigger: "blur"
          }
        ],
        firstCateCode: [
          {
            required: true,
            message: "请选择分类",
            trigger: "change"
          }
        ],
        skuStatus: [
          {
            required: true,
            message: "请选择商品状态",
            trigger: "change"
          }
        ],
        storeNum: [
          {
            required: true,
            message: "请输入库存",
            trigger: "blur"
          },
          {
            type: "integer",
            message: "请输入正确的数字",
            trigger: "blur"
          }
        ],
        visiteNum: [
          {
            required: true,
            message: "请输入浏览量",
            trigger: "blur"
          },
          {
            type: "integer",
            message: "请输入正确的数字",
            trigger: "blur"
          }
        ],
        businessCode: [
          {
            required: true,
            message: "请输入商家编码",
            trigger: "blur"
          }
        ],
        costPrice: [
          {
            required: true,
            message: "请输入定价",
            trigger: "blur"
          },
          {
            type: "number",
            message: "必须为数字",
            trigger: "blur"
          }
        ],
        salePrice: [
          {
            required: true,
            message: "请输入售价",
            trigger: "blur"
          },
          {
            type: "number",
            message: "必须为数字",
            trigger: "blur"
          }
        ],
        frontCostPrice: [
          {
            required: true,
            message: "请输入前台定价",
            trigger: "blur"
          },
          {
            type: "number",
            message: "必须为数字",
            trigger: "blur"
          }
        ],
        frontSalePrice: [
          {
            required: true,
            message: "请输入前台售价",
            trigger: "blur"
          },
          {
            type: "number",
            message: "必须为数字",
            trigger: "blur"
          }
        ]
      }
    };
  },
  props: {
    // 弹窗状态
    addFormStatus: {
      type: String,
      default: ""
    },
    // 弹窗可见性
    addFormVisible: {
      type: Boolean,
      default: false
    },
    // 编辑时父组件传递的数据
    updateGoods: {
      type: Object
    }
  },
  watch: {
    // 监控
    addFormVisible: function() {
      // 切换可见性
      this.visible = this.addFormVisible;
      this.handleCreate();

      if (this.addFormStatus == "update") {
        // 更新操作
        // 如果是更新，把数据绑定在表单上，获取的是接口中的详情
        // this.handleUpdate();
        this.cascader.value = [];
        this.goodsFormTemp = Object.assign({}, this.updateGoods);
        this.cascader.value.push(this.goodsFormTemp.firstCateCode);
        this.cascader.value.push(this.goodsFormTemp.secondCateCode);
        this.fileList = this.goodsFormTemp.images.reduce((acc, cur, index) => {
          acc.push({
            name: index,
            url: cur
          });
          return acc;
        }, []);
        // 禁用表单校验
        this.$nextTick(() => {
          // 在弹窗加载之初，不用进行校验
          this.$refs.goodsForm.clearValidate();
        });
      }
    }
  },
  methods: {
    // 关闭弹窗，向上传递可见性
    closeDialog() {
      this.$emit("update:addFormVisible", false);
    },
    // 在加载时获取码表信息
    // 点击添加处理
    handleCreate() {
      // 重置表单内容
      this.resetGoodsTemp();
      this.fileList = [];
      this.cascader.value = [];
      // 获取分类
      getCate().then(response => {
        var cateData = response.data;
        // console.log(cateData);

        // 将类别数据初始化
        this.cascader.options = cateData.reduce((acc, cur) => {
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
      });
      // 获取商家信息
      getBusiness().then(response => {
        this.businessCodeMapper = response.data;
      });
      // 禁用表单校验
      this.$nextTick(() => {
        // 在弹窗加载之初，不用进行校验
        this.$refs.goodsForm.clearValidate();
      });
    },
    // 新增商品
    createData() {
      this.$refs.goodsForm.validate(valid => {
        if (valid) {
          var goodData = {
            ...this.goodsFormTemp,
            frontCostPrice: this.goodsFormTemp.costPrice + "",
            frontSalePrice: this.goodsFormTemp.salePrice + "",
            // skuStatus:'0',
            saleNum: "0",
            isbn: this.goodsFormTemp.isbn + "",
            costPrice: this.goodsFormTemp.costPrice + "",
            salePrice: this.goodsFormTemp.salePrice + "",
            skuStatus: this.goodsFormTemp.skuStatus + "",
            storeNum: this.goodsFormTemp.storeNum + ""
          };
          // 调用请求接口
          createGood(goodData).then(response => {
            // 关闭弹窗
            this.closeDialog();
            // 重新请求数据
            this.$emit("fetch");
            // 提示信息
            this.$notify({
              title: "成功",
              message: response.msg,
              type: "success"
            });
          });
        }
      });
    },
    handleUpdate() {
      var tempData = Object.assign({}, this.updateGoods);
      this.cascader.value.push(tempData.firstCateCode);
      this.cascader.value.push(tempData.secondCateCode);
    },
    // 编辑商品
    updateData() {
      // 校验
      this.$refs.goodsForm.validate(valid => {
        if (valid) {
          // 复制一份数据
          
          var tempData = Object.assign(this.goodsFormTemp, {
            frontCostPrice: this.goodsFormTemp.costPrice + "",
            frontSalePrice: this.goodsFormTemp.salePrice + "",
            skuStatus: this.goodsFormTemp.skuStatus + "",
            saleNum: this.goodsFormTemp.saleNum + "",
            costPrice: this.goodsFormTemp.costPrice + "",
            salePrice: this.goodsFormTemp.salePrice + "",
            skuStatus: this.goodsFormTemp.skuStatus + "",
            storeNum: this.goodsFormTemp.storeNum + ""
          });
          // 请求更新接口
          updateGood(tempData).then(response => {
            // 关闭弹窗
            this.closeDialog();
            // 重新请求数据
            this.$emit("fetch");
            // 提示信息
            this.$notify({
              title: "成功",
              message: response.msg,
              type: "success"
            });
          });
        }
      });
    },
    // 重置表单内容
    resetGoodsTemp() {
      this.goodsFormTemp = {
        skuName: "",
        costPrice: "",
        salePrice: "",
        frontCostPrice: "",
        frontSalePrice: "",
        saleNum: "0",
        isbn: "",
        firstCateCode: "",
        secondCateCode: "",
        skuAd: "",
        skuStatus: "0",
        visiteNum: "0",
        skuIntroduction: "",
        businessCode: "",
        storeNum: "0",
        images: []
      };
    },
    // 商品分类
    handleCascaderChange(value) {
      this.goodsFormTemp.firstCateCode = value[0];
      this.goodsFormTemp.secondCateCode = value[1] || undefined;
    },
    // 图片删除
    handleRemove(file, fileList) {
    },
    // 图片预览
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 图片上传回调
    onSuccess(res) {
      this.goodsFormTemp.images.push(res.data);
    }
  }
};
</script>

<style>
</style>
