<template>
  <div class="users">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        v-model="userKey"
        class="input-with-select"
        style="width:300px;margin-right:15px"
        @keyup.enter.native='init'
      >
        <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
      </el-input>
      <el-button type="success" plain @click="addDialogFormVisible=true">添加用户</el-button>
    </div>

    <!-- 新增用户对话框 -->
    <el-dialog title="新增用户" :visible.sync="addDialogFormVisible">
      <el-form ref="addForm" :model="addForm" :rules="rules" :label-width="'120px'">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="add">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
      <el-form ref='editForm' :model="editForm" :rules='rules' :label-width="'120px'">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop='email'>
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop='mobile'>
          <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false;$refs.editForm.resetFields()">取 消</el-button>
        <el-button type="primary" @click="edit">确 定</el-button>
      </div>
    </el-dialog>

      <!-- 分配角色，下拉菜单 -->
     <el-dialog title="分配角色" :visible.sync="grantDialogFormVisible">
      <el-form ref="grantForm" :model="grantForm" :label-width="'120px'">
        <el-form-item label="用户名">
          <el-input v-model="grantForm.username" auto-complete="off" disabled style='width:200px'></el-input>
        </el-form-item>
        <!-- 添加下拉列表 -->
        <el-form-item label="角色列表">
          <el-select v-model="grantForm.rid" placeholder="请选择" @change="roleChange">
  <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantDialogFormVisible = false;">取 消</el-button>
        <el-button type="primary" @click='grantrolesubmit'>确 定</el-button>
      </div>
    </el-dialog>
    <el-table :data="userList" border style="width: 100%;margin-top:15px">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="300"></el-table-column>
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
         <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="updateStatus(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <!-- 插槽：匿名插槽，具名插槽，数据插槽 -->
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top" >
            <el-button type="info" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="success" icon="el-icon-share" @click="grantuserrole(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="warning" icon="el-icon-delete" @click="DelTips(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total-0"
    ></el-pagination>
  </div>
</template>
<script>
import { getAllList, addUser, editUser, deleteUser, updateUserStatus, grantUserRole } from '@/api/users.js'
import { getAllRoleList } from '@/api/roles.js'
export default {
  data () {
    return {
      roleList: [],
      myvalue: '',
      grantDialogFormVisible: false,
      grantForm: {
        id: '',
        rid: '',
        username: ''
      },
      // 总记录数
      total: '',
      value2: true,
      query: '',
      //   当前页码
      pagenum: 1,
      //   每页显示的记录数
      pagesize: 2,
      userKey: '',
      userList: [],
      addDialogFormVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editDialogFormVisible: false,
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            message: '请输入合法的邮箱',
            pattern: /\w+[@]\w+[.]\w+/,
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            message: '请输入正确的手机号',
            pattern: /^1\d{10}$/,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    grantuserrole (row) {
      this.grantForm.rid = row.rid
      this.grantDialogFormVisible = true
      this.grantForm.id = row.id
      this.grantForm.username = row.username
      console.log(row, this.grantForm.username, this.grantForm.id, this.grantForm.rid, this.grantDialogFormVisible)
    },
    roleChange (value) {
      this.grantForm.rid = value
    },
    grantrolesubmit () {
      console.log(this.grantForm)
      if (this.grantForm.rid) {
        grantUserRole(this.grantForm.id, this.grantForm.rid)
          .then(res => {
            if (res.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: res.data.meta.msg
              })
              this.grantDialogFormVisible = false
            }
          })
      } else {
        this.$message({
          type: 'warning',
          message: '请先选择一个角色'
        })
      }
    },
    updateStatus (id, type) {
      updateUserStatus(id, type)
        .then(res => {
          console.log(res)
          if (res.data.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.data.meta.msg
            })
          }
        })
    },
    DelTips (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(id)
          .then(res => {
            if (res.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功！'
              })
              this.init()
            }
          })
          .catch(() => {
            this.$message({
              type: 'error',
              message: '删除失败...'
            })
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleEdit (obj) {
      this.editDialogFormVisible = true
      this.editForm.id = obj.id
      this.editForm.username = obj.username
      this.editForm.email = obj.email
      this.editForm.mobile = obj.mobile
    },
    edit () {
      this.$refs.editForm.validate(valid => {
        if (valid) {
          editUser(this.editForm).then(res => {
            // 一定不要靠猜，而是打印出数据分析数据内容和结构
            // console.log(res)
            if (res.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: res.data.meta.msg
              })
              // 数据刷新
              this.editDialogFormVisible = false
              // 表单元素的数据重置
              this.$refs.editForm.resetFields()
              this.init()
            } else {
              this.$message({
                type: 'error',
                message: res.data.meta.msg
              })
            }
          }).catch(() => {
            console.log('err')
          })
        } else {
          return false
        }
      })
    },
    add () {
      this.$refs.addForm.validate(valid => {
        // 如果为true
        if (valid) {
          addUser(this.addForm)
            .then(res => {
              if (res.data.meta.status === 201) {
                this.$message({
                  type: 'success',
                  message: res.data.meta.msg
                })
                this.addDialogFormVisible = false
                this.init()
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.meta.msg
                })
              }
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: 'err'
              })
            })
        } else {
          // 中止添加用户请求
          return false
        }
      })
    },
    //   切换每页显示记录数时触发
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      //   val就是当前设置之后的每页的记录数，我们只需要重置pagesize
      this.pagesize = val
      this.init()
    },
    //   切换当前页码时触发
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.init()
    },
    // handleEdit (obj) {
    //   console.log(obj)
    // },
    init () {
      getAllList({
        query: this.userKey,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      })
        .then(res => {
          console.log(res)
          this.userList = res.data.data.users
          this.total = res.data.data.total
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.init()
    // 加载角色列表数据
    getAllRoleList()
      .then(res => {
        this.roleList = res.data.data
      })
  }
}
</script>

<style lang="less" scoped>
</style>
