// 封装请求模块
import axios from 'axios'
// 基于axios的create()方法创建一个实例
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/' // 基础路径

})

export default request
