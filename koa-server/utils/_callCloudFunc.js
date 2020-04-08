const rp = require('request-promise')
const _getToken = require('./_getToken')
const { ENV } = require('../config')

/**
 * 
 * @param {string} name 需要调用的云函数名称
 * @param {Object} opts 需要传递给云函数的post请求体
 * @return {string} 云函数调用返回数据
 */
const _callCloudFunc = async (name, opts) => {
  const access_token = await _getToken()
  const url = `https://api.weixin.qq.com/tcb/invokecloudfunction?access_token=${access_token}&env=${ENV}&name=${name}`

  const options = {
    method: 'POST',
    uri: url,
    body: {
      ...opts
    },
    json: true
  }
  return await rp(options)
}

module.exports = _callCloudFunc