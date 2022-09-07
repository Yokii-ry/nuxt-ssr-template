// 处理baseUrl
export const processBaseUrl = (url: string) => {
  return url ? `${url}/api` : '/api'
}
