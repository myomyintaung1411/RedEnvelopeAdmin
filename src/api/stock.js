import request from '@/utils/request'

export function getDashboardApi() {
  return request({
    url: '/ht/get_homepage_data',
    method: 'post'
  })
}

export function upload_article(data) {
  return request({
    url: '/ht/upload_article',
    method: 'post',
    data
  })
}

export function get_article_list(data) {
  return request({
    url: '/ht/get_article_list',
    method: 'post',
    data
  })
}
export function delete_article(data) {
  return request({
    url: '/ht/delete_article',
    method: 'post',
    data
  })
}
export function UploadImage(data) {
  return request({
    url: `/opt/upload`,
    method: 'post',
    data
  })
}
export function upload_chart(data) {
  return request({
    url: `/ht/upload_chart`,
    method: 'post',
    data
  })
}

export function get_chart_list(data) {
  return request({
    url: `/ht/get_chart_list`,
    method: 'post',
    data
  })
}
export function delete_chart(data) {
  return request({
    url: `/ht/delete_chart`,
    method: 'post',
    data
  })
}
export function redpackage_setup(data) {
  return request({
    url: `/ht/redpackage_setup`,
    method: 'post',
    data
  })
}
export function notice_setup(data) {
  return request({
    url: `/ht/notice_setup`,
    method: 'post',
    data
  })
}
export function get_setup(data) { // configlist of redamoumnt money and notice and others
  return request({
    url: `/ht/get_setup`,
    method: 'post',
    data
  })
}

export function referral_setup(data) { // configlist of referral_setup
  return request({
    url: `/ht/referral_setup`,
    method: 'post',
    data
  })
}

// export function option_record(data) { // http://127.0.0.1/ht/get_option_record
//   return request({
//     url: `/ht/get_option_record`,
//     method: 'post',
//     data
//   })
// }

