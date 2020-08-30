<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="罗鑫">
        <lx></lx>
      </el-tab-pane>
      <el-tab-pane label="蒙婷">
        <mt></mt>
      </el-tab-pane>
      <el-tab-pane label="李健"><lj></lj></el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import lx from '@/components/userInfo/lx.vue'
import mt from '@/components/userInfo/mt.vue'
import lj from '@/components/userInfo/lj.vue'


export default {
  components:{
    lx,
    mt,
    lj
  }
}
</script>

<style>

</style>
