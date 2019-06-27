<template>
  <div class="role">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain @click='adddialogFormVisible=true'>添加角色</el-button>

    <el-table style="width: 100%" :data="roleList">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 一级权限 -->
          <el-row v-for="first in scope.row.children" :key="first.id" style='margin-bottom:15px'>
            <el-col :span="4">
              <el-tag closable type="success" @close='deleteRight(scope.row,first.id)' v-if="first.children.length!==0">{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id" style='margin-bottom:10px;'>
                <!-- 二级权限 -->
                <el-col :span="4">
                  <el-tag closable type="info"  @close='deleteRight(scope.row,second.id)'  v-if='second.children.length !== 0'>{{second.authName}}</el-tag>
                </el-col>
                <!-- 三级权限 -->
                <el-col :span="20">
                  <el-tag
                    closable
                    type="danger"
                    v-for="third in second.children"
                    :key="third.id"
                    style='margin:0 4px 4px 0'
                    @close="deleteRight(scope.row,third.id)"
                  >{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
           <el-row>
            <el-col :span="24" v-if='scope.row.children.length === 0'>没有任何的权限数据，请先添加</el-col>
        </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="info" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="角色授权" placement="top">
            <el-button type="success" icon="el-icon-share" @click="showGrantDialog(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 角色授权 -->
    <el-dialog title="角色授权" :visible.sync="grantdialogFormVisible">
      <div class="box">
        <el-tree
        ref='tree'
        :data="rightList"
        show-checkbox
        node-key="id"
        :default-expand-all='true'
        :default-checked-keys="checkedArr"
        :props="defaultProps"
      ></el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click='grantSubmit'>确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="adddialogFormVisible">
      <el-form :model="roleForm"  :label-width="'120px'">
        <el-form-item label="角色名称"  v-focus>
          <el-input v-model="roleForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.roleDesc" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adddialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click='add'>确 定</el-button>
      </div>
      </el-dialog>
  </div>
</template>
<script>
import { getAllRoleList, deleteRightById, grantRightByRoleId, addRole } from '@/api/roles.js'
import { getAllRightsList } from '@/api/rights.js'
export default {
  data () {
    return {
      adddialogFormVisible: false,
      roleForm: {
        roleName: '',
        roleDesc: ''
      },
      roleId: '',
      checkedArr: [],
      roleList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      rightList: [],
      grantdialogFormVisible: false
    }
  },
  directives: {
    'focus': {
      inserted (el) {
        el.focus()
      }
    }
  },
  methods: {
    add () {
      addRole(this.roleForm)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 201) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            this.adddialogFormVisible = false
            this.init()
          }
        })
    },
    grantSubmit () {
      var arr = this.$refs.tree.getCheckedNodes()
      // console.log(arr)
      var temp = arr.map(value => {
        return value.id + ',' + value.pid
      })
      // console.log(temp)
      var str = temp.join(',')
      // console.log(str)
      // console.log(str.split(','))
      var obj = new Set(str.split(','))
      // console.log(obj)
      var final = [...obj]
      console.log(final.join(','))
      grantRightByRoleId(this.roleId, final.join(','))
        .then(res => {
          console.log(res)
        })
      this.init()
      this.grantdialogFormVisible = false
    },
    showGrantDialog (row) {
      this.roleId = row.id
      this.grantdialogFormVisible = true
      getAllRightsList('tree')
        .then(res => {
          this.rightList = res.data.data
        })
      this.checkedArr.length = 0
      row.children.forEach((first) => {
        if (first.children.length > 0) {
        // 遍历二级权限
          first.children.forEach(second => {
            if (second.children.length > 0) {
              // 遍历三级权限
              second.children.forEach(third => {
                this.checkedArr.push(third.id)
              })
            }
          })
        }
      })
    },
    deleteRight (row, rightid) {
      // console.log(row);
      deleteRightById(row.id, rightid)
        .then(res => {
        // console.log(res);
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
            row.children = res.data.data
          }
        })
    },
    init () {
      getAllRoleList().then(res => {
        // console.log(res)
        // 所有角色数据
        this.roleList = res.data.data
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style lang="less" scoped>
.box{
  height: 400px;
  overflow: scroll;
}
</style>
