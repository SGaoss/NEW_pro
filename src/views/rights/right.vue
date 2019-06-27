/* eslint-disable no-undef */
<template>
    <div class="right">
      <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
      <el-table :data="rightList" border style="width: 100%">
    <el-table-column type="index" width="50"></el-table-column>
    <el-table-column prop="authName" label="权限" width="180"></el-table-column>
    <el-table-column prop="path" label="路径" width="180"></el-table-column>
    <el-table-column  label="层级">
      <template slot-scope="scope">
        <span>{{scope.row.level | levelFormat}}</span>
      </template>
    </el-table-column>
</el-table>
    </div>
</template>
<script>
import { getAllRightsList } from '@/api/rights.js'
export default {
  data () {
    return {
      rightList: [],
      authName: '',
      path: '',
      level: ''
    }
  },
  methods: {
    init () {
      getAllRightsList('list')
        .then(res => {
          console.log(res)
          this.rightList = res.data.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.init()
  },
  filters: {
    levelFormat: level => {
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else if (level === '2') {
        return '三级'
      }
      return ''
    }
  }
}
</script>
<style lang="less" scoped>

</style>
