import http from '../myAxios/http.js'; // 引入封装好的方法
export default {
    //获取图书接口
    getBook( params) {
        return http.get(`api/books/page`, params)
    },
    //添加图书接口
    addBook(params){
        return http.post(`api/books`, params)
    },
    //检查编号是否重复
    checkId(params){
        return http.get(`/api/books/${params}`)
    },
    //删除图书
    deleteBook(params){
        return http.delete(`/api/books/${params}`)
    },
    //批量删除图书
    deleteBooks(ids){
        return http.delete(`/api/books/ids`,{data:ids})
    },
    //更新图书
    updateBook(params){
        return http.put(`api/books`, params)
    },
    //借阅图书
    borrowBook(params){
        return http.post(`api/borrows`,params)
    },
    //归还图书
    returnBook(params){
        return http.put(`/api/borrows/return`,params)
    }
}
