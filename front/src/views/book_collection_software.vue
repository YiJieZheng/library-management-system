<template>
  <div>
    <div class="search">
      <el-input v-model="queryData.bid" placeholder="请输入书籍编号" />
      <el-input v-model="queryData.bname" placeholder="请输入书籍名称" />
      <el-input v-model="queryData.bauthor" placeholder="请输入作者名称" />
      <el-select v-model="queryData.bstatus" placeholder="请选择租借状态">
        <el-option value="已租出" label="已租出"></el-option>
        <el-option value="未租出"></el-option>
      </el-select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute()
const queryData = ref({
  bid: "",
  bname: "",
  bauthor: "",
  bstatus: "",
});
// page=1&size=10&bid=&bname=&bauthor=&bstatus=
</script>

<style scoped>
.search {
  height: 100px;
  width: 100%;
  border-bottom: 2px solid #bbd8d8;
}
</style>
