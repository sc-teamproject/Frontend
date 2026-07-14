import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

export const getPosts = async (page = 1, size = 10, keyword = '') => {
  const { data } = await api.get('/community/posts', { params: { page, size, keyword } })
  return data
}

export const getPost = async (id) => {
  const { data } = await api.get(`/community/posts/${id}`)
  return data
}

export const incrementViewCount = async (id) => {
  const { data } = await api.get(`/community/posts/${id}`)
  return data
}

export const createPost = async (payload) => {
  const { data } = await api.post('/community/posts', payload)
  return data
}

export const updatePost = async (id, payload) => {
  const { data } = await api.put(`/community/posts/${id}`, payload)
  return data
}

export const deletePost = async (id, password) => {
  const { data } = await api.delete(`/community/posts/${id}`, { params: { password } })
  return data
}

export const verifyPostPassword = async (id, password) => {
  const { data } = await api.post(`/community/posts/${id}/verify`, { password })
  return data
}
