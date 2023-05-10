import api from '../axios'

export default {
  login: payload => api.post('/login', payload),
  logout: payload => api.post('/logout', payload),
  getCurrentUser: payload => api.get('/profile', payload),
}
