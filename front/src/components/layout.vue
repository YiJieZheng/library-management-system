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
    <div class="bottom">
      <div class="left_menu">
        <el-scrollbar>
          <el-menu :default-active="activeIndex">
            <el-menu-item
              v-for="(menu, i) in store.menuList"
              :key="menu.path"
              :index="`${i}`"
              @click="handle_router(menu, i)"
              ><span :class="`iconfont ${menu.meta?.icon}`"></span
              >{{ menu.meta?.title }}</el-menu-item
            >
          </el-menu>
        </el-scrollbar>
      </div>
      <div class="main">
        <router-view v-slot="{ Component }">
          <transition name="slide-fade">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SwitchButton } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { nextTick, onMounted, ref, watchEffect } from "vue";
import { useRoute, useRouter, type RouteRecordRaw } from "vue-router";
import { useUserInfoStore } from "../stores/user";
const store: any = useUserInfoStore();
const router = useRouter();
const route = useRoute();
const menuList = ref([] as RouteRecordRaw[]);
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
    localStorage.clear();
    router.replace("/login");
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
const handle_router = (menu: any, i: number) => {
  store.menuIndex = `${i}`;
  router.push(menu.path);
};
let activeIndex = ref("0");
activeIndex.value = `${store.menuIndex}`;
onMounted(() => {
  watchEffect(() => {
    nextTick(() => {
      store.menuList = [];
      let menus = router.getRoutes().filter((v: any) => {
        if (v.children.length > 0 && v.meta.hidden == false) {
          return v;
        }
      });
      store.menuList = menus.map((v) => {
        return v.children[0];
      });
    });
  });
});
</script>

<style lang="less" scoped>
.container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  color: #fff;
  height: 100%;
  background-color: var(--el-color-primary-light-3);
  .header {
    height: 50px;
    z-index: 10;
    // background: transparent;
    background-color: var(--el-color-primary);
    box-shadow: inset 1px 1px 6px rgba(255, 255, 255, 0.2),
      2px 2px 15px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(20px);
    position: relative;
    p {
      font-size: 34px;
      font-weight: bold;
      line-height: 50px;
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      text-shadow: 1px 1px 2px #ddd, 2px 2px 2px #bbb, 3px 3px 2px #777,
        4px 4px 2px #555, 5px 5px 2px #333, 6px 6px 2px #111;
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
  .bottom {
    width: 100%;
    height: calc(100% - 50px);
    position: absolute;
    top: 50px;
    background-image: linear-gradient(
      to bottom right,
      rgba(79, 154, 138, 0.8),
      rgb(255, 255, 255)
    );
    .left_menu {
      width: 200px;
      height: 100%;
      position: absolute;
      // top: 50px;
      border-right: 1px solid #ffffff74;
      background: transparent;

      backdrop-filter: blur(20px);
      .el-menu {
        border-right: none;
        border-radius: 8px;
        background-color: rgba(187, 216, 216, 0);
      }
      .el-menu-item {
        color: #353535;
        span {
          display: inline-block;
          margin-right: 10px;
        }
      }
      .el-menu-item:hover {
        width: 100%;
        background-color: #4f9a8a;
        font-weight: bold;
        color: #ffc15e;
        transition: all 0.8s;
      }
      .el-menu-item.is-active {
        width: 100%;
        transition: all 0.8s;
        background-color: #4f9a8a;
        // border-top-right-radius: 80%;
        // border-bottom-right-radius: 20%;
        font-weight: bold;
        color: #ffc15e;
      }
    }
    .main {
      width: calc(100% - 200px);
      height: 100%;
      position: absolute;
      // top: 50px;
      left: 200px;
      background: transparent;
      backdrop-filter: blur(20px);
      padding: 20px;
    }
  }
}
</style>
