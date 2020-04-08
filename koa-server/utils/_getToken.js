const fs = require('fs')
const path = require('path')
const rp = require('request-promise')
const { APPID, APPSECRET } = require('../config')

const filename = path.resolve(__dirname, 'token.json')

const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`

async function _updateToken() {
  const { access_token } = await rp(url).then(res => JSON.parse(res))
  const data = {
    access_token,
    createTime: Date.now()
  }
  fs.writeFileSync(filename, JSON.stringify(data))
  return access_token
}

async function _getToken() {
  const exist = fs.existsSync(filename)
  if (!exist) {
    return await _updateToken()
  }
  const data = fs.readFileSync(filename, 'utf8')
  const { access_token, createTime } = JSON.parse(data)
  if (Date.now() - createTime < 6900 * 1000) {
    return access_token
  } else {
    return await _updateToken()
  }
}


module.exports = _getToken
