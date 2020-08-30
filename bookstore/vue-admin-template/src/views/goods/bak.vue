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
        >
      </el-input>
      <!-- 商品名称  过滤首尾空格-->
      <el-input
        class="filter-item"
        v-model="listQuery.skuAd"
        placeholder="搜索广告词"
        style="width:200px"
       >
      </el-input>
      <!-- 商品状态  可清空 -->
      <el-select
        v-model="listQuery.skuStatus"
        clearable
        placeholder="请选择商品状态"
        style="width:200px">
        <el-option
          v-for="(item,index) in skuStatusMapper"
          :key="item+index"
          :label="item"
          :value="index">
        </el-option>
      </el-select>
      <!-- 查询按钮 -->
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter">
        查询
      </el-button>
    </div>
    <!-- 搜索条件结束 -->
    <!-- 添加 -->
    <div class="operator-container">
      <el-button
        class="fitler-item"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >添加</el-button>
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
    <!-- 如果没有特殊要求，每条数据的id是不方便在前台展示的 -->
      <el-table-column align="center" label="#" width="60" type="index">
      </el-table-column>
      <!-- <el-table-column label="商品编码">
        <template slot-scope="scope">
          {{ scope.row.skuCode }}
        </template>
      </el-table-column> -->

      <!-- 商品附带展示是否已经被删除 -->
      <el-table-column
        label="商品名称"
        min-width="160"
        align="center"
        >
        <template slot-scope="scope">
          <span class="cursor" @click="handleDetail(scope.row)">{{ scope.row.skuName }}</span>
          <el-tag type="info" effect="plain" v-if="scope.row.IsDelete =='0'">{{ scope.row.IsDelete| isDeleteFilter }}</el-tag>
        </template>
      </el-table-column>
      <!-- 标点符号一定要是英文半角，显示金额右对齐比较好看 -->
      <el-table-column label="售价(¥)" width="70" align="right">
        <template slot-scope="scope">
          {{ scope.row.salePrice }}
        </template>
      </el-table-column>

      <el-table-column label="广告词" width="180" align="center">
        <template slot-scope="scope">
          {{ scope.row.skuAd }}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="商品状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.skuStatus|typeFilter">{{ scope.row.skuStatus|skuStatusFilter}}</el-tag>
        </template>
      </el-table-column>
       <el-table-column align="center" prop="created_at" label="创建时间" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="创建人" width="80" align="center">
        <template slot-scope="scope">
          {{ scope.row.createdby }}
        </template>
      </el-table-column> -->
      <!-- 操作栏 根据当前行的不同状态进行操作过滤 多个按钮左对齐好看-->
      <el-table-column label="操作" width="230" align="left">
        <template slot-scope="scope">
          <!-- 编辑 -->
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <!-- 发布:在未发布的状态才有 -->
          <el-button v-if="scope.row.skuStatus=='2'" type="success" size="mini">发布</el-button>
          <!-- 下架 -->
          <el-button v-if="scope.row.skuStatus=='0'" type="warning" size="mini">下架</el-button>
          <!-- 删除 -->
          <el-button v-if="scope.row.IsDelete !='0'" @click="handleDelete(scope.row)" type="danger" size="mini">删除</el-button>
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
      :class = "{'hidden':total<=listQuery.pageNum?true:false}"
      :limit.sync = "listQuery.pageSize"
      :page.sync = "listQuery.pageNum"
      :total='total'
      @pagination="fetchData"
    />
    <!-- 添加、编辑商品弹窗 -->
    <AddOrEditDialog>

    </AddOrEditDialog>
    <el-dialog
      :title="addFormStatus == 'create'?'新建商品':'编辑商品'"
      :visible.sync="addFormVisible">
      <!-- 商品添加表单 -->
      <el-form
        :rules="rules"
        ref="goodsForm"
        label-width="100px"
        :model="goodsFormTemp">
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品名称" prop="skuName">
              <el-input
                v-model="goodsFormTemp.skuName"
                placeholder="请输入商品名称"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
              <!-- 书号 -->
            <el-form-item label="书号" prop="ISBN">
              <el-input v-model.number="goodsFormTemp.ISBN"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <!-- 定价 -->
            <el-form-item label="定价" prop="costPrice">
              <el-input v-model.number="goodsFormTemp.costPrice"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 售价 -->
            <el-form-item label="售价" prop="salePrice">
              <el-input v-model.number="goodsFormTemp.salePrice"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <!-- 定价 -->
            <el-form-item label="前台定价" prop="frontCostPrice">
              <el-input v-model.number="goodsFormTemp.frontCostPrice"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 售价 -->
            <el-form-item label="前台售价" prop="frontSalePrice">
              <el-input v-model.number="goodsFormTemp.frontSalePrice"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
             <!-- 广告词 -->
            <el-form-item label="广告词" prop="skuAd">
              <el-input
                v-model="goodsFormTemp.skuAd"
                placeholder="请输入广告词"
                maxlength="12"
                show-word-limit/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
             <!-- 销售数量 -->
            <el-form-item label="销售数量" prop="saleNum">
              <el-input v-model.number="goodsFormTemp.saleNum"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
              <!-- 库存 -->
            <el-form-item label="库存" prop="storeNum">
              <el-input
                v-model.number="goodsFormTemp.storeNum"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 商品介绍 -->
            <el-form-item label="商品介绍">
              <el-input
              v-model="goodsFormTemp.skuIntroduction" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
             <!-- 分类 -->
            <el-form-item  label="商品分类" prop="firstCateCode">
              <el-cascader
                v-model="cascader.value"
                :options="cascader.options"
                @change="handleCascaderChange"
                >
              </el-cascader>

          </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- 商品状态 -->
              <el-form-item  label="商品状态" prop="skuStatus">
                <el-select
                v-model="goodsFormTemp.skuStatus"
                placeholder="请选择">
                  <el-option
                    key="one"
                    label="在售"
                    value="0">
                  </el-option>
                  <el-option
                    key="two"
                    label="已下架"
                    value="1">
                  </el-option>
                  <el-option
                    key="three"
                    label="未发布"
                    value="2">
                  </el-option>
                </el-select>
          </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <!-- 浏览量 -->
            <el-form-item label="浏览量" prop="visiteNum">
              <el-input
                v-model.number="goodsFormTemp.visiteNum"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
              <!-- 商家编码 -->
            <el-form-item
              label="商家编码"
              prop="businessCode">
              <el-select
                v-model="goodsFormTemp.businessCode">
                <el-option
                  v-for="(item,index) in businessCodeMapper"
                  :key="item.businessCode+index"
                  :label="item.businessName"
                  :value="item.businessCode"
                  >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <!-- 图片 -->
            <el-form-item label="图片">
              <el-upload
                action="/dev-api/vue-admin-template/goods/uploadImage"
                list-type="picture-card"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :limit="5"
                :on-success="onSuccess">
                <i class="el-icon-plus"></i>
                <div slot="file" slot-scope="{file}">
                  <el-image
                    class="image"
                    :src="file.url"
                    fit="cover"/>
                  <span class="el-upload-list__item-actions">
                    <!-- 预览 -->
                    <span
                      class="el-upload-list__item-preview"
                      @click="handlePreview(file)">
                      <i class="el-icon-zoom-in"></i>
                    </span>
                    <!-- 删除 -->
                    <span
                      class="el-upload-list__item-preview"
                      >
                      <i class="el-icon-delete"></i>
                    </span>
                  </span>
                </div>
              </el-upload>
              <!-- 展示图片的弹窗 -->
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
              </el-dialog>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 底部确定取消按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="addFormStatus == 'create'?createData():updateData()"
          >确定</el-button>
      </div>
    </el-dialog>
    <!-- 商品详情弹窗 -->
    <el-dialog
      title="商品详情"
      :visible.sync="detailFormVisible"
      style="width:100%"
      width="65%"
      >
      <!-- 商品信息表格 -->
      <el-table
        v-loading="listLoading"
        :data="goodsFormInfo"
        style="width: 100%"
        >
        <!-- 可折叠 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="是否删除">
                <span>
                  <el-tag type="info" effect="plain" v-if="props.row.IsDelete =='0'">{{ props.row.IsDelete| isDeleteFilter }}</el-tag>
                  <el-tag type="success" effect="plain" v-if="props.row.IsDelete =='1'">{{ props.row.IsDelete| isDeleteFilter }}</el-tag>
                </span>
              </el-form-item>
              <el-form-item class-name="status-col" label="商品状态" align="left">
                <span>
                  <el-tag :type="props.row.skuStatus|typeFilter">{{ props.row.skuStatus|skuStatusFilter}}</el-tag>
                </span>
              </el-form-item>
              <el-form-item label="广告词" align="left">
                <span>
                  {{ props.row.skuAd }}
                </span>
              </el-form-item>
              <el-form-item label="商品介绍" align="left">
                <span>
                  {{ props.row.skuIntroduction }}
                </span>
              </el-form-item>
              <el-form-item label="浏览量">
                <span>
                  {{ props.row.visiteNum }}
                </span>
              </el-form-item>
              <el-form-item label="销售数量">
                <span>
                  {{ props.row.saleNum }}
                </span>
              </el-form-item>
              <el-form-item label="一级分类代码">
                <span>
                  {{ props.row.firstCateCode }}
                </span>
              </el-form-item>
              <el-form-item label="一级分类名称">
                <span>
                  {{ props.row.firstCateName }}
                </span>
              </el-form-item>
              <el-form-item label="二级分类代码">
                <span>
                  {{ props.row.secondCateCode }}
                </span>
              </el-form-item>
              <el-form-item label="二级分类名称">
                <span>
                  {{ props.row.secondCateName }}
                </span>
              </el-form-item>
              <el-form-item label="商家编码" label-width="80" align="left">
                <span>
                  {{ props.row.skuCode}}
                </span>
              </el-form-item>

              <el-form-item label="上架时间">
                <span>
                  {{ props.row.saleTime }}
                </span>
              </el-form-item>
              <el-form-item label="创建人" align="left">
                <span>
                  {{ props.row.createdby }}
                </span>
              </el-form-item>
              <el-form-item align="left" prop="created_at" label="创建时间">
                  <span>{{ props.row.createdTime }}</span>
              </el-form-item>
              <el-form-item label="更新人" align="left">
                <span>
                  {{ props.row.updatedby }}
                </span>
              </el-form-item>
              <el-form-item align="left" prop="created_at" label="更新时间">
                  <span>{{ props.row.updatedTime }}</span>
              </el-form-item>
               <!-- 图片 -->
              <el-form-item label="图片" style="width:100%">
                <el-image
                  v-for="(item,index) in props.row.images"
                  :key="item+index"
                  :src= 'item'
                  alt="图片+index"
                  style="width:30%;margin-left:5px"
                />
                <!-- 展示图片的弹窗 -->
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </el-form-item>

            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          min-width="150"
          label="商品名称"
          prop="skuName">
        </el-table-column>
        <el-table-column
          label="书号"
          prop="ISBN">
        </el-table-column>
        <el-table-column
          label="库存"
          prop="storeNum">
        </el-table-column>
        <el-table-column
          label="定价(¥)"
          prop="costPrice">
        </el-table-column>
        <el-table-column
          label="售价(¥)"
          prop="salePrice">
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
// import { getList } from '@/api/table'
import { getList,getGoodsDetail,createGood,updateGood,deleteGood,uploadImage,getBusiness } from '@/api/goods'
import { getCate } from '@/api/cate'
import AddOrEditDialog from './AddOrEditDialog'
import Pagination from '@/components/Pagination'
import {formatTime,parseTime} from '@/utils/index'
// 码表
// 商品状态码表
var skuStatusMapper = ['在售','已下架','未发布'];
var infos = [];
export default {
  components:{
    Pagination,
    AddOrEditDialog
  },
  filters: {
    // 商品状态名称
    skuStatusFilter(status) {
      return skuStatusMapper[parseInt(status)];
    },
    // 商品状态样式
    typeFilter(status){
      const statusTypeMap = ['success','danger','info'];
      return statusTypeMap[parseInt(status)];
    },
    // 是否删除
    isDeleteFilter(status) {
      const statusMap =['已删除','正常']
      // console.log(statusMap[parseInt(status)]);
      return statusMap[parseInt(status)];
    }
  },
  data() {
    return {
      list: null,
      fileList:[],
      fileImg:[],
      // 存放删除的
      deleteIds:[],
      //商品详情
      goodsFormInfo:[],
      listLoading: true,
      // 图片上传
      dialogImageUrl: '',
      dialogVisible: false,
      headers:{},
      // 分页
      total:10,
      hidden:false,
      // 查询条件
      listQuery:{
        pageNum:1,
        pageSize:10,
      //可增加其他搜索条件
        // 避免为空时传给后台
        skuName:undefined,
        skuStatus:undefined,
        skuAd:undefined
      },
      skuStatusMapper,
      // 添加弹窗的数据
      // 弹窗状态
      addFormStatus:'',
      // 弹窗可见性
      addFormVisible:false,
      // 弹窗可见性
      detailFormVisible:false,
      goodsFormTemp:{
        skuName:'',
        costPrice:'0',
        salePrice:'0',
        frontCostPrice:'0',
        frontSalePrice:'0',
        saleNum:'0',
        ISBN:null,
        firstCateCode:null,
        secondCateCode:null,
        skuAd:undefined,
        skuStatus:'0',
        visiteNum:'0',
        skuIntroduction:undefined,
        businessCode:'',
        storeNum:'0',
        images:[],
      },
      // 级联下拉框
      cascader:{
        value:[],
        options:[]
      },

      // 商家信息
      businessCodeMapper:[],
      rules:{
        skuName:[
          {
            required:true,
            message:'请输入商品名称',
            trigger:'blur'
          },
          {
            max:20,
            message:'商品名称过长',
            trigger:'blur'
          }
        ],
        ISBN:[
          {
            required:true,
            message:'请输入ISBN码',
            trigger:'blur'
          }
        ],
        saleNum:[
          {
            required:true,
            message:'请输入销售数量',
            trigger:'blur'
          },
          {
            type:"number",
            message:'必须为数字',
            trigger:'blur'
          }
        ],
        firstCateCode:[
          {
            required:true,
            message:'请选择分类',
            trigger:'change'
          }
        ],
        skuStatus:[
          {
            required:true,
            message:'请选择商品状态',
            trigger:'change'
          }
        ],
        storeNum:[
          {
            required:true,
            message:'请输入库存',
            trigger:'blur'
          },
          {
            type:"integer",
            message:'请输入正确的数字',
            trigger:'blur'
          }
        ],
        visiteNum:[
          {
            required:true,
            message:'请输入浏览量',
            trigger:'blur'
          },
          {
            type:"integer",
            message:'请输入正确的数字',
            trigger:'blur'
          }
        ],
        businessCode:[
          {
            required:true,
            message:'请输入商家编码',
            trigger:'blur'
          }
        ],
        costPrice:[
          {
            required:true,
            message:'请输入定价',
            trigger:'blur'
          },
          {
            type:"number",
            message:'必须为数字',
            trigger:'blur'
          }
        ],
        salePrice:[
          {
            required:true,
            message:'请输入售价',
            trigger:'blur'
          },
          {
            type:"number",
            message:'必须为数字',
            trigger:'blur'
          }
        ],
        frontCostPrice:[
          {
            required:true,
            message:'请输入前台定价',
            trigger:'blur'
          },
          {
            type:"number",
            message:'必须为数字',
            trigger:'blur'
          }
        ],
        frontSalePrice:[
          {
            required:true,
            message:'请输入前台售价',
            trigger:'blur'
          },
          {
            type:"number",
            message:'必须为数字',
            trigger:'blur'
          }
        ],
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      // this.filelist = [];
      getList(this.listQuery).then(response => {
        response.data.List.forEach((item) =>{

          // item.images.forEach((v)=>{
          //   // console.log(value);
          //   this.fileList.push({
          //     url:v,
          //     skuCode:item.skuCode
          //   });
          // })

        });
        // console.log(this.fileList);
        this.list = response.data.List;
        this.total = response.data.total;
        this.listQuery.pageNum = parseInt(response.data.pageNum);
        this.listQuery.pageSize = parseInt(response.data.pageSize);
        this.listLoading = false
      })
    },
    // 查询
    handleFilter(){
      this.listQuery.pageNum = 1;
      this.fetchData();
    },
    // 商品分类
    handleCascaderChange(value){
      console.log(value);
      this.goodsFormTemp.firstCateCode = value[0];
      this.goodsFormTemp.secondCateCode = value[1] || undefined;
    },

    // 图片删除
    handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      // 图片预览
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
      // console.log(this.dialogImageUrl);

    },
    // 图片上传回调
    onSuccess(res){
      console.log(res);
      this.goodsFormTemp.images.push(res.data);
    },
    // 点击添加处理
    handleCreate(){
      // 重置表单内容
      this.resetGoodsTemp();
      // 获取分类
      getCate().then(response =>{
        var cateData = response.data;
        // 将类别数据初始化
        this.cascader.options = cateData.reduce((acc,cur)=>{
          var _children = [];
          cur.childNodes.forEach(item=>{
            _children.push({
              label:item.attribute.cateName,
              value:item.attribute.cateCode,
            })
          });
          acc.push({
            label:cur.attribute.cateName,
            value:cur.attribute.cateCode,
            children:_children
          })
          return acc
        },[])
      });
      // 获取商家信息
      getBusiness().then(response =>{
        this.businessCodeMapper = response.data;
      });
      // 弹出模态框
      this.addFormStatus = 'create';
      this.addFormVisible = true;
      // 禁用表单校验
      this.$nextTick(()=>{
      // 在弹窗加载之初，不用进行校验
        this.$refs.goodsForm.clearValidate();
      });
    },
    // 重置表单内容
    resetGoodsTemp(){
      this.goodsFormTemp = {
        skuName:'',
        costPrice:0,
        salePrice:0,
        frontCostPrice:0,
        frontSalePrice:0,
        saleNum:0,
        ISBN:null,
        firstCateCode:null,
        secondCateCode:null,
        skuAd:undefined,
        skuStatus:'0',
        visiteNum:0,
        skuIntroduction:undefined,
        businessCode:'',
        storeNum:0,
        images:[],
      }
    },
    // 新增商品
    createData(){
      this.$refs.goodsForm.validate(valid=>{
        if(valid){
          // 调用请求接口
          createGood(this.goodsFormTemp).then(response =>{
              console.log(this.goodsFormTemp);

              // 在前台手动模拟一条数据，浏览器刷新后消失
              // TODO:联调后删除
              var t = new Date();
              this.goodsFormTemp.createdTime =parseTime(t);
              this.list.unshift(this.goodsFormTemp);
              // 关闭弹窗
              this.addFormVisible = false;
              // 提示信息
              this.$notify({
                title:'成功',
                message:response.msg,
                type:'success',
                duration:3000
              })
            })
        }
        // 如果验证不成功则不做任何操作
      })

    },
    // 编辑按钮
    handleUpdate(row){
      // 复制一份，和...效果相同
      this.goodsFormTemp = Object.assign({},row);

      console.log(this.goodsFormTemp);
       // 获取分类
      getCate().then(response =>{
        var cateData = response.data;
        // console.log(cateData);
        // 将类别数据初始化
        this.cascader.options = cateData.reduce((acc,cur)=>{
          var _children = [];
          cur.childNodes.forEach(item=>{
            _children.push({
              label:item.attribute.cateName,
              value:item.attribute.cateCode,
            })
          });
          acc.push({
            label:cur.attribute.cateName,
            value:cur.attribute.cateCode,
            children:_children
          })
          return acc
        },[])
      });

      // 获取商家信息
      getBusiness().then(response =>{
        this.businessCodeMapper = response.data;
        console.log(response.data);

      });
      // 图片
      // this.goodsFormTemp.images = [];
      // this.fileList.forEach((items)=>{
      //   if(items.skuCode == this.goodsFormTemp.skuCode){
      //     this.goodsFormTemp.images.push({
      //       url:items.url,
      //       name:items.skuCode})
      //   }
      // })
      // console.log(this.goodsFormTemp.images);

      // 改变弹窗状态
      this.addFormStatus = 'update';
      this.addFormVisible = true;
      // 取消校验
      this.$nextTick(()=>{
        this.$refs.goodsForm.clearValidate();
      });
    },
    // 编辑商品
    updateData(){
      // 校验
      this.$refs.goodsForm.validate(valid =>{
        if(valid){
          // 复制一份数据
          var tempData = Object.assign({},this.goodsFormTemp);
          // console.log(tempData);
          // 请求更新接口
          updateGood(tempData).then(response =>{
            // 在前台手动模拟一条数据，浏览器刷新后消失
            // TODO:联调后删除
            this.list.forEach(item =>{
              // 使用商品的唯一标识
              if(item.skuCode === this.goodsFormTemp.skuCode){
                var _index = this.list.indexOf(item);
                // 对数组指定位置的元素进行替换
                this.list.splice(_index,1,this.goodsFormTemp);
              }
            })

            // 更改窗口状态
            this.addFormVisible = false;
            // 提示信息
            this.$notify({
              title:'成功',
              message:response.msg,
              type:'success',
              duration:3000
            });
          });
        }
      });

    },
    // 显示商品详情
    handleDetail(row){
      this.goodsFormInfo = [];
      var _parma = {
        skuCode:row.skuCode
      };
      getGoodsDetail(_parma).then(response => {
        // TODO:联调删除
        response.data.forEach(item => {
          // console.log(item);
          if (row.skuCode === item.skuCode) {
            this.goodsFormInfo.push(item);
          }
        });
        // 改变弹窗状态
      this.detailFormVisible = true;
      });
    },
    // 删除商品
    handleDelete(row){
      var _parma = {
        skuCode:row.skuCode
      };
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteGood(_parma).then(response =>{
            // 在前台手动模拟一条数据，浏览器刷新后消失
            // TODO:联调后删除
              this.list.forEach(item =>{
              // 使用商品的唯一标s识
              if(item.skuCode === row.skuCode){
                var _index = this.list.indexOf(item);
                // 对数组指定位置的元素进行删除
                this.list.splice(_index,1);
                // this.deleteIds.push(tempData.id);
              }
            });
            this.$notify({
              title:'成功',
              message:response.msg,
              type:'success',
            });
          })
        }).catch(() => {
          this.$notify({
            title:'取消',
            type: 'info',
            message: '已取消删除',
            duration:3000
          });
        });
    }

  }
}
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__header {
  background-color: #edf1f5;
}
/deep/ .el-dialog__title {
  color: #516673;
  font-weight: 600;
}
.filter-container{
  // height: 100px;
  // border: 1px solid red;
  padding:5px 0 20px 0;
}
.operator-container{
  margin-bottom:7px;
}
.cursor{
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
// .image {
//     width: 100%;
//     height:100%;
//     display: block;
//   }

</style>
