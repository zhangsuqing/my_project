<template>
  <el-dialog width="60%" :title="!dataForm.id ? '角色新增' : '角色编辑'" :visible="myVisible" :before-close="handleCancel" :close-on-click-modal=false>
    <el-form :rules="rules" ref="dataForm" :model="dataForm" label-position="right" label-width="100px" style='margin:20px;'>
      <el-row>
        <el-col :span="12">
          <el-tabs type="border-card">
            <el-tab-pane label="角色基本信息">
              <div style="height:300px; ">
                <el-form-item label="角色编号" prop="remark">
                  <el-input placeholder="请填写角色编号" v-bind:disabled="disabledInput" v-model.trim="dataForm.remark"></el-input>
                </el-form-item>
                <el-form-item label="角色名称" prop="roleName">
                  <el-input placeholder="请填写角色名称" v-model.trim="dataForm.roleName"></el-input>
                </el-form-item>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="12">
          <el-tabs type="border-card">
            <el-tab-pane label="授权">
              <div style="height:300px; overflow-y:scroll; ">
                <el-tree
                :data="menuList"
                :props="menuListTreeProps"
                node-key="menuId"
                ref="menuListTree"
                :default-expand-all="true"
                show-checkbox>
              </el-tree>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <!-- <el-col :span="8">
          <el-tabs type="border-card">
            <el-tab-pane label="接口">
              <div style="height:300px; overflow-y:scroll; ">
                <el-tree :data="interList" :props="interListTreeProps" node-key="id" ref="interListTree" :default-expand-all="true" show-checkbox>
                </el-tree>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col> -->
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="myVisible = false">取消</el-button>
      <!-- <el-button @click="selectsss">查询已有角色</el-button> -->
      <el-button type="primary" v-bind:loading="buttonLoading" @click="dataFormSubmit">保存</el-button>
    </div>
  </el-dialog>

</template>

<script>
import { validPhone, validateEmail } from "@/utils/validate";
import { addRole, updRole, getRoleInfo } from "@/api/auth/role";
// import { getParentMenuList, getParentInterfaceList } from "@/api/auth/resource";
import { getParentMenuList } from "@/api/auth/menu";
// import { addRoleResource, selectResourceByid } from "@/api/auth/roleResource";
import { treeDataTranslate } from "@/utils";

export default {
  props: ["dialogStatus", "dialogFormVisible"],
  data() {
    return {
      myVisible: this.dialogFormVisible,
      buttonLoading: false,
      disabledInput: false,
      tempKey: "-1",
      menuList: [],
      menuListTreeProps: {
        label: "name",
        children: "children"
      },
      interListTreeProps: {
        label: "name",
        children: "children"
      },
      roleListData: [],
      reList: [],
      statusMap: {
        create: "新增",
        update: "编辑"
      },
      dataForm: {
        id: 0,
        roleId:0,
        code: "",
        roleName: "",
        remark:'12',
        menuIdList: [],
        interList: []
      },
      props: {
        id: "id",
        label: "name",
        children: "children"
      },
      rules: {
        //username: [{ required: true, message: '用户名不能为空' }],
        remark: [
          { required: true, message: "角色编号不能为空" },
          { max: 50, message: "最多输入 50 个字符", trigger: "blur" }
        ],
        roleName: [
          { required: true, trigger: "blur", message: "角色名称不能为空" },
          { max: 50, message: "最多输入 50 个字符", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    dialogFormVisible(val) {
      // 监听父元件中传来的dialogFormVisible属性是否变化，变化则赋值给副本myVisible
      this.myVisible = val;
    },
    myVisible(val) {
      // 修改父元件的值
      this.$emit("update:dialogFormVisible", val);
    }
  },
  created() {
    // this.getResourceTreeList(id)
  },
  methods: {
    getResourceTreeList(id) {
      this.dataForm.id = id;
      this.dataForm.roleId = id;
      getParentMenuList().then(response => {
          this.menuList = treeDataTranslate(response.data.data, "menuId");
      }).then(() => {
        this.myVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].resetFields();
          this.$refs.menuListTree.setCheckedKeys([]);
          // this.$refs.interListTree.setCheckedKeys([]);
        });
      }).then(() => {
        if (!this.dataForm.id) {
          this.disabledInput = false;
          this.buttonLoading = false;
          // 新增
          // this.menuListTreeSetCurrentNode()
        } else {
          // 修改
          this.disabledInput = true;
          getRoleInfo(this.dataForm.id).then(response => {
            if (response.data && response.data.code === "200") {
              debugger
              var data = response.data.data;
              this.dataForm.remark = data.role.remark;
              this.dataForm.roleName = data.role.roleName;
              var idx = data.menuList.indexOf(this.tempKey)
              if (idx !== -1) {
                data.role.menuIdList.splice(idx, data.menuList - idx)
              }
              debugger
              this.$refs.menuListTree.setCheckedKeys(data.menuList);
            }
          });
        }
      });
    },
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          if (!this.dataForm.id) {
            this.dataForm.menuIdList = [].concat(
              this.$refs.menuListTree.getCheckedKeys(),[this.tempKey],
              this.$refs.menuListTree.getHalfCheckedKeys()
            );
            this.$confirm("确定进行[新增]操作?", "提示", {
              type: "warning"
            }).then(() => {
              this.$loading.open();
              addRole(this.dataForm).then(response => {
                if (response.data.state == "true") {
                  let callback = () => {
                    this.myVisible = false;
                    this.$emit("refreshDataList");
                  };
                  this.$msg.showSuccess("新增成功", callback);
                } else {
                  this.$msg.showError(1, response.data.msg);
                  this.$loading.close();
                }
              });
            });
          } else {
            this.dataForm.menuIdList = [].concat(
              this.$refs.menuListTree.getCheckedKeys(),
              [this.tempKey],
              this.$refs.menuListTree.getHalfCheckedKeys()
            );
            this.$confirm("确定进行[编辑]操作?", "提示", {
              type: "warning"
            }).then(() => {
              this.$loading.open();
              updRole(this.dataForm).then(response => {
                if (response.data.state == "true") {
                  let callback = () => {
                    this.myVisible = false;
                    this.$emit("refreshDataList");
                  };
                  this.$msg.showSuccess("编辑成功", callback);
                } else {
                  this.$msg.showError(1, response.data.msg);
                 this.$loading.close();
                }
              });
            });
          }
        } else {
        }
      });
    },
    handleCancel() {
      // 点击叉叉
      this.myVisible = false;
    }
  }
};
</script>
