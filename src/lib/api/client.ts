// 10. API CLIENT (lib/api/client.ts)
import { type Business } from '@/lib/types';
import {type NewBusiness } from '../drizzle/types';
import {type DashboardStats } from '@/types';

class ApiClient {
  private baseURL = '/api';

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Business methods
  async getBusinesses(): Promise<Business[]> {
    return this.request<Business[]>('/businesses');
  }

  async getBusiness(businessId: string): Promise<Business> {
    console.log("Fetching business with ID:", businessId);
    return this.request<Business>(`/businesses/${businessId}`);
  }

  async createBusiness(data: NewBusiness): Promise<Business> {
    return this.request<Business>('/businesses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateBusiness(businessId: string, data: Partial<NewBusiness>): Promise<Business> {
    return this.request<Business>(`/businesses/${businessId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBusiness(businessId: string): Promise<void> {
    return this.request<void>(`/businesses/${businessId}`, {
      method: 'DELETE',
    });
  }

  async getDashboardStats(businessId: string): Promise<DashboardStats> {
    return this.request<DashboardStats>(`/businesses/${businessId}/stats`);
  }
}

export const apiClient = new ApiClient();