/* eslint-disable */
var CryptoJS = require('crypto-js')

const en = {
  key: 'bg3c181c7b1e0928c28b2470cb488e90',
  iv: '9144888c83ffa0d6'
}
/**
 * aes加密解密
 * 加密encrypt
 * 解密decrypt
 */
function encrypt(data) {
  var key = CryptoJS.enc.Utf8.parse(en.key)
  var iv = CryptoJS.enc.Utf8.parse(en.iv)
  var encrypted = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString()
}

function decrypt(data) {
  var key = CryptoJS.enc.Utf8.parse(en.key)
  var iv = CryptoJS.enc.Utf8.parse(en.iv)
  // var base64 = CryptoJS.enc.Base64.parse(data)
  // var src = CryptoJS.enc.Base64.stringify(base64)
  var decrypted = CryptoJS.AES.decrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

// const endata = encrypt('http://proxy.hn885.com/m/')
// console.log('encrypt ------ ', endata)
const endata = "Lk8OZOeKRgIQdyzRH7ARIWCfhnBY/EPFrRA8SSGKCB0LlVmDmdf/3tsdGfc2S7vy2nZMxGWmxX5y2E6cWzO53A=="
const dedata = decrypt(endata)
console.log('decrypt ------ ', dedata)