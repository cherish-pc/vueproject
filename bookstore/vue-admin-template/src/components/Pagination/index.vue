<template>
  <div class="pagination-container" :class="{'hidden':hidden}">
     <!-- current-page在子组件会变，父组件需要知道子在变
        sync $emit触发 -->
      <el-pagination
        :background="background"
        :current-page.sync="currentPage"
        :layout="layout"
        :page-size.sync="pageSize"
        :page-sizes="pageSizes"
        :total="total"
        @size-change="handleSizeChange"
        @current-change ="handleCurrentChange"
      />
  </div>
</template>

<script>
export default {
    name:'Pagination',
    props:{
        // 隐藏分页组件
        hidden:{
            type:Boolean,
            default:false
        },
        // 是否显示背景色
        background:{
            type:Boolean,
            default:true
        },
        // table总条数
        total:{
            required:true,
            type:Number
        },
        // 当前页
        page:{
            type:Number
        },
        // 每页显示条数
        limit:{
            type:Number,
            default:20
        },
        // 每页显示的条数
        pageSizes:{
            type:Array,
            default(){
                return [10,20,30,50]
            }
        },
        // 需要展示的组件
        layout:{
            type:String,
            default:"total,sizes,prev,next,pager,jumper"
        }
    },
    computed:{
        currentPage:{
            // 向上传递需要读取和设置两个方法
            get(){
                return this.page
            },
            set(val){
                // 改变父组件的页码
                // 此page是父组件的绑定的，
                // val是改变完的值
                this.$emit("update:page",val)
            }

        },
        pageSize:{
             // 向上传递需要读取和设置两个方法
            get(){
                return this.limit
            },
            set(val){
                // 改变父组件的每页显示的个数
                // 此limit是父组件的
                this.$emit("update:limit",val)
            }
        }
    },
    methods:{
      // 子向父传值
        handleSizeChange(val){
            // 向上传递每页显示的个数
            this.$emit("pagination",{
                page:this.currentPage,
                limit:val
            });
        },
        handleCurrentChange(val){
            // 向上传递当前页
            this.$emit("pagination",{
                page:val,
                limit:this.pageSize
            });
        }
    }
}
</script>

<style>
.pagination-container {
    background-color: #fff;
    padding: 32px 16px;
}
.pagination-container.hidden{
    display: none;
}

</style>
