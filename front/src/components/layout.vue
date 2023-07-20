<template>
  <div class="container">
    <el-header class="header">
      <p>图书馆管理系统</p>
      <div class="userInfo">
        您好！
        <div class="head_portrait">
          {{ store.firstName }}
        </div>
        {{ store.userName }}
      </div>
      <div class="trigger_screen">
        <span @click="toggleFullscreen" class="hand">
          <!-- <el-icon><FullScreen /></el-icon> -->
          <span v-if="!isFull" class="iconfont icon-quanping"></span>
          <span v-else class="iconfont icon-suoxiao"></span>
        </span>
      </div>

      <div class="logout" @click="logout">
        <el-icon><SwitchButton /></el-icon>
        退出
      </div>
    </el-header>
    <div class="left_menu">
      <el-scrollbar>
        <el-menu :default-openeds="['1']">
          <el-menu-item index="1">Option 1</el-menu-item>
          <el-menu-item index="2">Option 2</el-menu-item>
          <el-menu-item index="3">Option 3</el-menu-item>
          <el-menu-item index="4">Option 4-1</el-menu-item>
        </el-menu>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SwitchButton } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserInfoStore } from "../stores/user";
const store = useUserInfoStore();
const router = useRouter();
const logout = () => {
  ElMessageBox.confirm("确定要退出登录吗?", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    ElMessage({
      type: "success",
      message: "成功退出",
    });
    store.clearInfo();
    router.push("/login");
    localStorage.clear();
  });
};
const isFull = ref(false);
const toggleFullscreen = () => {
  let elem = document.documentElement;
  if (document.fullscreenElement) {
    document.exitFullscreen();
    isFull.value = false;
  } else {
    elem.requestFullscreen();
    isFull.value = true;
  }
};
</script>

<style lang="less" scoped>
.container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  color: #fff;
  height: 100%;
  background-color: rgba(187, 216, 216, 1);
  .header {
    height: 50px;
    width: 100%;
    background-color: rgba(79, 154, 138, 1);
    border-bottom: #000;
    position: relative;
    box-shadow: #64646489 0px 5px 10px;
    p {
      font-size: 34px;
      font-weight: bold;
      line-height: 50px;
      position: absolute;
      left: 50%;
      transform: translate(-50%);
    }
    .userInfo {
      display: flex;
      align-items: center;
      position: absolute;
      bottom: 0;
      left: 10px;
      .head_portrait {
        margin-right: 10px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #ffc15e;
        color: #fff;
        display: flex;
        font-size: 18px;
        font-weight: 800;
        justify-content: center;
        align-items: center;
      }
    }
    .trigger_screen {
      display: flex;
      align-items: center;
      position: absolute;
      bottom: 0;
      right: 70px;
      &:hover {
        color: #ffc15e;
      }
    }
    .logout {
      display: flex;
      align-items: center;
      position: absolute;
      bottom: 0;
      right: 10px;
      cursor: pointer;
      &:hover {
        color: #ffc15e;
        text-decoration: underline;
      }
    }
  }
  .left_menu {
    width: 200px;
    height: calc(100% - 70px);
    position: absolute;
    top: 60px;
    left: 10px;
    box-shadow: #64646489 0px 5px 10px;
    background-color: rgba(79, 154, 138, 1);
    border-radius: 8px;
    .el-menu {
      border-right: none;
      border-radius: 8px;
      background-color: rgba(79, 154, 138, 1);
    }
    .el-menu-item{
        color: #fff;
    }
    .el-menu-item:hover {
      background-color: rgba(187, 216, 216, 1);
      color: #000;
    }
    .el-menu-item.is-active {
    color: #ffc15e;
}
  }
}
</style>
