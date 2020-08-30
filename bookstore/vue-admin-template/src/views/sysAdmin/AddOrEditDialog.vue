<template>
  <el-dialog
    :title="addFormStatus == 'create'?'新建用户':'编辑用户'"
    :visible.sync="visible"
    @close="closeDialog">
    <!-- 商品添加表单 -->
    <el-form
      :rules="rules"
      ref="userForm"
      label-width="100px"
      :model="usersFormTemp">
      <el-row>
        <el-col :span="24">
          <el-form-item label="账号" prop="userAccount">
            <el-input
              v-model="usersFormTemp.userAccount"
              placeholder="请输入用户账号"
              maxlength="20"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <!-- 姓名 -->
          <el-form-item label="姓名" prop="userName">
            <el-input
            v-model="usersFormTemp.userName" />
          </el-form-item>
        </el-col>

        <el-col :span="12" v-if="addFormStatus == 'create'">
          <!-- 密码 -->
          <el-form-item label="密码" prop="password">
            <el-input v-model="usersFormTemp.password" type="password"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="性别" prop="userSex">
            <el-radio-group v-model="usersFormTemp.userSex">
              <el-radio :label="0">女</el-radio>
              <el-radio :label="1">男</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
            <!-- 积分 -->
          <el-form-item label="积分" prop="frontScore">
            <el-input
              v-model="usersFormTemp.score"
              placeholder="请输入积分"
             />
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="24" >
             <!-- 手机号 -->
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="usersFormTemp.phone"
              maxlength="11"
              />
            </el-form-item>
        </el-col>
      </el-row>
      <el-row>

      </el-row>
      <el-row>
        <el-col :span="24">
            <!-- 书号 -->
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="usersFormTemp.email"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <!-- 定价 -->
          <el-form-item label="身份证号" prop="idCard">
            <el-input v-model="usersFormTemp.idCard"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="12">
            <!-- 库存 -->
          <el-form-item label="是否管理员" prop="isAdmin">
            <el-input
              v-model.number="usersFormTemp.isAdmin" disabled=""
            />
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <!-- 底部确定取消按钮 -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取消</el-button>
      <el-button
        type="primary"
        @click="addFormStatus == 'create'?createData():updateData()"
        >确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createUser,updateUser } from '@/api/user'
export default {
  name:'AddOrEditDialog',
  data(){
    return{
      visible:this.addFormVisible,
      usersFormTemp:{
        userAccount:"",
        userName:"",
        password:"",
        userSex:"",
        phone:"",
        email:"",
        idCard:"",
        isAdmin:"1",
        score:""
      },

      dialogVisible: false,
      rules:{
        phone:[
          {
            required:true,
            message:'请输入手机号',
            trigger:'blur'
          },

        ],
        score:[
          {
            required:true,
            message:'请输入积分',
            trigger:'blur'
          },

        ],

        userSex:[
          {
            required:true,
            message:'请选择性别',
            trigger:'change'
          }
        ],

        password:[
          {
            required:true,
            message:'请输入密码',
            trigger:'blur'
          },
        ],
        userAccount:[
          {
            required:true,
            message:'请输入用户账号',
            trigger:'blur'
          },
        ],
        userName:[
          {
            required:true,
            message:'请输入姓名',
            trigger:'blur'
          },
        ],
      }
    }
  },
  props:{
    // 弹窗状态
    addFormStatus:{
      type:String,
      default:''
    },
    // 弹窗可见性
    addFormVisible:{
      type:Boolean,
      default:false
    },
    // 编辑时父组件传递的数据
    updateUsers:{
      type:Object,
    }
  },
  watch:{
    // 监控
    addFormVisible:function(){
      // 切换可见性
      this.visible =  this.addFormVisible;
      this.handleCreate();

      if(this.addFormStatus =='update'){
        // 更新操作
        // 如果是更新，把数据绑定在表单上，获取的是接口中的详情
        this.usersFormTemp = Object.assign({},this.updateUsers);
         // 禁用表单校验
        this.$nextTick(()=>{
        // 在弹窗加载之初，不用进行校验
          this.$refs.userForm.clearValidate();
        });
      }

    }
  },
  methods:{
    // 关闭弹窗，向上传递可见性
    closeDialog(){
      this.$emit('update:addFormVisible',false);
    },
    // 在加载时获取码表信息
    // 点击添加处理
    handleCreate(){
      // 重置表单内容
      this.resetGoodsTemp();
      // 禁用表单校验
      this.$nextTick(()=>{
      // 在弹窗加载之初，不用进行校验
        this.$refs.userForm.clearValidate();
      });
    },
    // 新增用户
    createData(){
      this.$refs.userForm.validate(valid=>{
        if(valid){
          var userData = {
            ...this.usersFormTemp,
            userAccount:this.usersFormTemp.userAccount+'',
            userName:this.usersFormTemp.userName+'',
            phone:this.usersFormTemp.phone+'',
            email:this.usersFormTemp.email+'',
            idCard:this.usersFormTemp.idCard+'',
            password:this.usersFormTemp.password+'',
            frontScore:this.usersFormTemp.score+'',
            isAdmin:this.usersFormTemp.isAdmin+'',

          };
          // 调用请求接口
          createUser(userData).then(response =>{
              // 在前台手动模拟一条数据，浏览器刷新后消失
              // 关闭弹窗
              this.closeDialog();
              // 重新请求数据
              this.$emit('fetch');
              // 提示信息
              this.$notify({
                title:'成功',
                message:response.msg,
                type:'success',
              })
            })
        }
      })

    },
    handleUpdate(){
      var tempData = Object.assign({},this.updateUsers);
      // debugger
    },
    // 编辑商品
    updateData(){
      // 校验
      this.$refs.userForm.validate(valid =>{
        if(valid){
          // 复制一份数据
          var tempData = Object.assign(this.usersFormTemp,{
            userAccount:this.usersFormTemp.userAccount +'',
            userSex:this.usersFormTemp.userSex+'',
            phone:this.usersFormTemp.phone+'',
            frontScore:this.usersFormTemp.score+'',
            isAdmin:this.usersFormTemp.isAdmin+'',
          });
          // 请求更新接口
          updateUser(tempData).then(response =>{
            // 关闭弹窗
            this.closeDialog();
            // 重新请求数据
            this.$emit('fetch');
            // 提示信息
            this.$notify({
              title:'成功',
              message:response.msg,
              type:'success',
            });
          });
        }
      });

    },
     // 重置表单内容
    resetGoodsTemp(){
      this.usersFormTemp={
        userAccount:"",
        userName:"",
        password:"",
        userSex:"",
        phone:"",
        email:"",
        idCard:"",
        isAdmin:"1",
        score:""

      }
    },

  },
}
</script>

<style>

</style>
