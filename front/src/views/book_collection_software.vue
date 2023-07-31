<template>
  <div class="search">
    <div class="select">
      <el-input
        style="width: 200px"
        v-model="queryData.bname"
        clearable
        @input="getData"
        placeholder="请输入书籍名称"
      />
      <el-input
        style="width: 200px"
        v-model="queryData.bauthor"
        clearable
        @input="getData"
        placeholder="请输入作者名称"
      />
      <!-- <el-input
        v-model="queryData.press"
        style="width: 200px"
        clearable
        @input="getData"
        placeholder="请输入出版社"
      /> -->
      <el-select
        style="width: 200px"
        v-model="queryData.bstatus"
        @change="getData"
        placeholder="请选择租借状态"
        clearable
      >
        <el-option value="已借出" label="已借出"></el-option>
        <el-option value="未借出" label="未借出"></el-option>
      </el-select>
      <el-button type="primary" v-if="auth" @click="addBook">新增</el-button>
      <el-button type="danger" v-if="auth" @click="deleteByIds">删除</el-button>
    </div>
    <div class="table_contanier">
      <el-table
        height="100%"
        class="myTable"
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :header-cell-style="{ background: '#f4f4f4', color: '#80878f' }"
        :row-class-name="tableRowClassName"
      >
        <el-table-column type="selection" align="center" width="50">
        </el-table-column>
        <el-table-column type="index" label="序号" width="60" align="center">
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
        <el-table-column
          prop="bname"
          label="书名"
          :width="200"
          align="center"
          sortable
        >
          <template #default="scope">
            <el-popover
              placement="bottom"
              v-if="scope.row.bname"
              width="auto"
              :fallback-placements="['bottom', 'top', 'right', 'left']"
              trigger="hover"
            >
              <span>{{ scope.row.bname }}</span>
              <template #reference>
                <span>{{ scope.row.bname.length<=13?scope.row.bname:scope.row.bname.slice(0,10)+'...'}}</span>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="bauthor"
          :width="150"
          label="作者"
          align="center"
          sortable
        >
        </el-table-column>
        <el-table-column prop="bstatus" label="状态" align="center" sortable>
        </el-table-column>
        <el-table-column prop="price" label="价格" align="center" sortable>
        </el-table-column>
        <el-table-column
          prop="originalPrice"
          label="原价"
          align="center"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="press"
          width="100"
          label="出版社"
          align="center"
          sortable
        >
        </el-table-column>
        <el-table-column
          prop="publicationTime"
          width="120"
          label="出版时间"
          align="center"
          sortable
        >
        </el-table-column>
        <el-table-column label="操作" align="center" width="194">
          <template #default="scope">
            <el-button
              type="warning"
              size="small"
              v-if="auth"
              plain
              @click="editBook(scope.row)"
              >修改</el-button
            >
            <el-popconfirm
              title="确定要删除当前图书？"
              @confirm="deleteBook(scope.row.bid)"
              @cancel="cancelEvent"
              v-if="auth"
            >
              <template #reference>
                <el-button slot="reference" type="danger" size="small" plain>
                  删除</el-button
                >
              </template>
            </el-popconfirm>

            <el-button
              type="primary"
              size="small"
              plain
              @click="borrowBook(scope.row)"
              v-if="scope.row.bstatus == '未借出'"
              >借阅</el-button
            >
            <el-button
              type="success"
              size="small"
              plain
              v-else
              @click="returnBook(scope.row)"
              >归还</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          v-model:currentPage="pageInfo.page"
          v-model:page-size="pageInfo.size"
          small="small"
          :page-sizes="[10, 20, 30]"
          :total="Number(pageInfo.totalPage)"
          layout="slot, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
          <span class="pagtotal">共 {{ pageInfo.totalPage }} 条</span>
        </el-pagination>
      </div>
    </div>
    <!--    添加与修改-->
    <el-dialog :title="title" v-model="dialogVisible" width="30%" center>
      <el-form
        ref="ruleFormRef"
        :rules="rules"
        style="text-align: center"
        :model="book"
        label-width="110px"
      >
        <el-form-item label="编号" prop="bid">
          <el-input
            v-model="book.bid"
            style="width: 218px"
            placeholder="请输入书籍编号"
            :disabled="flag"
            v-on:blur="checkBid"
          ></el-input>
        </el-form-item>

        <el-form-item label="书名" prop="bname">
          <el-input
            v-model="book.bname"
            style="width: 218px"
            placeholder="请输入书籍名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="bauthor">
          <el-input
            v-model="book.bauthor"
            style="width: 218px"
            placeholder="请输入作者"
          ></el-input>
        </el-form-item>
        <el-form-item label="图片地址">
          <el-input
            v-model="book.url"
            style="width: 218px"
            placeholder="请输入图片地址"
          ></el-input>
        </el-form-item>
        <el-form-item label="出版社" prop="press">
          <el-input
            v-model="book.press"
            style="width: 218px"
            placeholder="请输入出版社"
          ></el-input>
        </el-form-item>
        <el-form-item label="出版时间" prop="publicationTime">
          <el-date-picker
            v-model="book.publicationTime"
            type="date"
            placeholder="出版时间"
          />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input
            v-model="book.price"
            style="width: 218px"
            placeholder="请输入价格"
          ></el-input>
        </el-form-item>
        <el-form-item label="原价">
          <el-input
            v-model="book.originalPrice"
            style="width: 218px"
            placeholder="请输入价格"
          ></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="bstatus">
          <el-select
            v-model="book.bstatus"
            style="width: 218px"
            clearable
            :disabled="!flag"
          >
            <el-option value="未借出" label="未借出"></el-option>
            <el-option value="已借出" label="已借出"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否为热卖图书">
          <el-switch v-model="book.hot" active-value="1" inactive-value="0" />
        </el-form-item>
        <el-form-item label="是否为飙升图书">
          <el-switch v-model="book.soar" active-value="1" inactive-value="0" />
        </el-form-item>
        <el-form-item label="是否为好评图书">
          <el-switch
            v-model="book.five_stars"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="是否为儿童图书">
          <el-switch
            v-model="book.children"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
        <el-form-item label="是否为特价图书">
          <el-switch
            v-model="book.bargain"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="margin-right: 55px"
            @click="submitForm"
            >提交</el-button
          >
          <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox, type FormInstance } from "element-plus";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import api from "../api/book_collection_software.js";
