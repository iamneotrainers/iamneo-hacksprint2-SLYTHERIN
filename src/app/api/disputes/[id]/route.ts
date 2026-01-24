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
        expertName: 'Sarah Mitchell',
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

// GET /api/disputes/[id] - Get specific dispute details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dispute = disputes.find(d => d.id === params.id);
    
    if (!dispute) {
      return NextResponse.json(
        { error: 'Dispute not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(dispute);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch dispute' },
      { status: 500 }
    );
  }
}

// PUT /api/disputes/[id] - Update dispute (admin override, add evidence, etc.)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const disputeIndex = disputes.findIndex(d => d.id === params.id);
    
    if (disputeIndex === -1) {
      return NextResponse.json(
        { error: 'Dispute not found' },
        { status: 404 }
      );
    }

    const dispute = disputes[disputeIndex];
    
    // Handle different update types
    if (body.action === 'add_evidence') {
      dispute.attachments.push(...body.attachments);
      dispute.timeline.push({
        id: String(dispute.timeline.length + 1),
        type: 'evidence_added',
        title: 'Additional Evidence Submitted',
        description: `${body.attachments.length} files added`,
        timestamp: new Date().toISOString(),
        actor: body.userId
      });
    } else if (body.action === 'admin_override') {
      dispute.status = body.newStatus;
      dispute.timeline.push({
        id: String(dispute.timeline.length + 1),
        type: 'admin_override',
        title: 'Admin Override',
        description: body.reason,
        timestamp: new Date().toISOString(),
        actor: body.adminId
      });
    } else if (body.action === 'expert_vote') {
      // Add expert vote
      dispute.expertVotes.push({
        expertId: body.expertId,
        expertName: body.expertName,
        vote: body.vote,
        reasoning: body.reasoning,
        timestamp: new Date().toISOString()
      });

      dispute.timeline.push({
        id: String(dispute.timeline.length + 1),
        type: 'expert_vote',
        title: 'Expert Vote Submitted',
        description: `${body.expertName} voted: ${body.vote}`,
        timestamp: new Date().toISOString(),
        actor: body.expertId
      });

      // Check if all experts have voted (assuming 3 experts)
      if (dispute.expertVotes.length >= 3) {
        const decision = calculateFinalDecision(dispute.expertVotes);
        dispute.status = 'resolved';
        dispute.finalDecision = decision;
        
        dispute.timeline.push({
          id: String(dispute.timeline.length + 1),
          type: 'decision',
          title: 'Final Decision Reached',
          description: `Decision: ${decision.outcome}`,
          timestamp: new Date().toISOString(),
          actor: 'system'
        });

        // Execute the decision (release payment, refund, etc.)
        await executeDecision(dispute, decision);
      }
    }

    dispute.updatedAt = new Date().toISOString();
    disputes[disputeIndex] = dispute;

    return NextResponse.json(dispute);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update dispute' },
      { status: 500 }
    );
  }
}

// DELETE /api/disputes/[id] - Cancel/withdraw dispute (only if not yet reviewed)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const disputeIndex = disputes.findIndex(d => d.id === params.id);
    
    if (disputeIndex === -1) {
      return NextResponse.json(
        { error: 'Dispute not found' },
        { status: 404 }
      );
    }

    const dispute = disputes[disputeIndex];
    
    // Only allow cancellation if dispute is still open
    if (dispute.status !== 'open') {
      return NextResponse.json(
        { error: 'Cannot cancel dispute that is already under review' },
        { status: 400 }
      );
    }

    disputes.splice(disputeIndex, 1);

    return NextResponse.json({ message: 'Dispute cancelled successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to cancel dispute' },
      { status: 500 }
    );
  }
}

// Calculate final decision based on expert votes
function calculateFinalDecision(expertVotes: any[]) {
  const voteCounts: { [key: string]: number } = {};
  
  expertVotes.forEach(vote => {
    voteCounts[vote.vote] = (voteCounts[vote.vote] || 0) + 1;
  });

  // Find majority vote
  const majorityVote = Object.entries(voteCounts)
    .sort(([,a], [,b]) => b - a)[0];

  let outcome = '';
  let action = '';

  switch (majorityVote[0]) {
    case 'favor_freelancer':
      outcome = 'Payment released to freelancer';
      action = 'release_payment';
      break;
    case 'favor_client':
      outcome = 'Full refund to client';
      action = 'refund_client';
      break;
    case 'partial_freelancer':
      outcome = 'Partial payment to freelancer';
      action = 'partial_payment';
      break;
    case 'partial_client':
      outcome = 'Partial refund to client';
      action = 'partial_refund';
      break;
    case 'rework_required':
      outcome = 'Rework required';
      action = 'request_rework';
      break;
    default:
      outcome = 'Additional evidence required';
      action = 'request_evidence';
  }

  return {
    outcome,
    action,
    voteBreakdown: voteCounts,
    consensusLevel: (majorityVote[1] / expertVotes.length) * 100
  };
}

// Execute the final decision
async function executeDecision(dispute: any, decision: any) {
  // In production, this would:
  // - Release escrow payments
  // - Process refunds
  // - Update project milestones
  // - Send notifications to both parties
  // - Update user reputation scores
  
  console.log(`Executing decision for dispute ${dispute.id}:`, decision);
  
  // Mock implementation
  switch (decision.action) {
    case 'release_payment':
      // Release payment from escrow to freelancer
      break;
    case 'refund_client':
      // Refund payment to client
      break;
    case 'partial_payment':
      // Release partial payment
      break;
    case 'partial_refund':
      // Process partial refund
      break;
    case 'request_rework':
      // Extend project deadline, notify freelancer
      break;
    case 'request_evidence':
      // Request additional evidence from both parties
      break;
  }
}