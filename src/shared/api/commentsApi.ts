import { apiClient } from './apiClient';
import type { Comment } from '../types';

export const commentsApi = {
  getPostComments: async (postId: number): Promise<Comment[]> => {
    try {
      const response = await apiClient.get<Comment[]>(`/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching comments for post ${postId}:`, error);
      throw error;
    }
  },
};
