import api from '../utils/api';

const PostService = {
    getPosts: async (searchTerm = '') => {
        try {
            const response = await api.get(`/posts`, {
                params: {
                    search: searchTerm,
                    category: '',
                    month: ''
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // PostService.js
    getPostById: async (id) => {
        try {
            console.log(`Fetching post with ID: ${id}`);
            const response = await api.get(`/posts/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching post:", error);
            throw error;
        }
    },

    createPost: async (formData) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                transformRequest: (data) => data, // Prevent axios from transforming FormData
            };

            const response = await api.post('/posts', formData, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    updatePost: async (id, formData) => {
        try {
            const response = await api.put(`/posts/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deletePost: async (id) => {
        try {
            await api.delete(`/posts/${id}`);
        } catch (error) {
            throw error;
        }
    }
};

export default PostService;