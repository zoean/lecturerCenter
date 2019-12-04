/**
 * 配置开发环境和上线环境地址
 */
var config = {
  prod: '',
  dev: '',
  method: '/'
}
export const API_ROOT = process.env.NODE_ENV === 'development'?''.concat(config.dev):''.concat(config.prod)
