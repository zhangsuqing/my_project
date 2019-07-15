<template>
  <el-dialog :title="!dataForm.id ? '菜单新增' : '菜单编辑'" :close-on-click-modal="false" :visible.sync="visible" width="40%">
    <el-alert title="提示" type="warning" show-icon class="clearfix" description="
              注意：一级菜单访问地址为名字简称。如：usermanager！/n
              二级菜单访问地址为页面路径。如：auth/menu/menu
              菜单的上级菜单只能是一级和二级，按钮的上级菜单只能是三级
            ">
    </el-alert>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="20%" style="width:85%; margin:auto;">
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio v-for="(type, index) in dataForm.typeList" :label="index" :key="index" @change="radioChange(type)">{{ type }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="dataForm.typeList[dataForm.type] + '名称'" prop="name">
        <el-input v-model="dataForm.name" :placeholder="dataForm.typeList[dataForm.type] + '名称'"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单" prop="parentName">
        <el-popover ref="menuListPopover" placement="bottom-start" trigger="click" style="height: 250px;min-width:300px!important;">
          <el-tree 
            style="height: 230px;min-width:280px!important; overflow-y: scroll;overflow-x:visible" 
            :data="menuList" 
            :props="menuListTreeProps" 
            node-key="menuId" 
            ref="menuListTree"
            @current-change="menuListTreeCurrentChangeHandle" 
            :default-expanded-keys="[0]" 
            :highlight-current="true" 
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" placeholder="点击选择上级菜单" class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type == 1" label="访问路径" prop="url">
        <el-input v-model="dataForm.url" :placeholder="placeholderUri"></el-input>
      </el-form-item>
      <el-form-item label="排序号" prop="orderNum">
        <el-input-number v-model="dataForm.orderNum" :min="0" label="排序号" style="width:100%"></el-input-number>
      </el-form-item>
      <!-- <el-form-item v-if="dataForm.type !== 2" label="菜单图标" prop="icon">
        <el-row>
          <el-col :span="22">
             <el-popover
              ref="iconListPopover"
              placement="bottom-start"
              trigger="click"
              popper-class="mod-menu__icon-popover">
              <div class="mod-menu__icon-inner">
                <div class="mod-menu__icon-list">
                  <el-button
                    v-for="(item, index) in iconList"
                    :key="index"
                    @click="iconActiveHandle(item)"
                    :class="{ 'is-active': item === dataForm.icon }">
                    <icon-svg :name="item"></icon-svg>
                  </el-button>
                </div>
              </div>
            </el-popover>
            <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="true" placeholder="菜单图标名称" class="icon-list__input"></el-input>
          </el-col>
        </el-row>
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from "@/utils";
import {
  getParentMenuList,
  addMenu,
  getMenuInfo,
  updateMenu
} from "@/api/auth/menu";
export default {
  data() {
    var validateUrl = (rule, value, callback) => {
      if (!/\S/.test(value)) {
        callback(new Error("访问路径不能为空！"));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      methodList: [
        { key: "post", label: "post" },
        { key: "get", label: "get" }
      ],
      parentLevel: 0,
      placeholderUri:"请输入菜单简称，如：auth",
      dataForm: {
        id: 0,
        menuId:0,
        type: 0,
        typeList: ["目录","菜单", "按钮"],
        name: "",
        parentId: 0,
        parentName: "",
        url: "",
        perms:'1212',
        code: "",
        orderNum: 0,
        icon: "121",
        method: "",
        flag: false,
      },
      iconList: [],
      dataRule: {
        name: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" },
          { max: 50, message: "最多输入 50 个字符", trigger: "blur" }
        ],
        parentName: [
          { required: true, message: "上级菜单不能为空", trigger: "change" },
          { max: 50, message: "最多输入 50 个字符", trigger: "blur" }
        ],
        url: [
          { required: true, validator: validateUrl, trigger: "blur" },
          { max: 100, message: "最多输入 100 个字符", trigger: "blur" }
        ],
        method: [
          { required: true, message: "访问方式不能为空", trigger: "change" }
        ],
        // code: [
        //   { required: true, message: "授权标识不能为空", trigger: "change" }
        // ],
        // icon: [
        //   { required: true, message: "菜单图标不能为空", trigger: "change" }
        // ]
      },
      menuList: [],
      menuListTreeProps: {
        label: "name",
        children: "children"
      }
    };
  },
  created() {
    // this.iconList = Icon.getNameList();
  },
  methods: {
    init(id) {
      this.dataForm.id = id;
      this.dataForm.menuId = id;
      getParentMenuList()
        .then(response => {
          this.menuList = treeDataTranslate(response.data.data, "menuId");
        })
        .then(() => {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs["dataForm"].resetFields();
          });
        })
        .then(() => {
          if (!this.dataForm.id) {
            // 新增
            this.menuListTreeSetCurrentNode();
          } else {
            // 修改
            getMenuInfo(this.dataForm.id).then(response => {
              if (response.data && response.data.code === "200") {
                var data = response.data.data;
                this.dataForm.id = data.id;
                this.dataForm.type = data.type;
                this.dataForm.name = data.name;
                this.dataForm.parentId = data.parentId;
                this.dataForm.url = data.url;
                // this.dataForm.method = data.method;
                this.dataForm.orderNum = data.orderNum;
                this.dataForm.icon = data.icon;
                this.menuListTreeSetCurrentNode();
              }
            });
          }
        });
    },
    //单选按钮change事件
    radioChange(type) {
      if (type == 0) {
        this.dataForm.uri = "";
        this.dataForm.icon = "";
        this.dataForm.parentId = 0;
      } else {
        this.dataForm.parentId = 0;
      }
      this.menuListTreeSetCurrentNode();
    },
    // 菜单树选中
    menuListTreeCurrentChangeHandle(data, node) {
      if (this.dataForm.type == 0 && data._level > 1) {
        this.$msg.showWarning("当前菜单不能作为上级菜单,请更换！");
        return;
      }
      if (this.dataForm.type == 1 && data._level > 2) {
        this.$msg.showWarning("当前菜单不能作为上级菜单,请更换！");
        return;
      }
      if (this.dataForm.type == 2 && data._level != 3) {
        this.$msg.showWarning("当前菜单不能作为上级菜单,请更换！");
        return;
      }
      if (data._level == 2) {
        this.placeholderUri = "请输入页面地址，如:system/setting/index";
      }
      if (data._level == 1) {
        this.placeholderUri = "请输入菜单简称，如：auth";
      }
      this.parentLevel = data._level;
      this.dataForm.parentId = data.menuId;
      this.dataForm.parentName = data.name;
    },
    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode() {
      this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId);
      this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() ||
        {})["name"];
    },
    // 图标选中
    iconActiveHandle(iconName) {
      this.dataForm.icon = iconName;
    },
    // 表单提交
    dataFormSubmit() {
      if (this.dataForm.type == 1 && this.dataForm.parentId == 0) {
        this.$msg.showSuccess("请更换上级菜单");
        return;
      }
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          if (!this.dataForm.menuId) {
            this.$confirm("确定进行[新增]操作?", "提示", {
              type: "warning"
            }).then(response => {
              this.$loading.open();
              addMenu(this.dataForm).then(response => {
                if (response.data.state == "true") {
                  let callback = () => {
                    this.visible = false;
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
            this.$confirm("确定进行[编辑]操作?", "提示", {
              type: "warning"
            }).then(response => {
              this.$loading.open();
              updateMenu(this.dataForm).then(response => {
                if (response.data.state == "true") {
                  let callback = () => {
                    this.visible = false;
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
    }
  }
};
</script>

<style lang="scss">
.el-popper[x-placement^="top"] {
  overflow-y: scroll;
  min-width: 200px;
}
.mod-menu {
  .menu-list__input,
  .icon-list__input {
    > .el-input__inner {
      cursor: pointer;
    }
  }
  &__icon-popover {
    max-width: 27%;
  }
  &__icon-list {
    max-height: 250px;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
  .icon-list__tips {
    font-size: 18px;
    text-align: center;
    color: #e6a23c;
    cursor: pointer;
  }
}
</style>
