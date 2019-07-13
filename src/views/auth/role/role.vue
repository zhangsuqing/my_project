<template>
  <div class="mod-user">
    <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="">
         <el-input @keyup.enter.native="handleFilter" style="width:300px;" class="filter-item" placeholder="请输入角色名称" v-model="listQuery.name"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button class="filter-item" type="primary" @click="handleFilter"  icon="el-icon-search">搜索</el-button>
        </el-form-item>
        <el-form-item label="">
          <el-button class="filter-item" type="primary" @click="handleCreate()"  icon="el-icon-plus">新增</el-button>
        </el-form-item>
     </el-form>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" element-loading-text="数据正在加载" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="角色编号" prop="code">
        <template slot-scope="scope">
          <span>{{scope.row.roleId}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="角色名称" prop="name">
        <template slot-scope="scope">
          <span>{{scope.row.roleName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleCreate(scope.row.roleId)">编辑</el-button>
          <el-button  size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.currentPage" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="this.total">
      </el-pagination>
    </div>

    <!-- 新增/编辑 对话框 -->
    <edit-role v-if="addOrUpdateVisible"  :dialogStatus="dialog.status" ref="addandupdrole"  @refreshDataList="getList"></edit-role>
  </div>
</template>

<script>
import roleAddAndUpdate from "./edit_role";
import { fetchPage,deleteRole } from "@/api/auth/role";
import { debuglog } from 'util';

export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      row: "",
      reList: [],
      listLoading: true,
      roleId: "",
      addOrUpdateVisible: false,
      listQuery: {
        currentPage: 1,
        pageSize: 10,
        name: undefined,
        sort: ""
      },
      props: {
        id: "id",
        label: "name",
        children: "children"
      },
      dialog: {
        status: "",
        visible: false
      }
    };
  },
  components: {
    "edit-role": roleAddAndUpdate
  },
  filters: {},
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.$loading.open();
      fetchPage(this.listQuery).then(response => {
        this.list = response.data.data.list;
        this.total = response.data.data.total;
        this.listLoading = false;
        this.$loading.close();
      });
    },
    handleFilter() {
      this.listQuery.currentPage = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.currentPage = val;
      this.getList();
    },
    handleCreate(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addandupdrole.getResourceTreeList(id);
      });
    },
    handleDelete(row) {
      this.$confirm("确认删除该记录吗?", "提示", {
        type: "warning"
      })
        .then(() => {
          this.$loading.open();
          deleteRole([row.roleId]).then(res => {
            this.$loading.close();
            this.$msg.showSuccess("删除成功");
            this.getList();
          });
        })
    },
    closeDialog() {}
  }
};
</script>

<style scoped>
.btn-container {
  margin-bottom: 10px;
}
</style>
