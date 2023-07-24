import http from '../myAxios/http.js'; // 引入封装好的方法
export default {
    //登录接口
    login( params) {
        return http.get(`api/books/page`, params,)
    }
}
