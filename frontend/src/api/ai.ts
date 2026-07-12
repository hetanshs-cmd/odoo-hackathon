import { api } from '../services/api';

export const aiService = {
  chat: async (message: string): Promise<string> => {
    const response = await api.post('/ai/chat', { message });
    return response.data.data.reply;
  },
};
