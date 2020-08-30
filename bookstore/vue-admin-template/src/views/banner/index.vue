<template>
  <div class="app-container">
    <!-- 筛选按钮 -->
    <div class="filter-container">
      <el-radio-group v-model="radioLabel" @change="handleSwitchRadio">
        <el-radio-button label="全部"></el-radio-button>
        <el-radio-button label="已启用"></el-radio-button>
        <el-radio-button label="已禁用"></el-radio-button>
      </el-radio-group>
    </div>
    <!-- 照片墙 -->
    <el-upload
      action="http://w3n1043453.zicp.vip/goods/uploadImage"
      list-type="picture-card"
      :file-list="list"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleOnSuccess"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{file}" style="width:100%">
        <el-card :body-style="{ padding: '0px',height:'100%'}">
          <el-image
            :class="{'disable-img':(file.picStatus == '2')}"
            class="image"
            :src="file.url"
            fit="cover"
          />
          <div style="padding: 14px;">
            <span class="img-id">{{file.id}}</span>
            <div class="bottom clearfix">
              <time class="time">{{file.updatedTime | dateTimeFilter}}</time>
              <span class="button">{{file.picStatus | picStatusFilter}}</span>
            </div>
          </div>
        </el-card>
        <!-- 悬停菜单 -->
        <span class="el-upload-list__item-actions">
          <!-- 预览 -->
          <span class="el-upload-list__item-preview" @click="handlePreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <!-- 启用 -->
          <span
            v-if="file.picStatus == '2'"
            class="el-upload-list__item-preview"
            @click="handleUpDate(file,'1')"
          >
            <i class="el-icon-video-play"></i>
          </span>
          <!-- 禁用 -->
          <span
            v-if="file.picStatus == '1'"
            class="el-upload-list__item-preview"
            @click="handleUpDate(file,'2')"
          >
            <i class="el-icon-video-pause"></i>
          </span>
          <!-- 删除 -->
          <span class="el-upload-list__item-preview" @click="handleUpDate(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
        <!-- 删除 -->
      </div>
    </el-upload>
    <!-- 大图预览 -->
    <el-dialog title="图片预览" :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import { getList, addPic, updatePic } from "@/api/banner";
import { uploadImage } from "@/api/goods";
import moment from "moment";
// 图片状态码表
var picStatusMap = [
  {
    key: "1",
    value: "已启用"
  },
  {
    key: "2",
    value: "已禁用"
  }
];
var picStatusKeyValue = picStatusMap.reduce((acc, cur) => {
  acc[cur.key] = cur.value;
  return acc;
}, {});
export default {
  name: "banner",
  filters: {
    dateTimeFilter(dateTime) {
      if (dateTime) {
        return moment(dateTime).format("YY/M/DD");
      }
    },
    // 图片状态
    picStatusFilter(key) {
      return picStatusKeyValue[parseInt(key)];
    }
  },
  data() {
    return {
      list: [],
      listQuery: {
        
        pageNum: "1",
        pageSize: "30"
      },
      dialogImageUrl: "",
      dialogVisible: false,
      radioLabel: "全部",
      picStatusKeyValue:picStatusKeyValue
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getList(this.listQuery).then(response => {
        this.list = [];
        // 进行数据映射
        response.data.list.forEach(item => {
          this.list.push({
            id: item.id,
            name: item.id,
            url: item.picUrl,
            picStatus: item.picStatus,
            isDelete: item.isDelete,
            createdTime: item.createdTime,
            createdBy: item.createdBy,
            updatedTime: item.updatedTime,
            updatedBy: item.updatedBy
          });
        });
      });
    },
    // 预览
    handlePreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 禁用启用
    handleUpDate(file, value) {
      var O_parmas = {
        id: file.id,
        picStatus: value
      };
      if (value) {
        updatePic(O_parmas).then(response => {
          this.$notify({
            title: "成功",
            message: response.msg,
            type: "success"
          });
          this.fetchData();
        });
      } else {
        // 删除
        updatePic(O_parmas).then(response => {
          // 提示成功
          this.$notify({
            title: "成功",
            message: response.msg,
            type: "success"
          });
          this.fetchData();
        });
      }
    },
    // 删除
    handleRemove() {
      // alert(345)
    },
    // 上传成功时
    handleOnSuccess(response,file,fileList) {
      var _url = response.data;
      // console.log(_url);
      var _parma = {
        picUrl: _url
      };
      // 调用新增图片接口
      addPic(_parma).then(response => {
        // console.log(_url);
        this.$notify({
          title: "成功",
          message: response.msg,
          type: "success"
        });
        this.fetchData();
      });
    },
    // 筛选
    handleSwitchRadio(label) {
      if (label == "全部") {
        this.listQuery.picStatus = undefined;
      }
      for (var key in this.picStatusKeyValue) {
        if (picStatusKeyValue[key] == label) {
          this.listQuery.picStatus = key;
        }
      }
      this.fetchData();
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
  padding: 5px 0 20px 0;
}
.time {
  font-size: 13px;
  color: #999;
}
.img-id {
  display: inline-block;
  font-size: 14px;
  line-height: 14px;
  width: 100% !important;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.disable-img {
  filter: gray;
  filter: grayscale(100%);
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
  font-size: 12px;
}

.image {
  width: 100%;
  height: 80px;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>
