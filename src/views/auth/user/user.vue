<template>
  <div class="mod-user">
     <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="">
          <el-input @keyup.enter.native="handleFilter"  style="width:300px;" class="filter-item" placeholder="请输入用户名" v-model="listQuery.username"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input @keyup.enter.native="handleFilter"  style="width:300px;" class="filter-item" placeholder="请输入真实姓名" v-model="listQuery.realName"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button class="filter-item" type="primary" @click="handleFilter"  icon="el-icon-search">搜索</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button class="filter-item" type="primary" @click="handleCreate()"  icon="el-icon-plus">新增</el-button>
        </el-form-item>
     </el-form>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据正在加载" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="用户名" prop="username">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="真实姓名" prop="username">
        <template slot-scope="scope">
          <span>{{scope.row.username}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="电话" prop="phone">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="邮箱" prop="email">
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" prop="status">
        <template slot-scope="scope">
          <span>{{scope.row.status|options}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleCreate(scope.row.userId)">编辑</el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total=total>
      </el-pagination>
    </div>
    <!-- 新增/编辑 对话框 -->
    <edit-user ref="dialog"  @refreshDataList="getList"  v-if="addOrUpdateVisible" :dialogFormVisible.sync="dialog.visible"  @refreshParent="handleFilter"></edit-user>
    </div>

</template>

<script>
import editDialog from './edit_user'
import { fetchPage} from '@/api/auth/user'
// import { selectAllRole } from '@/api/auth/role'
// import { insertUserRole, selectUserRole } from '@/api/auth/roleUser'
import { parseTime } from '@/utils'
const options = [
  { value: 0, label: '禁用' },
  { value: 1, label: '正常' }
]
const optionsKeyValue = options.reduce((acc, cur) => {
  acc[cur.value] = cur.label
  return acc
}, {})
export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      roleList: null,
      userId: '',
      row: '',
      dialogStatus: '',
      userNeWRoleId: '',
      roleListData: [],
      roleListDataByid: [],
      listLoading: true,
      options: '',
      checkList: [],
      addOrUpdateVisible: false,
      userPhotoId: '',
      userNewId: '',
      imageUrl: '',
      checkListData: [],
      checkListUser: [],
      checked: true,
      dialogVisible: false,
      dialogVisibles: false,
      dialogVisibleAvator: false,
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        username: undefined,
        realName: undefined,
        sort: ''
      },
      dataForm: {
        imageUrl: ''
      },
      dialog: {
        status: '',
        visible: false,
        temp: {
          account: '',
          username: '',
          password: '',
          realName: '',
          sex: '',
          phone: '',
          email: ''
        }
      }

    }
  },
  components: {
    'edit-user': editDialog
  },
  filters: {
    options(type) {
      return optionsKeyValue[type]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.$loading.open();
      this.listLoading = true
      fetchPage(this.listQuery).then(response => {
        this.$loading.close();
        this.list = response.data.data.list
        this.total = response.data.data.total
        this.listLoading = false
      })
    },
    resetTemp() {
      this.dialog.temp = {
        account: '',
        username: '',
        password: '',
        realName: '',
        sex: '',
        phone: '',
        email: ''
      }
    },
    handleFilter() {
      this.listQuery.currentPage = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.currentPage = val
      this.getList()
    },

    handleCreate(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.dialog.selectList(id)
      })
    },
    handleDelete(row) {
      this.$confirm('确定进行[删除]操作?', '提示', {
        type: 'warning'
      })
        .then(response => {
          this.$loading.open();
          const data = { id: row.id }
          // deleteUser(data).then(response => {
          //   if (response.data.state == "true") {
          //     this.$msg.showSuccess("删除成功");
          //     this.getList();
          //   } else {
          //     this.$msg.showError(1, response.data.msg);
          //     this.$loading.close();
          //   }
          // })
        })
    },
  }
}
</script>

<style scoped>
    .btn-container{
        margin-bottom: 10px;
    }
</style>