import { useUserInfoStore } from "../stores/user";
const store = useUserInfoStore();
// 计算权限
const auth = computed(() => {
  return store.uidentity == "admin" ? true : false;
});
const route = useRoute();
const multipleSelection = ref([]);
const tableData = ref([{}, {}]);
const queryData = ref({
  press: "",
  bname: "",
  bauthor: "",
  bstatus: "",
});
const title = ref("新增图书");
const dialogVisible = ref(false);
const ruleFormRef = ref<FormInstance>();
const rules = ref({
  bid: [{ required: true, message: "请输入书籍编号", trigger: "blur" }],
  bname: [{ required: true, message: "请输入书名", trigger: "blur" }],
  bauthor: [{ required: true, message: "请输入作者", trigger: "blur" }],
  bstatus: [{ required: true, message: "请选择状态", trigger: "change" }],
  press: [{ required: true, message: "请输入出版社", trigger: "change" }],
  publicationTime: [
    { required: true, message: "请输入出版时间", trigger: "change" },
  ],
  price: [{ required: true, message: "请输入价格", trigger: "change" }],
});

// 书籍信息
const book = ref({
  bid: "",
  bname: "",
  bauthor: "",
  bstatus: "未借出",
  hot: "0",
  soar: "0",
  five_stars: "0",
  children: "0",
  bargain: "0",
  url: "",
  price: "",
  originalPrice: "",
  press: "",
  publicationTime: "",
});
const flag = ref(false);
//清空dialog中表单中各控件的值
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
  dialogVisible.value = false;
  book.value = {
    bid: "",
    bname: "",
    bauthor: "",
    bstatus: "未借出",
    hot: "0",
    soar: "0",
    five_stars: "0",
    children: "0",
    bargain: "0",
    url: "",
    price: "",
    originalPrice: "",
    press: "",
    publicationTime: "",
  };
};

//添加书籍
const addBook = () => {
  title.value = "添加图书";
  resetForm(ruleFormRef.value);
  dialogVisible.value = true;
  flag.value = false;
};

