import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { notificationService } from '@/services/notificationService';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// GET /api/reports - Fetch reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const county = searchParams.get('county');
    const eventType = searchParams.get('eventType');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

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
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (county) {
      // Get county ID first
      const { data: countyData } = await supabase
        .from('counties')
        .select('id')
        .eq('name', county)
        .single();
      
      if (countyData) {
        query = query.eq('county_id', countyData.id);
      }
    }

    if (eventType) {
      query = query.eq('event_type', eventType);
    }

    if (status) {
      query = query.eq('verification_status', status);
    }

    const { data: reports, error } = await query;

    if (error) {
      console.error('Error fetching reports:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reports' },
        { status: 500 }
      );
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('user_reports')
      .select('*', { count: 'exact', head: true })
      .eq('is_public', true);

    if (county) {
      const { data: countyData } = await supabase
        .from('counties')
        .select('id')
        .eq('name', county)
        .single();
      
      if (countyData) {
        countQuery = countQuery.eq('county_id', countyData.id);
      }
    }

    if (eventType) {
      countQuery = countQuery.eq('event_type', eventType);
    }

    if (status) {
      countQuery = countQuery.eq('verification_status', status);
    }

    const { count } = await countQuery;

    return NextResponse.json({
      reports,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (offset + limit) < (count || 0)
      }
    });

  } catch (error) {
    console.error('Error in GET /api/reports:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/reports - Create new report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      eventType,
      county,
      description,
      severity,
      contactNumber,
      reporterName,
      locationDetails,
      latitude,
      longitude,
      isEmergency = false
    } = body;

    // Validation
    if (!eventType || !county || !description || !severity) {
      return NextResponse.json(
        { error: 'Missing required fields: eventType, county, description, severity' },
        { status: 400 }
      );
    }

    // Get county ID
    const { data: countyData, error: countyError } = await supabase
      .from('counties')
      .select('id')
      .eq('name', county)
      .single();

    if (countyError || !countyData) {
      return NextResponse.json(
        { error: 'Invalid county name' },
        { status: 400 }
      );
    }

    // Check for similar recent reports (within last 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data: similarReports } = await supabase
      .from('user_reports')
      .select('id, report_count, similar_reports, confidence_score')
      .eq('county_id', countyData.id)
      .eq('event_type', eventType)
      .gte('created_at', twentyFourHoursAgo)
      .limit(5);

    let reportData: any = {
      county_id: countyData.id,
      event_type: eventType,
      severity,
      description,
      location_details: locationDetails,
      latitude,
      longitude,
      contact_number: contactNumber,
      reporter_name: reporterName,
      is_emergency: isEmergency,
      verification_status: 'pending',
      confidence_score: 0.5,
      report_count: 1
    };

    // If similar reports exist, update the existing one or create with references
    if (similarReports && similarReports.length > 0) {
      const mostRecentSimilar = similarReports[0];
      
      // Update the most recent similar report
      const { data: updatedReport, error: updateError } = await supabase
        .from('user_reports')
        .update({
          report_count: mostRecentSimilar.report_count + 1,
          confidence_score: Math.min(0.95, (mostRecentSimilar.confidence_score || 0.5) + 0.1),
          updated_at: new Date().toISOString()
        })
        .eq('id', mostRecentSimilar.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating similar report:', updateError);
      } else {
        // Also create a new report entry with reference to similar
        reportData.similar_reports = [mostRecentSimilar.id];
        reportData.confidence_score = 0.7; // Higher confidence due to similar reports
      }
    }

    // Create the new report
    const { data: newReport, error: insertError } = await supabase
      .from('user_reports')
      .insert(reportData)
      .select(`
        *,
        counties:county_id (
          id,
          name,
          code
        )
      `)
      .single();

    if (insertError) {
      console.error('Error creating report:', insertError);
      return NextResponse.json(
        { error: 'Failed to create report' },
        { status: 500 }
      );
    }

    // Update analytics
    const today = new Date().toISOString().split('T')[0];
    const { error: analyticsError } = await supabase
      .from('report_analytics')
      .upsert({
        county_id: countyData.id,
        event_type: eventType,
        date: today,
        total_reports: 1,
        verified_reports: 0,
        severity_breakdown: { [severity]: 1 },
        confidence_avg: reportData.confidence_score
      }, {
        onConflict: 'county_id,event_type,date',
        ignoreDuplicates: false
      });

    if (analyticsError) {
      console.error('Error updating analytics:', analyticsError);
    }

    // Create automatic alert if it's an emergency or high severity
    if (isEmergency || severity === 'severe') {
      const alertData = {
        county_id: countyData.id,
        alert_type: eventType,
        severity: severity === 'severe' ? 'critical' : 'high',
        title: `${eventType.replace('_', ' ').toUpperCase()} Alert - ${county}`,
        description: `Community report: ${description.substring(0, 200)}${description.length > 200 ? '...' : ''}`,
        valid_from: new Date().toISOString(),
        valid_until: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        confidence: reportData.confidence_score,
        source: 'Community Report',
        is_active: true
      };

      const { error: alertError } = await supabase
        .from('weather_alerts')
        .insert(alertData);

      if (alertError) {
        console.error('Error creating alert:', alertError);
      }
    }

    // Send SMS confirmation if contact number is provided
    if (contactNumber) {
      try {
        await notificationService.sendReportConfirmation(contactNumber, {
          id: newReport.id,
          eventType: eventType,
          county: county,
          severity: severity
        });
        console.log('SMS confirmation sent successfully');
      } catch (smsError) {
        console.error('Error sending SMS confirmation:', smsError);
        // Don't fail the request if SMS fails
      }
    }

    return NextResponse.json({
      success: true,
      report: newReport,
      message: 'Report submitted successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/reports:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
