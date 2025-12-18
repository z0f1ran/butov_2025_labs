import axios from 'axios';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Создаем экземпляр axios с базовым URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// GET-запрос для получения всех постов
export const getPosts = async () => {
  try {
    const response = await api.get('/posts');
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

// GET-запрос для получения одного поста по ID
export const getPostById = async (id) => {
  try {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    throw error;
  }
};

// POST-запрос для создания нового поста
export const createPost = async (postData) => {
  try {
    const response = await api.post('/posts', postData);
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// PUT-запрос для полного обновления поста
export const updatePost = async (id, postData) => {
  try {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  } catch (error) {
    console.error(`Error updating post ${id}:`, error);
    throw error;
  }
};

// PATCH-запрос для частичного обновления поста
export const patchPost = async (id, postData) => {
  try {
    const response = await api.patch(`/posts/${id}`, postData);
    return response.data;
  } catch (error) {
    console.error(`Error patching post ${id}:`, error);
    throw error;
  }
};

// DELETE-запрос для удаления поста
export const deletePost = async (id) => {
  try {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error);
    throw error;
  }
};

export default api;
