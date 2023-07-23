import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, getk_, geti_ } from '@/utils/auth'
import AES from '@/utils/aes'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers.token = getToken()
    }
    // console.log('config ', config)
    if (config.url.indexOf('upload') == -1) {
      if (config.method == 'post') {
        //let endata = AES.encrypt(JSON.stringify(config.data), { key: getk_(), iv: geti_() })
        //config.data = {data: endata}
       // config.data = data
      }
      
      // if (config.method == 'get') {
      //   let endata = AES.encrypt(JSON.stringify(config.params), { key: getk_(), iv: geti_() })
      //   config.params = {data: endata}
      // }
    }
    
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */
  // "SUCCESS": 1000,
  // "UNAUTHORIZED": 1001,
  // "VALIDATE_FAIL": 1002,
  // "SERVER_ERROR": 1003,
  // "BAD_REQUEST": 1004,
  // "NOT_FOUND": 1005,
  // "ALREADY_EXIST": 1006,
  // "SYSTEM_MAINTENANCE": 1007,
  // "DENIED": 1008,
  // "TOKEN_EXPIRED": 1009
  response => {
    let res = response.data
    console.log('respoonse ', response)
    // if (response.config?.url?.indexOf('/recaptcha') == -1) {
    //   res = AES.decrypt(res, { key: getk_(), iv: geti_() })
    //   res = JSON.parse(res)
    // }
    console.log('response ', res)
        console.log('ccccccccc ', res)
        // return Promise.reject(new Error(res || 'Error'))

        return res
      // } 
      // else {
      //   return res
      // }
    },
  error => {
    console.log('err' + error) // for debug
    let status = error.response.status
    switch (status) {
      case 401 :
        Message({
          message: '此帐户已在另一台设备上登录',
          type: 'error',
          duration: 3 * 1000
        })
        store.dispatch('user/logout')
        return
      case 403 :
        Message({
          message: '会话已过期，请重新登录',
          type: 'error',
          duration: 3 * 1000
        })
        store.dispatch('user/logout')
        return

        default:
          break;
      }
    
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
