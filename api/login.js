import request from '@/utils/request'

// 应用标识（需与后端配置一致）
const clientId = 'e5cd7e4891bf95d1d19206ce24a7b32e'
const grantType = 'password'

// 登录方法
export function login(data) {
  const params = {
    username: data.username,
    password: data.password,
    code: data.code,
    uuid: data.uuid,
    clientId: clientId,
    grantType: grantType,
    tenantId: data.tenantId
  }
  return request({
    url: '/auth/login',
    headers: {
      isToken: false,
      isEncrypt: true,
      repeatSubmit: false
    },
    method: 'post',
    data: params
  })
}

// 注册方法
export function register(data) {
  const params = {
    username: data.username,
    password: data.password,
    code: data.code,
    uuid: data.uuid,
    clientId: clientId,
    grantType: grantType
  }
  return request({
    url: '/auth/register',
    headers: {
      isToken: false,
      isEncrypt: true,
      repeatSubmit: false
    },
    method: 'post',
    data: params
  })
}

// 获取用户详细信息
export function getInfo() {
  return request({
    url: '/system/user/getInfo',
    method: 'get'
  })
}

// 退出方法
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/auth/code',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

// 第三方登录回调
export function callback(data) {
  const params = {
    ...data,
    clientId: clientId,
    grantType: 'social'
  }
  return request({
    url: '/auth/social/callback',
    method: 'post',
    data: params
  })
}

// 获取租户列表
export function getTenantList(isToken) {
  return request({
    url: '/auth/tenant/list',
    headers: {
      isToken: isToken
    },
    method: 'get'
  })
}
