import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getk_() {
  return 'bg3c181c7b1e0928c28b2470cb488e90'
}

export function geti_() {
  return '9144888c83ffa0d6'
}

export function setInfo(info) {
  return Cookies.set("info__", JSON.stringify(info))
}
export function getInfo() {
  return  Cookies.get("info__") ? JSON.parse(Cookies.get("info__")) : ''
}