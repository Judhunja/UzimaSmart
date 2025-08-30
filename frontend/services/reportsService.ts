import { supabase } from '@/lib/supabase';

export interface Report {
  id: string;
  county_id: number;
  event_type: string;
  severity: 'low' | 'moderate' | 'high' | 'severe';
  title?: string;
  description: string;
  location_details?: string;
  latitude?: number;
  longitude?: number;
  contact_number?: string;
  reporter_name?: string;
  verification_status: 'pending' | 'verified' | 'rejected' | 'duplicate';
  verified_by?: string;
  verification_notes?: string;
  confidence_score: number;
  report_count: number;
  similar_reports: string[];
  is_public: boolean;
  is_emergency: boolean;
  created_at: string;
  updated_at: string;
  counties?: {
    id: number;
    name: string;
    code: string;
  };
}

export interface CreateReportData {
  eventType: string;
  county: string;
  description: string;
  severity: 'low' | 'moderate' | 'high' | 'severe';
  contactNumber?: string;
  reporterName?: string;
  locationDetails?: string;
  latitude?: number;
  longitude?: number;
  isEmergency?: boolean;
}

export interface ReportFilters {
  county?: string;
  eventType?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export interface ReportResponse {
  reports: Report[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface ReportInteraction {
  id: string;
  report_id: string;
  user_id?: string;
  interaction_type: 'confirm' | 'dispute' | 'update' | 'similar';
  phone_number?: string;
  details?: string;
  metadata?: any;
  created_at: string;
}

class ReportsService {
  async createReport(data: CreateReportData): Promise<{ success: boolean; report?: Report; error?: string }> {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to create report' };
      }

      return { success: true, report: result.report };
    } catch (error) {
      console.error('Error creating report:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }

  async getReports(filters: ReportFilters = {}): Promise<{ success: boolean; data?: ReportResponse; error?: string }> {
    try {
      const searchParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/reports?${searchParams.toString()}`);
      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to fetch reports' };
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Error fetching reports:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }

  async addInteraction(
    reportId: string, 
    interactionType: 'confirm' | 'dispute' | 'update' | 'similar',
    phoneNumber: string,
    details?: string,
    metadata?: any
  ): Promise<{ success: boolean; interaction?: ReportInteraction; error?: string }> {
    try {
      const response = await fetch(`/api/reports/${reportId}/interact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          interactionType,
          phoneNumber,
          details,
          metadata
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to add interaction' };
      }

      return { success: true, interaction: result.interaction };
    } catch (error) {
      console.error('Error adding interaction:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }

  async getReportInteractions(reportId: string): Promise<{ 
    success: boolean; 
    data?: { 
      interactions: ReportInteraction[];
      grouped: Record<string, ReportInteraction[]>;
      summary: {
        total: number;
        confirms: number;
        disputes: number;
        updates: number;
        similar: number;
      };
    }; 
    error?: string 
  }> {
    try {
      const response = await fetch(`/api/reports/${reportId}/interact`);
      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to fetch interactions' };
      }

      return { success: true, data: result };
    } catch (error) {
      console.error('Error fetching interactions:', error);
      return { success: false, error: 'Network error occurred' };
    }
  }

  // Direct Supabase queries for real-time updates
  async subscribeToReports(callback: (reports: Report[]) => void, filters: ReportFilters = {}) {
    let query = supabase
      .from('user_reports')
      .select(`
        *,
        counties:county_id (
          id,
          name,
          code
        )
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters.county) {
      const { data: countyData } = await supabase
        .from('counties')
        .select('id')
        .eq('name', filters.county)
        .single();
      
      if (countyData) {
        query = query.eq('county_id', countyData.id);
      }
    }

    if (filters.eventType) {
      query = query.eq('event_type', filters.eventType);
    }

    if (filters.status) {
      query = query.eq('verification_status', filters.status);
    }

    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    // Get initial data
    const { data: initialData } = await query;
    if (initialData) {
      callback(initialData as Report[]);
    }

    // Subscribe to changes
    const subscription = supabase
      .channel('user_reports_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'user_reports',
          filter: 'is_public=eq.true'
        }, 
        async () => {
          // Refetch data when changes occur
          const { data: updatedData } = await query;
          if (updatedData) {
            callback(updatedData as Report[]);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }

  // Utility methods
  getEventTypeColor(eventType: string): string {
    const colorMap: Record<string, string> = {
      flooding: 'text-blue-600',
      drought: 'text-red-600',
      crop_damage: 'text-yellow-600',
      extreme_weather: 'text-purple-600',
      pest_outbreak: 'text-orange-600',
      disease_outbreak: 'text-pink-600'
    };
    return colorMap[eventType] || 'text-gray-600';
  }

  getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      verified: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      rejected: 'bg-red-100 text-red-800',
      duplicate: 'bg-gray-100 text-gray-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  }

  getSeverityColor(severity: string): string {
    const colorMap: Record<string, string> = {
      low: 'bg-green-100 text-green-800',
      moderate: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      severe: 'bg-red-100 text-red-800'
    };
    return colorMap[severity] || 'bg-gray-100 text-gray-800';
  }

  formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  }
}

export const reportsService = new ReportsService();
