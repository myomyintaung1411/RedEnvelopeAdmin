/* eslint-disable */
import axios from 'axios'

const httpHandler = axios.create({
  headers: { 'Content-Type': 'application/json;charset=utf-8' }, // 即将被发送的自定义请求头
  withCredentials: true // 表示跨域请求时是否需要使用凭证
})

let uribd = process.env.NODE_ENV === 'development' ? 'ipaddr' : 'ipaddr'

/**
 * 请求百度API接口
 * @param {ip} ip IP Address  
 * @returns
 */
export async function getIP(ip) {
  console.log('ip ', ip)
  if (ip == '') return
  
  let url = `${uribd}/api.php?query=${ip}&co=&resource_id=6006&t=1433920989928&ie=utf8&oe=utf-8&format=json`
  let data = await httpHandler.get(url)
  return data
}

