<template>
  <div class="login_container">
    <div class="modal_box">
      <div class="login_info">
        <p>新用户注册</p>
        <el-form
          ref="ruleFormRef"
          :rules="rules"
          :label-position="labelPosition"
          label-width="100px"
          size="large"
          :model="formLabelAlign"
          style="max-width: 460px"
        >
          <el-form-item label="账号" prop="uid">
            <el-input v-model="formLabelAlign.uid" placeholder="请输入账号" />
          </el-form-item>
          <el-form-item label="姓名" prop="uname">
            <el-input v-model="formLabelAlign.uname" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="手机号" prop="uphone">
            <el-input
              v-model="formLabelAlign.uphone"
              placeholder="请输入手机号"
            />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input
              v-model="formLabelAlign.password"
              @keydown.enter="handle_login"
              placeholder="请输入密码"
              type="password"
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="_password">
            <el-input
              v-model="formLabelAlign._password"
              @keydown.enter="handle_login"
              placeholder="再次输入密码"
              type="password"
            />
          </el-form-item>
          <el-form-item label="验证码" prop="checkCode">
            <el-row>
              <el-col :span="13">
                <el-input
                  v-model="formLabelAlign.checkCode"
                  @keydown.enter="handle_login"
                  placeholder="请输入验证码"
                  type="password"
                />
              </el-col>
              <el-col :span="3" :offset="1">
                <img
                  id="img_check"
                  src="/api/checkCode"
                  title="看不清?点击换一张"
                  alt="加载失败"
                  @click="freshCheckCode"
                />
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <el-button type="primary" class="login_btn" @click="handle_login"
          >注册</el-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api/login.js";
import { useUserInfoStore } from "../stores/user";

interface RuleForm {
  uid: string;
  uname: string;
  uphone: string;
  password: string;
  _password: string;
  checkCode: string;
}
const labelPosition = ref("left");
const router: any = useRouter();
const formLabelAlign = reactive({
  username: "",
  password: "",
  uid: "",
  uname: "",
  uphone: "",
  _password: "",
  checkCode: "",
});

const rules = reactive<FormRules<RuleForm>>({
  uname: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  uid: [
    {
      required: true,
      message: "请输入账号",
      trigger: "blur",
    },
  ],
  uphone: [
    {
      required: true,
      message: "请输入手机号",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
  ],
  _password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "change",
    },
  ],
  checkCode: [
    {
      required: true,
      message: "请输入验证码",
      trigger: "blur",
    },
  ],
});

const userStore = useUserInfoStore();
const handle_login = () => {
  if (formLabelAlign.username == "" || formLabelAlign.password == "") {
    ElMessage({
      message: "请输入用户名或密码!",
      type: "warning",
    });
  } else {
    api.login(formLabelAlign).then(async (res: any) => {
      if (res.code == "20001") {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("uidentity", res.data.user.uidentity);
        userStore.userName = res.data.user.uname;
        userStore.firstName = res.data.user.uname.charAt(0);
        userStore.uidentity = res.data.user.uidentity;
        userStore.uid = res.data.user.uid;
        router.push("/main");
      }
      ElMessage({
        message:
          res.code == "20001"
            ? "您好," + userStore.userName + "!" + res.msg
            : res.msg,
        type: res.code == "20001" ? "success" : "error",
      });
    });
  }
};
//刷新验证码
const freshCheckCode = () => {
  document.getElementById("img_check").src =
    "/api/checkCode?id=" + new Date().getTime();
};
</script>

<style scoped lang="less">
:deep(.el-form-item__label) {
  color: #fff;
}
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
  background-color: #00000080;
}
.login_info {
  backdrop-filter: blur(5px);
  box-shadow: inset 1px 1px 6px rgba(255, 255, 255, 0.5),
    2px 2px 15px rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  width: 500px;
  color: #fff;
  height: 600px;
  padding: 20px 50px;
  position: relative;
  z-index: 100;
  p {
    margin: 20px 0px;
    font-size: 30px;
    font-weight: bold;
    text-align: center;
  }
  :deep(.el-input__inner) {
    background: transparent;
    outline: none;
    color: #fff;
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
