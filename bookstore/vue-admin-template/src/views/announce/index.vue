<template>
  <div class="app_container">
    <!-- 搜索条件 -->
    <div class="filter-container">
      <el-form class="filter-form" :model="listQuery" ref label-width="100px">
        <el-row>
          <!-- 搜索手机号  可清空 -->
          <el-col :span="6">
            <el-form-item label="公告标题">
              <el-input
                label="公告标题"
                class="filter-item"
                v-model="listQuery.announceTitle"
                clearable
                placeholder="搜索公告标题"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- 搜索手机号  可清空 -->
          <el-col :span="6">
            <el-form-item label="推送人">
              <el-input
                label="推送人"
                class="filter-item"
                v-model="listQuery.senderName"
                clearable
                placeholder="搜索推送人"
              ></el-input>
            </el-form-item>
          </el-col>
          <!-- 订单状态  可清空 -->
          <el-col :span="6">
            <el-form-item label="推送状态">
              <el-select
                label="状态"
                v-model="listQuery.pushStatus"
                clearable
                placeholder="请选择"
                style="width:100%"
              >
                <el-option
                  v-for="(item,index) in pushStatusMap"
                  :key="item+index"
                  :label="item"
                  :value="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="4" class="filter-button">
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
    <div class="operator-container">
      <el-button class="fitler-item" type="primary" icon="el-icon-plus" @click="handleCreate">添加</el-button>
    </div>
    <el-table
      :data="announceList"
      style="width: 100%">
       <el-table-column align="center" label="#" width="50" type="index"></el-table-column>
      <el-table-column prop="announceTitle" label="公告标题" width="120" align="center"></el-table-column>
      <el-table-column prop="announceContent" label="公告内容" width="200"></el-table-column>
      <el-table-column label="公告状态" width="80">
        <template slot-scope="scope">
          <span>
            <el-tag :type="scope.row.pushStatus|typeFilter">{{ scope.row.pushStatus|statusFilter}}</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="推送日期" width="180" align="center">
        <template slot-scope="scope">{{ scope.row.pushTime }}</template>
      </el-table-column>
      <el-table-column prop="senderName" label="推送人" width="120"></el-table-column>
      <el-table-column prop="createdBy" label="创建人" width="120"></el-table-column>
     <el-table-column label="创建时间" width="200" align="center">
        <template slot-scope="scope">{{ scope.row.createdTime|timeFilter }}</template>
      </el-table-column>
       <!-- 操作 -->
      <el-table-column align="center" label="操作" min-width="150px">
        <template slot-scope="scope">
          <el-button type="primary" v-show="scope.row.pushStatus == 0" size="mini" @click="handleupdate(scope.row,'1')">推送中</el-button>
          <el-button type="success" v-show="scope.row.pushStatus != 2" size="mini" @click="handleupdate(scope.row,'2')">已推送</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="新建公告" :visible.sync="addFormVisible">
      <el-form :rules="rules" ref="cardForm" label-width="100px" :model="cardFormTemp">
          <el-row>
          <el-col>
            <!-- 公告标题 -->
            <el-form-item label="公告标题" prop="announceTitle" class="items">
              <el-input v-model="cardFormTemp.announceTitle" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
            <!-- 公告内容 -->
            <el-form-item label="公告内容" prop="announceContent" class="items">
              <el-input v-model="cardFormTemp.announceContent" />
            </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="推送时间" prop="announceContent">
            <el-date-picker
            v-model="cardFormTemp.pushTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="推送时间"
            style="width:100%;">
            </el-date-picker>
            </el-form-item>
        </el-row>
       
      </el-form>
      <!-- 底部确定取消按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createData()">确定</el-button>
      </div>
    </el-dialog>
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
import {getList,deleteCode,addAnnounce,updateAnnounce } from '@/api/announce'
import Pagination from "@/components/Pagination";
import moment from 'moment'
var pushStatusMap = ['待推送','推送中','已推送'];
export default {
  name:'announce',
  components:{
    Pagination
  },
  filters:{
    statusFilter(status){
      
      return pushStatusMap[parseInt(status)];
    },
    // 商品状态样式
    typeFilter(status) {
      const statusTypeMap = ["info", "", "success"];
      return statusTypeMap[parseInt(status)];
    },
    timeFilter(time) {
      if (time) {
        return moment(time).format("YYYY/MM/DD hh:mm:ss");
      }
    },
  },
  data(){
    return {
      total:0,
      listQuery:{
        pageNum:1,
        pageSize:10,
        announceTitle:undefined,
        pushStatus:undefined,
        senderName:undefined
      },
      announceList:[],
      pushStatusMap,
      cardFormTemp:{
        announceContent:'',
        announceTitle:'',
        loginAccount:JSON.parse(sessionStorage.getItem('loginAccount')),
        pushTime:undefined
      },
      addFormVisible:false,
      rules:{
        announceContent:[
          {
            required: true,
            message: "请输入公告内容",
            trigger: "blur"
          },
        ],
        announceTitle:[
          {
            required: true,
            message: "请输入公告标题",
            trigger: "blur"
          },
        ],
        pushTime:[
          {
            required: true,
            message: "请选择时间",
            trigger: "blur"
          },
        ],
      }
    }
  },
  created(){
    this.fetchData()
  },
  methods:{
    fetchData(){
      getList(this.listQuery).then(response=>{
        this.announceList = response.data.list;
        this.total = response.data.total;
        this.listQuery.pageNum = parseInt(response.data.pageNum);
        this.listQuery.pageSize = parseInt(response.data.pageSize);
      })
    },
    handleFilter(){
      this.fetchData();
      this.listQuery.pageNum = 1;
    },
    // 点击添加处理
    handleCreate() {
      // 重置表单
      this.cardFormTemp = {
        announceContent:'',
        announceTitle:'',
        loginAccount:JSON.parse(sessionStorage.getItem('loginAccount')),
        pushTime:undefined
      };
      this.addFormVisible = true;
      // 禁用表单校验
      this.$nextTick(() => {
        // 在弹窗加载之初，不用进行校验
        this.$refs.cardForm.clearValidate();
      });
    },
    createData(){
      this.$refs.cardForm.validate(valid => {
        if (valid) {
          // 调用请求接口

          addAnnounce(this.cardFormTemp).then(response => {
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
    // 修改状态
    handleupdate(row,status){
      var _params = {
        announceCode:row.announceCode,
        pushStatus:status,
        loginAccount:JSON.parse(sessionStorage.getItem('loginAccount'))
      }
      updateAnnounce(_params).then(response=>{
        this.fetchData();
        this.$notify({
          title: "成功",
          message: response.msg,
          type: "success"
        });
      })
    },
    // 删除
    handleDelete(row){
      var _params = {
        announceCode:row.announceCode
      }
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // debugger
          deleteCode(_params).then(response => {
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
      
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-container {
  margin-top: 20px;
}
.filter-button {
  margin-left: 35px;
}
.operator-container {
  margin-bottom: 7px;
  margin-left:35px;
}
</style>