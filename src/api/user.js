import request from '@/utils/request'

export function loginApi(data) {
  return request({
    url: '/ht/login',
    method: 'post',
    data
  })
}

export function recaptchaApi() {
  return request({
    url: '/recaptcha',
    method: 'get'
  })
}

export function profileApi() {
  return request({
    url: '/profile',
    method: 'get'
  })
}

export function logoutApi() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
export function loginRecord(data) {
  return request({
    url: '/ht/get_login_record',
    method: 'post',
    data
  })
}
export function funRecord(data) {
  return request({
    url: '/ht/get_fund_record',
    method: 'post',
    data
  })
}
export function memberInfo(data) {
  return request({
    url: '/ht/getMemberInfo',
    method: 'post',
    data
  })
}
