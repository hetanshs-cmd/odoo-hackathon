import { api } from './api';

export interface Settings {
  id: string;
  organizationName: string;
  timezone: string;
  currency: string;
}

export const settingsService = {
  getSettings: async (): Promise<Settings> => {
    const response = await api.get('/settings');
    return response.data.data;
  },

  updateSettings: async (settings: Partial<Settings>): Promise<Settings> => {
    const response = await api.put('/settings', settings);
    return response.data.data;
  },
};
