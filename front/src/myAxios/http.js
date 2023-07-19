import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '../router';
const service = axios.create({});
// 添加请求拦截器
service.interceptors.request.use(
    (config) => {
        if (localStorage.getItem('token')) {
            config.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
        }
        if(config.url == 'api/login'){
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        }
        config.url = config.url;
        return config;
    },
    (error) => {

        return Promise.reject(error);
    }
);
// 添加响应拦截器
service.interceptors.response.use(
    (response) => {
        const res = response.data;
        return res;
    },
    (error) => {
        let text = ''
        const err = error.response
        if (err.status) {
            switch (err.status) {
                case 400:
                    text = '请求参数错误(400)'
                    break
                case 401:
                    text = '登陆信息已失效,请重新登陆！'
                    return router.replace('/login')
                case 403:
                    text = '拒绝访问(403)'
                    break
                case 404:
                    text = '请求出错(404)'
                    break
                case 408:
                    text = '请求超时(408)'
                    break
                case 500:
                    text = '服务器错误(500)，请重启软件或切换功能页！'
                    break
                case 501:
                    text = '服务未实现(501)'
                    break
                case 502:
                    text = '网络错误(502)'
                    break
                case 503:
                    text = '服务不可用(503)'
                    break
                case 504:
                    text = '网络超时(504)'
                    break
                case 505:
                    text = 'HTTP版本不受支持(505)'
                    break
                default:
                    text = '网络连接出错'
            }
        } else {
            text = '出错了,请重试！'
        }
        ElMessage({
            message: text,
            type: 'error',
            duration: 5 * 1000,
        });

        return Promise.reject(error);
    }
);

const http = {
    /**
     * methods: get
     * @param url 请求地址
     * @param params 请求参数
     */
    get(url, params, responseType) {
      return new Promise((resolve, reject) => {
        service
          .get(
            url,
            {
              params: params
            },
            { responseType: responseType }
          )
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err.data)
          })
      })
    },
    /**
     * methods: post
     * @param url 请求地址
     * @param params 请求参数
     */
    post(url, params, responseType) {
      return new Promise((resolve, reject) => {
        service
          .post(url, params, { responseType: responseType })
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err.data)
          })
      })
    },
    /**
     * methods: put
     * @param url 请求地址
     * @param params 请求参数
     */
    put(url, params) {
      return new Promise((resolve, reject) => {
        service
          .put(url, params)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err.data)
          })
      })
    },
    /**
     * methods: delete
     * @param url 请求地址
     * @param params 请求参数
     */
    delete(url, params) {
      return new Promise((resolve, reject) => {
        service
          .delete(url, params)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err.data)
          })
      })
    }
  }
  export default http;