//验证书籍编号是否存在
const checkBid = async () => {
  if (book.value.bid === "") {
    return false;
  }
  try {
    const res = await api.checkId(book.value.bid);
    if (res.code == 20041) {
      ElMessage({
        type: "error",
        message: "此书籍编号已存在，请换一个",
      });
      return false;
    } else {
      return true;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};
//修改书籍
const editBook = (row: {
  bid: string;
  bname: string;
  bauthor: string;
  bstatus: string;
  hot: string;
  soar: string;
  five_stars: string;
  children: string;
  bargain: string;
  url: string;
  price: string;
  originalPrice: string;
  press: string;
  publicationTime: string;
}) => {
  title.value = "修改图书";
  dialogVisible.value = true;
  flag.value = true;
  book.value = { ...row }; //对象的拷贝，防止修改时，表格中的数据也被修改
};
//提交表单
const submitForm = () => {
  if (
    book === null ||
    book.value.bid === "" ||
    book.value.bname === "" ||
    book.value.bauthor === "" ||
    book.value.bstatus === ""
  ) {
    ElMessage({
      type: "error",
      message: "请填写完整信息",
    });
  } else {
    book.value.price.indexOf("￥") !== -1
      ? (book.value.price = book.value.price)
      : (book.value.price = `￥${book.value.price}`);
    book.value.originalPrice
      ? book.value.originalPrice.indexOf("￥") !== -1
        ? (book.value.originalPrice = book.value.originalPrice)
        : (book.value.originalPrice = `￥${book.value.originalPrice}`)
      : "";
    if (flag.value) {
      //修改书籍信息
      api.updateBook(book.value).then((res: any) => {
        if (res.code == "20031") {
          ElMessage({
            type: "success",
            message: "图书修改成功！",
          });
          resetForm(ruleFormRef.value);
          getData();
        } else {
          ElMessage({
            type: "error",
            message: "修改失败！请联系开发人员！",
          });
        }
      });
    } else {
      //添加书籍信息
      const checkUidPromise = checkBid();
      checkUidPromise.then((result) => {
        if (result) {
          api.addBook(book.value).then((res: any) => {
            console.log(res);
            if (res.code == "20011") {
              ElMessage({
                type: "success",
                message: "添加图书成功！",
              });
              resetForm(ruleFormRef.value);
            } else {
              ElMessage({
                type: "error",
                message: "添加失败！请联系开发人员！",
              });
            }
          });
        }
      });
    }
  }
};

//借阅图书
const borrowBook = (row: { bid: any }) => {
  let borrow = {
    uid: store.uid,
    bid: row.bid,
    bdate: getTime(),
  };
  api.borrowBook(borrow).then((res: { code: string }) => {
    if (res.code == "20011") {
      ElMessage({
        message: "借阅成功",
        type: "success",
      });
      getData();
    } else {
      ElMessage({
        message: "借阅失败！请联系管理员！",
        type: "error",
      });
    }
  });
};

//归还图书
const returnBook = (row: { bid: string }) => {
  let borrow = {
    bid: row.bid,
    rdate: getTime(),
  };
  api.returnBook(borrow).then((res: { code: string }) => {
    if (res.code == "20031") {
      ElMessage({
        message: "归还成功",
        type: "success",
      });
      getData();
    } else {
      ElMessage({
        message: "归还失败！请联系管理员！",
        type: "error",
      });
    }
  });
};

//获取当前时间
const getTime = () => {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  return (
    year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second
  );
};
//删除单个图书
const deleteBook = (id: string) => {
  api.deleteBook(id).then((res: any) => {
    if (res.code == "20021") {
      ElMessage({
        type: "success",
        message: "成功删除",
      });
      getData();
    } else {
      ElMessage({
        type: "error",
        message: "添加失败！请联系开发人员！",
      });
    }
  });
};
//取消删除
const cancelEvent = () => {
  ElMessage({
    type: "info",
    message: "取消删除",
  });
};
const pageInfo = ref({
  page: 1, // 当前页
  size: 10, // 每页显示条数
  totalPage: 0, // 总条数
});
//批量删除
const deleteByIds = () => {
  if (multipleSelection.value.length == 0)
    ElMessage({
      type: "warning",
      message: "请至少选择一项",
    });
  else {
    //弹出提示框
    ElMessageBox.confirm("此操作将永久删除这些数据, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        let ids: string[] = [];
        multipleSelection.value.forEach((item: { bid: string }) => {
          ids.push(item.bid);
        });
        console.log("ids", ids);
        api.deleteBooks(ids).then((res: { code: string }) => {
          if (res.code == "20021") {
            getData();
            ElMessage({
              type: "success",
              message: "批量删除成功！",
            });
          } else {
            ElMessage({
              type: "error",
              message: "批量删除失败！请联系开发人员！",
            });
          }
        });
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消删除",
        });
      });
  }
};
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
  console.log("multipleSelection.value", multipleSelection.value);
};
const getData = () => {
  let params = {
    page: pageInfo.value.page,
    size: pageInfo.value.size,
    bname: queryData.value.bname,
    bauthor: queryData.value.bauthor,
    bstatus: queryData.value.bstatus,
    press: queryData.value.press,
  };
  api.getBook(params).then((res: any) => {
    tableData.value = res.records;
    pageInfo.value.totalPage = res.total;
  });
};
getData();
//点击图片跳转
const handleImg = (url: string) => {
  window.open(url);
};
// 选择每页展示多少数据
const handleSizeChange = (size: any | number) => {
  pageInfo.value.size = size;
  pageInfo.value.page = 1;
  getData();
};
// 选择第几页
const handleCurrentChange = (val: any | number) => {
  pageInfo.value.page = val;
  getData();
};
</script>

<style scoped>
:deep(.el-input__wrapper) {
  background: transparent;
  outline: none;
}
:deep(.el-table th) {
  background: transparent !important;
  color: #000 !important;
  font-weight: 700 !important;
}
:deep(.el-table-fixed-column--left) {
  background: rgba(0, 0, 0, 0) !important;
}
:deep(.el-table-fixed-column--left :hover) {
  background: #88b6a9 !important;
}
.search {
  height: 100%;
  width: 100%;

  .select {
    width: 100%;
    height: 52px;
    padding: 10px 0px;
  }
  .select > * {
    margin-right: 20px;
  }
  .table_contanier {
    height: calc(100% - 102px);
    width: 100%;
    padding: 10px 20px;
    position: relative;
  }
  .pagination {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: end;
    align-items: center;
  }
}
:deep(.el-table__header thead tr th .el-table__cell) {
  background-color: #18dbdb !important;
}
:deep(.el-switch__core) {
  background-color: #ffffff00;
}
</style>
