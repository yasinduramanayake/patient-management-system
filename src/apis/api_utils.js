import api from '@/apis/axios'

export default baseUrl => ({
  index: filters => api.get(`${baseUrl}?${filters}`),
  indexWithoutPagination: () => api.get(`${baseUrl}?noPagination=true`),
  create: payload => api.post(baseUrl, payload),
  view: id => api.get(`${baseUrl}/${id}`),
  update: (id, payload) => api.put(`${baseUrl}/${id}`, payload),
  delete: id => api.delete(`${baseUrl}/${id}`),
})
