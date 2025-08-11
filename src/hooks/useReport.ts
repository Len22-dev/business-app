import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Report } from '@/lib/drizzle/types';

const reportApi = {
  getById: async (reportId: string): Promise<Report> => {
    const response = await fetch(`/api/reports/${reportId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch report');
    }
    return response.json();
  },

  getByBusiness: async ({ 
    businessId, 
    type,
    search,
    startDate,
    endDate,
    page = 1,
    limit = 10
  }: { 
    businessId: string;
    type?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams({
      businessId,
      page: page.toString(),
      limit: limit.toString(),
      ...(type && { type }),
      ...(search && { search }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });
    
    const response = await fetch(`/api/reports?${queryParams}`);
    if (!response.ok) {
      throw new Error('Failed to fetch reports');
    }
    return response.json();
  },

  create: async (data: { 
    reportData: Partial<Report>; 
    businessId: string;
  }) => {
    const response = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create report');
    }
    return response.json();
  },

  update: async ({ id, data }: { id: string; data: Partial<Report> }) => {
    const response = await fetch(`/api/reports/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update report');
    }
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`/api/reports/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete report');
    }
    return response.json();
  },

  generateReport: async ({ 
    businessId, 
    type,
    startDate,
    endDate,
    filters
  }: { 
    businessId: string;
    type: string;
    startDate?: string;
    endDate?: string;
    filters?: Record<string, unknown>;
  }) => {
    const response = await fetch('/api/reports/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId, type, startDate, endDate, filters }),
    });
    if (!response.ok) {
      throw new Error('Failed to generate report');
    }
    return response.json();
  },

  exportReport: async ({ 
    reportId, 
    format = 'pdf' 
  }: { 
    reportId: string;
    format?: 'pdf' | 'excel' | 'csv';
  }) => {
    const response = await fetch(`/api/reports/${reportId}/export?format=${format}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to export report');
    }
    return response.blob();
  },
};

export const reportKeys = {
  all: ['reports'] as const,
  lists: () => [...reportKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...reportKeys.lists(), { ...filters }] as const,
  details: () => [...reportKeys.all, 'detail'] as const,
  detail: (id: string) => [...reportKeys.details(), id] as const,
  generate: (filters: Record<string, unknown>) => [...reportKeys.all, 'generate', { ...filters }] as const,
};

export const useReport = (reportId: string) => {
  return useQuery({
    queryKey: reportKeys.detail(reportId),
    queryFn: () => reportApi.getById(reportId),
    enabled: !!reportId,
  });
};

export const useBusinessReports = (
  businessId: string,
  filters?: {
    type?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: reportKeys.list({ businessId, ...filters }),
    queryFn: () => reportApi.getByBusiness({ businessId, ...filters }),
    enabled: !!businessId,
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reportApi.create,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: reportKeys.list({ businessId: variables.businessId }) 
      });
    },
  });
};

export const useUpdateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reportApi.update,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: reportKeys.detail(data.id)
      });
    },
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reportApi.delete,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: reportKeys.detail(variables)
      });
    },
  });
};

export const useGenerateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reportApi.generateReport,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: reportKeys.lists() });
      queryClient.invalidateQueries({ 
        queryKey: reportKeys.list({ businessId: variables.businessId }) 
      });
    },
  });
};

export const useExportReport = () => {
  return useMutation({
    mutationFn: reportApi.exportReport,
  });
};
