import { apiClient } from './apiClient';
import type { Post, CreatePostDto, UpdatePostDto } from '../types';

export const postsApi = {
  getPosts: async (): Promise<Post[]> => {
    try {
      const response = await apiClient.get<Post[]>('/posts');
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  },

  getPostById: async (id: number): Promise<Post> => {
    try {
      const response = await apiClient.get<Post>(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching post ${id}:`, error);
      throw error;
    }
  },

  createPost: async (postData: CreatePostDto): Promise<Post> => {
    try {
      const response = await apiClient.post<Post>('/posts', postData);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  updatePost: async (id: number, postData: UpdatePostDto): Promise<Post> => {
    try {
      const response = await apiClient.put<Post>(`/posts/${id}`, postData);
      return response.data;
    } catch (error) {
      console.error(`Error updating post ${id}:`, error);
      throw error;
    }
  },

  patchPost: async (id: number, postData: Partial<Post>): Promise<Post> => {
    try {
      const response = await apiClient.patch<Post>(`/posts/${id}`, postData);
      return response.data;
    } catch (error) {
      console.error(`Error patching post ${id}:`, error);
      throw error;
    }
  },

  deletePost: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/posts/${id}`);
    } catch (error) {
      console.error(`Error deleting post ${id}:`, error);
      throw error;
    }
  },
};
