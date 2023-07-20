<template>
  <div class="login_container">
    <div class="modal_box">
      <div class="login_info">
        <p>登录</p>
        <el-form
          :label-position="labelPosition"
          label-width="100px"
          size="large"
          :model="formLabelAlign"
          style="max-width: 460px"
        >
          <el-form-item label="">
            <el-input v-model="formLabelAlign.username" placeholder="账号" />
          </el-form-item>
          <el-form-item label="">
            <el-input
              v-model="formLabelAlign.password"
              @keydown.enter="handle_login"
              placeholder="密码"
              type="password"
            />
          </el-form-item>
        </el-form>
        <el-button type="primary" class="login_btn" @click="handle_login"
          >登录</el-button
        >
        <div class="register">
          <span> 还没有账号吗？ </span>
          <span class="blue_text">快来注册吧</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api/login.js";
import { useUserInfoStore } from "../stores/user";
const labelPosition = ref("top");
const router: any = useRouter();
const formLabelAlign = reactive({
  username: "",
  password: "",
});
const store = useUserInfoStore()
const handle_login = () => {
  if (formLabelAlign.username == "" || formLabelAlign.password == "") {
    ElMessage({
      message: "请输入用户名或密码!",
      type: "warning",
    });
  } else {
    api.login(formLabelAlign).then((res: any) => {
      console.log(res);
      if (res.code == "20001") {
        localStorage.setItem("token", res.data.token);
        store.userName = res.data.user.uname
        store.firstName = res.data.user.uname.charAt(0)
        router.push("/");
      }
      ElMessage({
        message:
          res.code == "20001"
            ? "您好," + store.userName + "!" + res.msg
            : res.msg,
        type: res.code == "20001" ? "success" : "error",
      });
    });
  }
};
</script>

<style scoped lang="less">
.login_container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("../assets/img/login_bg.jpg");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.modal_box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #00000073;
}
.login_info {
  background-color: #fffffff5;
  border-radius: 10px;
  width: 500px;
  height: 400px;
  padding: 20px 50px;
  p {
    margin: 40px 0px;
    font-size: 30px;
    font-weight: bold;
    text-align: center;
  }
}
.login_btn {
  width: 100%;
  height: 40px;
  line-height: 40px;
}
.register {
  text-align: right;
  margin-top: 40px;
  .blue_text {
    color: #409eff;
    cursor: pointer;
  }
}
</style>
