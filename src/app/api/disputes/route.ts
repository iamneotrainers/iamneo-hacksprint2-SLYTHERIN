import { NextRequest, NextResponse } from 'next/server';

// Mock database - replace with actual database in production
const disputes = [
  {
    id: 'DSP-001',
    title: 'Payment not released after milestone completion',
    type: 'payment_not_released',
    status: 'under_review',
    amount: 1500,
    projectId: '1',
    milestoneId: '1',
    freelancerId: 'user1',
    clientId: 'user2',
    description: 'I completed the milestone "Frontend Development" on January 10th, 2024...',
    attachments: [
      { name: 'milestone_deliverables.zip', size: '2.4 MB', type: 'application/zip', url: '/uploads/file1.zip' },
      { name: 'client_approval_chat.png', size: '156 KB', type: 'image/png', url: '/uploads/file2.png' }
    ],
    aiAnalysis: {
      riskScore: 25,
      confidence: 85,
      likelyFault: 'client',
      faultPercentage: 78,
      suggestedResolution: 'Release full payment to freelancer',
      similarCases: 23,
      patternMatch: 'Standard payment delay case',
      fraudIndicators: 'None detected'
    },
    expertVotes: [
      {
        expertId: 'expert1',
        vote: 'favor_freelancer',
        reasoning: 'Based on the evidence provided, the freelancer has clearly met all milestone requirements.',
        timestamp: '2024-01-16T10:30:00Z'
      }
    ],
    timeline: [
      {
        id: '1',
        type: 'created',
        title: 'Dispute Created',
        description: 'Freelancer raised dispute for payment not released',
        timestamp: '2024-01-15T10:30:00Z',
        actor: 'user1'
      },
      {
        id: '2',
        type: 'ai_analysis',
        title: 'AI Pre-Analysis Complete',
        description: 'AI analyzed case with 85% confidence',
        timestamp: '2024-01-15T10:35:00Z',
        actor: 'system'
      }
    ],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T09:15:00Z',
    priority: 'high'
  }
];

// GET /api/disputes - List all disputes for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filteredDisputes = disputes;

    // Filter by user (freelancer or client)
    if (userId) {
      filteredDisputes = disputes.filter(
        dispute => dispute.freelancerId === userId || dispute.clientId === userId
      );
    }

    // Filter by status
    if (status && status !== 'all') {
      filteredDisputes = filteredDisputes.filter(dispute => dispute.status === status);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDisputes = filteredDisputes.slice(startIndex, endIndex);

    return NextResponse.json({
      disputes: paginatedDisputes,
      pagination: {
        page,
        limit,
        total: filteredDisputes.length,
        totalPages: Math.ceil(filteredDisputes.length / limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch disputes' },
      { status: 500 }
    );
  }
}

// POST /api/disputes - Create a new dispute
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'type', 'projectId', 'milestoneId', 'description', 'freelancerId', 'clientId', 'amount'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate new dispute ID
    const newId = `DSP-${String(disputes.length + 1).padStart(3, '0')}`;

    // Run AI analysis (mock implementation)
    const aiAnalysis = await runAIAnalysis(body);

    // Create new dispute
    const newDispute = {
      id: newId,
      ...body,
      status: 'open',
      aiAnalysis,
      expertVotes: [],
      timeline: [
        {
          id: '1',
          type: 'created',
          title: 'Dispute Created',
          description: `${body.role === 'freelancer' ? 'Freelancer' : 'Client'} raised dispute`,
          timestamp: new Date().toISOString(),
          actor: body.freelancerId || body.clientId
        },
        {
          id: '2',
          type: 'ai_analysis',
          title: 'AI Pre-Analysis Complete',
          description: `AI analyzed case with ${aiAnalysis.confidence}% confidence`,
          timestamp: new Date().toISOString(),
          actor: 'system'
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority: calculatePriority(body.amount, body.type)
    };

    disputes.push(newDispute);

    // Assign expert panel (mock implementation)
    await assignExpertPanel(newDispute.id);

    return NextResponse.json(newDispute, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create dispute' },
      { status: 500 }
    );
  }
}

// Mock AI analysis function
async function runAIAnalysis(disputeData: any) {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Mock AI analysis based on dispute type and description
  const riskScore = Math.floor(Math.random() * 100);
  const confidence = Math.floor(Math.random() * 30) + 70; // 70-100%
  
  let likelyFault = 'client';
  let suggestedResolution = 'Release payment to freelancer';
  
  if (disputeData.type.includes('quality') || disputeData.type.includes('delivery')) {
    likelyFault = 'freelancer';
    suggestedResolution = 'Refund to client or request rework';
  }

  return {
    riskScore,
    confidence,
    likelyFault,
    faultPercentage: Math.floor(Math.random() * 40) + 30,
    suggestedResolution,
    similarCases: Math.floor(Math.random() * 50) + 10,
    patternMatch: 'Standard dispute pattern',
    fraudIndicators: riskScore > 80 ? 'High risk indicators detected' : 'None detected'
  };
}

// Mock expert panel assignment
async function assignExpertPanel(disputeId: string) {
  // In production, this would assign real experts based on:
  // - Expertise area
  // - Availability
  // - Conflict of interest checks
  // - Performance ratings
  
  console.log(`Assigned expert panel to dispute ${disputeId}`);
}

// Calculate dispute priority based on amount and type
function calculatePriority(amount: number, type: string): 'low' | 'medium' | 'high' | 'critical' {
  if (amount > 5000 || type.includes('fraud')) return 'critical';
  if (amount > 2000 || type.includes('payment')) return 'high';
  if (amount > 500) return 'medium';
  return 'low';
}