import axios from 'axios'
import qs from 'qs'
import CONSTANT from '@/lib/Constant'
import util from '@/lib/util'

/**
 * http模块
 * 1.post  post请求
 * 2.get  get请求
 * 3.postImg  指定地址CONSTANT.IMGBASEURL进行文件上传
 * @type {string}
 */

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
let loading = null // loading对象

//配置请求拦截器
axios.interceptors.request.use(config => {    
  // 这里的config包含每次请求的内容
  //console.log('request config:', config)
  return config;
}, err => {
  return Promise.reject(err);
});

//配置响应拦截器
axios.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.resolve(error.response)
});

/*
* 响应拦截step1
* http状态码检测
*/
function checkStatus(response) {
  util.loaded()
  // 如果http状态码正常，则直接返回数据
  if (response && response.status === 200) {
    return response
  }else if(response){
    return {
      status: response.status,
      msg: '网络异常'
    }
  }else{
    return {
      status: -1,
      msg: '网络超时'
    }
  }
  
}

/* 
* 响应拦截step2
* 业务数据检测
*/
function checkCode(res, witherror) {
  // 包括网络错误，服务器错误，后端抛出的错误
  if (!(res.status === 200)) {
    util.hkAlert('网络状态' + res.status + ',' +  res.msg)
  } 
  // 业务操作失败
  if (res.data && res.data.result[0].code != 0 && !witherror) {
    util.hkAlert(res.data.result[0].msg || '接口异常，未返回任何业务错误信息！')
  }
  return res.data
}

export default {
  /**
   * post
   * @param url 请求地址
   * @param data  数据
   * @param witherror  是否拦截业务错误
   * @returns {Promise<AxiosResponse<any>>}
   */
  post(url, data, witherror) {  //  post
    // 添加loading
    util.loading('Loading...',5000)
    return axios.post(url, qs.stringify(data),{
      baseURL: CONSTANT.BASEURL,
      timeout: 10000,
      //data: qs.stringify(data),
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res,witherror)
      }
    )
  },
  /**
   * get
   * @param url  请求地址
   * @param params  数据
   * @returns {Promise<AxiosResponse<any>>}
   */
  get(url, params) {  // get
    // 添加loading
    util.loading('Loading...',5000)
    return axios.get(url, {
      baseURL: CONSTANT.BASEURL,
      params: params, // get 请求时带的参数
      timeout: 5000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(
      (response) => {
        return checkStatus(response)
      }
    ).then(
      (res) => {
        return checkCode(res)
      }
    )
  },
  /**
   * 
   * @param param 数据
   * @param witherror 是否拦截业务错误
   * @returns {Promise<AxiosResponse<any>>}
   */
  postImg(param, witherror){
    var timeout = 5*60*1000
    let config = {
      headers: {'Content-Type': 'multipart/form-data'},
      timeout: timeout,  // 5分钟超时
      baseURL: CONSTANT.IMGBASEURL,
    }
    // 添加loading
    util.loading('Loading...',timeout)
    // 添加请求头
    return axios.post('/upload/1.0', param, config)
      .then(
        (response) => {
          return checkStatus(response)
        }
      ).then(
      (res) => {
        return checkCode(res,witherror)
      }
    )
  }
}