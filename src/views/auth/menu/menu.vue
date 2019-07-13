<template>
    <div class="mod-user">
      <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="">
            <el-button class="filter-item" icon="el-icon-plus"  @click="addOrUpdateHandle()" type="primary">新增</el-button>
          </el-form-item>
      </el-form>
    <el-table 
      :data="dataList" 
      height="740px" 
      row-key="menuId"
      v-loading="listLoading" 
      element-loading-text="数据正在加载" 
      border
      style="width: 100%">
      <el-table-column
        prop="name"
        header-align="center"
        width="150"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="parentName"
        header-align="center"
        align="center"
        label="上级菜单">
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="url"
        header-align="center"
        align="center"
        :show-overflow-tooltip="true"
        label="菜单URL">
      </el-table-column>
       <el-table-column
        prop="orderNum"
        header-align="center"
        align="center"
        label="排序号">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="addOrUpdateHandle(scope.row.menuId)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteHandle(scope.row.menuId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from "./menu-add-or-update";
import { treeDataTranslate } from "@/utils";
import { getMenuList,deleteMenu } from "@/api/auth/menu";
export default {
  data() {
    return {
      dataForm: {},
      dataList: [],
      listLoading: false,
      addOrUpdateVisible: false
    };
  },
  components: {
    AddOrUpdate
  },
  created() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.$loading.open();
      this.listLoading = true;
      getMenuList().then(response => {
        this.dataList = treeDataTranslate(response.data.data, "menuId");
        this.listLoading = false;
        this.$loading.close();
      });
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 删除
    deleteHandle(id) {
      this.$confirm(`确定进行[删除]操作?`, "提示", {
        type: "warning"
      }).then(() => {
        this.$loading.open();
        deleteMenu(id).then(response => {
          if (response.data.code === '200') {
            this.$msg.showSuccess('删除成功')
            this.getDataList();
          } else {
          this.$msg.showError(1,response.data.msg)
          this.$loading.close();
          }
        })
      }).catch(() => {});
    }
  }
};
</script>
