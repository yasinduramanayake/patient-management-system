import axios from 'axios'
import config from '@/constants/config'
import Cookies from 'js-cookie'

const axiosIns = axios.create({
  baseURL: config.apiUrl,
})

axiosIns.interceptors.request.use(
  reqConfig => {
    const cacheUserToken = Cookies.get('current_user_token')
    if (cacheUserToken) {
      // eslint-disable-next-line no-param-reassign
      reqConfig.headers.Authorization = `Bearer ${cacheUserToken}`
    }
    return reqConfig
  },
  error => Promise.reject(error),
)

export default axiosIns
