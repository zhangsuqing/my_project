<template>
  <el-dialog width="60%" :title="!dataForm.id ? '用户新增' : '用户编辑'" :visible="myVisible" :before-close="handleCancel" :close-on-click-modal=false>
    <el-form :rules="rules" ref="dataForm" :model="dataForm" label-position="right" label-width="100px" style='margin:20px;'>
      <el-row>
        <el-col :span="16">
          <el-tabs type="border-card" style="height:380px">
            <el-tab-pane label="用户基本信息">
              <el-form-item label="账号" prop="username">
                <el-input placeholder="请填写账号" v-bind:disabled="disabledInput" v-model.trim="dataForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password" v-if="!dataForm.id">
                <el-input type="password" placeholder="请填写密码" v-model.trim="dataForm.password"></el-input>
              </el-form-item>
              <el-form-item label="密码" v-else>
                <el-input type="password" placeholder="请输入修改后的密码" v-model.trim="dataForm.password"></el-input>
              </el-form-item>
              <el-form-item label="账户状态">
                <el-radio-group v-model="dataForm.status">
                  <el-radio class="radio" :label="1">正常</el-radio>
                  <el-radio class="radio" :label="2">锁定</el-radio>
                  <!-- <el-radio class="radio" :label="3">删除</el-radio>
                  <el-radio class="radio" :label="4">非法</el-radio> -->
                </el-radio-group>
              </el-form-item>
              <el-form-item label="手机号码" prop="mobile">
                <el-input placeholder="请填写手机号码" v-model="dataForm.mobile"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input placeholder="请填写邮箱" v-model="dataForm.email"></el-input>
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="8">
          <el-tabs type="border-card" style="height:380px">
            <el-tab-pane label="上传头像">
              <el-form ref="dataForm" :model="dataForm" >
                <el-upload class="avatar-uploader" action="" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                  <img v-if="imageUrl" :src="imageUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <!-- <el-form-item label="角色"> -->
          <el-card class="box-card">
            <div class="text item">
              <el-form-item label="角色">
                <el-checkbox-group v-model="roleListDataByid">
                  <el-checkbox v-for="city in roleListDataList" :label="city.key" :key="city.key" @change="roleChanges">{{city.label}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
          </el-card>
          <!-- </el-form-item> -->
        </el-col>
      </el-row>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="myVisible = false">取消</el-button>
      <!-- <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">保存</el-button> -->
      <el-button type="primary" @click="dataFormSubmit">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { isMobile, isEmail } from "@/utils/validate";
import {
  addUser,
  updUser,
  getUserInfo
  // uploadPicture
} from "@/api/auth/user";
// import { insertUserRole } from "@/api/auth/roleUser";
import { fetchRoleList } from "@/api/auth/role";
import head_Png from "@/assets/default_head_title.png";

export default {
  props: ["dialogStatus", "dialogFormVisible"],
  data() {
    const idValidatePhone = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error("请输入正确的手机号码"));
      } else {
        callback();
      }
    };
    const idValidateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error("请输入正确的邮箱号码"));
      } else {
        callback();
      }
    };
    return {
       head_Png,
      myVisible: this.dialogFormVisible,
      disabledInput: false,
      imageUrl: '',
      roleListDataList: [],
      roleListDataByid: [],
      checkListData: [],
      statusMap: {
        create: "新增",
        update: "编辑"
      },
      dataForm: {
        id: 0,
        userId:0,
        username: "",
        password: "",
        avatar: "",
        mobile: "",
        email: "",
        status: 1,
        account: "",
        roleList: []
      },
      rules: {
        username: [
          { required: true, message: "用户名不能为空" },
          { max: 30, message: "最多输入 30 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空" },
          { max: 50, message: "最多输入 50 个字符", trigger: "blur" }
        ],
        realName: [{ max: 30, message: "最多输入 30 个字符", trigger: "blur" }],
        phone: [
          { required: true, trigger: "blur", validator: idValidatePhone },
          { max: 20, message: "最多输入 20 个字符", trigger: "blur" }
        ],
        email: [
          { required: true, trigger: "blur", validator: idValidateEmail },
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
    //  this.selectList()
  },
  methods: {
    selectList(id) {
      this.dataForm.id = id;
      this.dataForm.userId = id;
      this.roleListDataList = [];
      fetchRoleList()
        .then(response => {
          for (let i = 0; i < response.data.data.length; i++) {
            this.roleListDataList.push({
              key: response.data.data[i].roleId,
              label: response.data.data[i].roleName
            });
          }
        })
        .then(() => {
          this.myVisible = true;
          this.$nextTick(() => {
            this.handleCreate = [];
            this.$refs["dataForm"].resetFields();
          });
        })
        .then(() => {
          if (!this.dataForm.id) {
            this.disabledInput = false;
            this.roleListDataByid = [];
            this.resetDataForm();
            this.imageUrl = this.head_Png
          } else {
            this.disabledInput = true;
            // 修改
            getUserInfo(this.dataForm.id).then(response => {
              if (response.data && response.data.code === "200") {
                var data = response.data.data;
                this.dataForm.username = data.user.username;
                // this.dataForm.avatar = data.avatar;
                this.dataForm.mobile = data.user.mobile;
                this.dataForm.email = data.user.email;
                this.dataForm.status = data.user.status;
                // this.dataForm.account = data.account;
                this.roleListDataByid = data.roleList;
                this.checkListData = this.roleListDataByid;
                // if(data.avatar!=null && data.avatar!=""){
                //   this.imageUrl = "data:image/jpg;base64," + data.avatar;
                // }else{
                  this.imageUrl = this.head_Png
                // }
                this.dataForm.password = "";
              }
            });
          }
        });
    },
    roleChanges(row) {
      this.checkListData = this.roleListDataByid;
    },
    resetDataForm() {
      this.dataForm = {
        id: 0,
        username: "",
        password: "",
        realName: "",
        avatar: "",
        phone: "",
        email: "",
        sex: "",
        status: 1,
        account: "",
        roleIdList: []
      };
    },
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          if (!this.dataForm.id) {
            this.dataForm.roleIdList = this.checkListData;
            this.$confirm("确定进行[新增]操作?", "提示", {
              type: "warning"
            }).then(response => {
             this.$loading.open();
              addUser(this.dataForm).then(response => {
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
            this.dataForm.roleIdList = this.checkListData;
            this.$confirm("确定进行[编辑]操作?", "提示", {
              type: "warning"
            }).then(response => {
              this.$loading.open();
              updUser(this.dataForm).then(response => {
                this.myVisible = false;
                this.$nextTick(function() {
                  if (response.data.state == "true") {
                    let callback = () => {
                      this.myVisible = false;
                      this.$emit("refreshDataList");
                      if (
                        this.$store.getters.username == this.dataForm.username
                      ) {
                        this.$store.commit("SET_AVATAR", this.dataForm.avatar);
                        this.$store.commit('set_user', data.data);
                      }
                    };
                    this.$msg.showSuccess("编辑成功", callback);
                    this.$loading.close();
                  } else {
                    this.$msg.showError(1, response.data.msg);
                    this.$loading.close();
                  }
                });
              });
            });
          }
        } else {
        }
      });
    },
    handleCancel() {
      // 点击叉叉
      var self = this;
      self.myVisible = false;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 1;

      if (!isJPG && !isPNG) {
        this.$msg.showError(1, "上传头像图片 只能是JPG 格式 或者 png格式!");
        return;
      }
      if (!isLt2M) {
        this.$msg.showError(1, "上传头像图片大小不能超过 1MB!");
        return;
      }
      this.uploadFile(file);
      return isJPG && isLt2M;
    },
    uploadFile(file) {
      const formData = new FormData();
      formData.append("file", file);
      // uploadPicture(formData).then(response => {
      //   if (response.data.state === "true") {
      //     this.imageUrl = "data:image/jpg;base64," + response.data.msg;
      //     this.dataForm.avatar = response.data.msg;
      //     this.$msg.showSuccess("上传成功");
      //   } else {
      //     this.$msg.showError(1, response.data.msg);
      //   }
      // });
    }
  }
};
</script>

<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  padding-top: 60px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

