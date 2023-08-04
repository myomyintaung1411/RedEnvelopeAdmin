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

export function option_record(data) { // http://127.0.0.1/ht/get_option_record
  return request({
    url: `/ht/get_option_record`,
    method: 'post',
    data
  })
}

export function withdraw_setup(data) { // http://127.0.0.1/ht/withdraw_setup
  return request({
    url: `/ht/withdraw_setup`,
    method: 'post',
    data
  })
}

export function withdraw_option(data) {
  return request({
    url: `/ht/withdraw_option`,
    method: 'post',
    data
  })
}
