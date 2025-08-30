import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// POST /api/reports/[id]/interact - Add interaction to a report
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: reportId } = params;
    const body = await request.json();
    
    const {
      interactionType,
      phoneNumber,
      details,
      metadata = {}
    } = body;

    // Validation
    if (!interactionType || !phoneNumber) {
      return NextResponse.json(
        { error: 'Missing required fields: interactionType, phoneNumber' },
        { status: 400 }
      );
    }

    if (!['confirm', 'dispute', 'update', 'similar'].includes(interactionType)) {
      return NextResponse.json(
        { error: 'Invalid interaction type' },
        { status: 400 }
      );
    }

    // Check if report exists
    const { data: report, error: reportError } = await supabase
      .from('user_reports')
      .select('id, verification_status, confidence_score, report_count')
      .eq('id', reportId)
      .single();

    if (reportError || !report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      );
    }

    // Create the interaction
    const { data: interaction, error: interactionError } = await supabase
      .from('report_interactions')
      .insert({
        report_id: reportId,
        interaction_type: interactionType,
        phone_number: phoneNumber,
        details,
        metadata
      })
      .select()
      .single();

    if (interactionError) {
      console.error('Error creating interaction:', interactionError);
      return NextResponse.json(
        { error: 'Failed to create interaction' },
        { status: 500 }
      );
    }

    // Update report based on interaction type
    let updateData: any = {};

    if (interactionType === 'confirm') {
      // Get total confirmations
      const { count: confirmCount } = await supabase
        .from('report_interactions')
        .select('*', { count: 'exact', head: true })
        .eq('report_id', reportId)
        .eq('interaction_type', 'confirm');

      // Increase confidence with more confirmations
      const newConfidence = Math.min(0.95, (report.confidence_score || 0.5) + 0.1);
      updateData.confidence_score = newConfidence;

      // Auto-verify if enough confirmations
      if ((confirmCount || 0) >= 3 && report.verification_status === 'pending') {
        updateData.verification_status = 'verified';
        updateData.verified_by = 'Community Consensus';
      }
    } else if (interactionType === 'dispute') {
      // Get total disputes
      const { count: disputeCount } = await supabase
        .from('report_interactions')
        .select('*', { count: 'exact', head: true })
        .eq('report_id', reportId)
        .eq('interaction_type', 'dispute');

      // Decrease confidence with disputes
      const newConfidence = Math.max(0.1, (report.confidence_score || 0.5) - 0.15);
      updateData.confidence_score = newConfidence;

      // Auto-reject if too many disputes
      if ((disputeCount || 0) >= 2 && report.verification_status === 'pending') {
        updateData.verification_status = 'rejected';
        updateData.verified_by = 'Community Dispute';
      }
    } else if (interactionType === 'similar') {
      // Increase report count for similar events
      updateData.report_count = (report.report_count || 1) + 1;
      updateData.confidence_score = Math.min(0.9, (report.confidence_score || 0.5) + 0.05);
    }

    // Apply updates if any
    if (Object.keys(updateData).length > 0) {
      updateData.updated_at = new Date().toISOString();
      
      const { error: updateError } = await supabase
        .from('user_reports')
        .update(updateData)
        .eq('id', reportId);

      if (updateError) {
        console.error('Error updating report:', updateError);
      }
    }

    return NextResponse.json({
      success: true,
      interaction,
      message: 'Interaction recorded successfully'
    });

  } catch (error) {
    console.error('Error in POST /api/reports/[id]/interact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/reports/[id]/interact - Get interactions for a report
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: reportId } = params;

    const { data: interactions, error } = await supabase
      .from('report_interactions')
      .select('*')
      .eq('report_id', reportId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching interactions:', error);
      return NextResponse.json(
        { error: 'Failed to fetch interactions' },
        { status: 500 }
      );
    }

    // Group by interaction type
    const grouped = interactions.reduce((acc: any, interaction: any) => {
      const type = interaction.interaction_type;
      if (!acc[type]) acc[type] = [];
      acc[type].push(interaction);
      return acc;
    }, {});

    return NextResponse.json({
      interactions,
      grouped,
      summary: {
        total: interactions.length,
        confirms: grouped.confirm?.length || 0,
        disputes: grouped.dispute?.length || 0,
        updates: grouped.update?.length || 0,
        similar: grouped.similar?.length || 0
      }
    });

  } catch (error) {
    console.error('Error in GET /api/reports/[id]/interact:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
