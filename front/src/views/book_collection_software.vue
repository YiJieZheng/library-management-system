<template>
  <div>
    <div class="search">
      <div class="select">
        <el-input
          v-model="queryData.bid"
          style="width: 200px"
          placeholder="请输入书籍编号"
        />
        <el-input
          style="width: 200px"
          v-model="queryData.bname"
          placeholder="请输入书籍名称"
        />
        <el-input
          style="width: 200px"
          v-model="queryData.bauthor"
          placeholder="请输入作者名称"
        />
        <el-select
          style="width: 200px"
          v-model="queryData.bstatus"
          placeholder="请选择租借状态"
        >
          <el-option value="已租出" label="已租出"></el-option>
          <el-option value="未租出"></el-option>
        </el-select>
        <el-button type="primary">新增</el-button>
        <el-button type="danger">删除</el-button>
      </div>
      <div class="table_contanier">
        <el-table
          class="myTable"
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :header-cell-style="{ background: '#f4f4f4', color: '#80878f' }"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="selection" align="center" width="50">
          </el-table-column>
          <el-table-column type="index" label="序号" width="100" align="center">
          </el-table-column>
          <el-table-column prop="url" label="图片" align="center">
            <template #default="scope">
              <el-popover
                placement="bottom"
                v-if="scope.row.url"
                width="auto"
                :fallback-placements="['bottom', 'top', 'right', 'left']"
                trigger="hover"
              >
                <img
                  style="width: 300px; height: 350px"
                  @click="handleImg(scope.row.url)"
                  :src="scope.row.url"
                  alt="scope.row.bname"
                />
                <template #reference>
                  <img
                    class="hand"
                    style="width: 40px; height: 60px"
                    :src="scope.row.url"
                    alt="scope.row.bname"
                  />
                </template>
              </el-popover>

              <div
                v-else
                style="
                  width: 40px;
                  height: 60px;
                  margin: 0 auto;
                  line-height: 60px;
                "
              >
                暂无图片
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="bname" label="书名" align="center" sortable>
          </el-table-column>
          <el-table-column prop="bauthor" label="作者" align="center" sortable>
          </el-table-column>
          <el-table-column prop="bstatus" label="状态" align="center" sortable>
          </el-table-column>
          <el-table-column label="操作" align="center" width="300">
            <template #default>
              <el-button
                type="warning"
                size="small"
                plain
                style="margin-right: 10px"
                >修改</el-button
              >

              <el-button slot="reference" type="danger" size="small" plain>
                删除</el-button
              >
              <el-button
                type="primary"
                size="small"
                plain
                style="margin-left: 10px"
                >借阅</el-button
              >
              <el-button
                type="success"
                size="small"
                plain
                style="margin-left: 10px"
                >归还</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import api from "../api/book_collection_software.js";
const route = useRoute();
const multipleSelection = ref([]);
const tableData = ref([{}, {}]);
const queryData = ref({
  bid: "",
  bname: "",
  bauthor: "",
  bstatus: "",
});
const pageInfo = ref({
  currentPage: 1, // 当前页
  sizePage: 10, // 每页显示条数
  totalPage: 0, // 总条数
});
// page=1&size=10&bid=&bname=&bauthor=&bstatus=
//表格颜色
const tableRowClassName = ({ row }: any) => {
  // console.log(row);
  if (row.bstatus == "已借出") {
    return "warning-row";
  } else if (row.bstatus == "未借出") {
    return "success-row";
  }
  return "";
};
//表格内左侧多选框勾选情况
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val;
};
const getData = () => {
  let params = {
    page: 1,
    size: 10,
    id: "",
    bid: "",
  };
  api.getBook(params).then((res: any) => {
    console.log(res);
    tableData.value = res.records;
    pageInfo.value.totalPage = res.total;
  });
};
getData();
//点击图片跳转
const handleImg = (url: string) => {
  window.open(url);
};
</script>

<style scoped>
.search {
  height: 100px;
  width: 100%;

  .select {
    width: 100%;
    height: 52px;
    padding: 10px 20px;
    border-bottom: 2px solid #bbd8d8;
    /* display: flex; */
  }
  .select > * {
    margin-right: 20px;
  }
  .table_contanier {
    height: calc(100% - 52px);
    width: 100%;
    padding: 10px 20px;
  }
}
:deep(.el-table__header thead tr th .el-table__cell){
  background-color: #18dbdb !important;
}
</style>
