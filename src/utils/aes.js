/* eslint-disable */
var CryptoJS = require('crypto-js');

export default {
  /**
   * aes加密解密
   * 加密encrypt
   */
  encrypt(data, G_KP) {
    var key = CryptoJS.enc.Utf8.parse(`m9pVsmKHq85o2vzvxltEe0Sg`);
    var iv = CryptoJS.enc.Utf8.parse(`cl0hvia5vnhl1xye`);
    var encrypted = CryptoJS.AES.encrypt(data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString()
  },
  /**
   * 解密decrypt
   * @param {Object} data 
   * @param {Object} G_KP 
   * @returns 
   */
  decrypt(data, G_KP) {
    var key = CryptoJS.enc.Utf8.parse(`m9pVsmKHq85o2vzvxltEe0Sg`);
    var iv = CryptoJS.enc.Utf8.parse(`cl0hvia5vnhl1xye`);
    var decrypted = CryptoJS.AES.decrypt(data, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
  }

};
