import axios from 'axios'
import {config} from 'process'
import queryString from 'query-string'

const baseURL = process.env.REACT_APP_BASE_URL || `http://localhost:3002`

const axiosClient = axios.create({
  baseURL,
  withCredentials: true,
  paramsSerializer: (params) => queryString.stringify(params),
})

axiosClient.interceptors.request.use(async (config: any) => {
  config.headers = {
    Authorization: '',
    Accept: 'application/json',
    ...config.headers,
  }

  // config.data = {}

  return config
})

axiosClient.interceptors.response.use(
  (res) => {
    if (res.data && res.status >= 200 && res.status < 300) {
      return res.data
    } else {
      return Promise.reject(res.data)
    }
  },
  (error) => {
    const {response} = error
    return Promise.reject(response.data)
  }
)

export default axiosClient
