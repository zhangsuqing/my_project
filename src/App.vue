<template>
  <transition name="fade">
    <router-view></router-view>
  </transition>
</template>

<script>
  export default {
  }
</script>
<style>
.pagination-container{
  text-align: right;
}
.el-dialog__body {
    padding: 10px 20px!important;
}
.top_header{
  background-color: #F5F6FA;
}
.el-table thead tr th{
   background-color: #F5F6FA!important;
   border-right: 1px solid #ebeef5;
}
.filter-container form .el-form-item {
  margin-bottom: 0px;
}
.el-table__body{
  width:100%;
}
</style>

<style lang="scss">
.my-message {
  /deep/ .el-message-box__content {
    max-height: 400px;
    overflow-y: auto;
  }
}
</style>