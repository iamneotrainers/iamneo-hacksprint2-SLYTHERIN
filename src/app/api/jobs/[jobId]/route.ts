import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET /api/jobs/[jobId] - Get job details
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ jobId: string }> }
) {
    try {
        const { jobId } = await params;
        const supabase = await createClient();

        const { data: job, error } = await supabase
            .from('projects')
            .select(`
        *,
        client:users!projects_client_id_fkey(
          id,
          username,
          name,
          rating
        )
      `)
            .eq('id', jobId)
            .single();

        if (error) {
            console.error('Error fetching job:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        // Map to expected frontend format
        const formattedJob = {
            ...job,
            created_by: job.client_id,
            location: job.location_preference
        };

        return NextResponse.json(formattedJob);
    } catch (error: any) {
        console.error('Error in GET /api/jobs/[jobId]:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH /api/jobs/[jobId] - Update job
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ jobId: string }> }
) {
    try {
        const { jobId } = await params;
        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Verify ownership
        const { data: job } = await supabase
            .from('projects')
            .select('client_id')
            .eq('id', jobId)
            .single();

        if (!job || job.client_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Update job
        const { data: updatedJob, error } = await supabase
            .from('projects')
            .update(body)
            .eq('id', jobId)
            .select()
            .single();

        if (error) {
            console.error('Error updating job:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(updatedJob);
    } catch (error: any) {
        console.error('Error in PATCH /api/jobs/[jobId]:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
