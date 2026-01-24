"use client";

import { useState } from "react";

export interface Dispute {
  id: string;
  projectId: string;
  projectName: string;
  role: 'CLIENT' | 'FREELANCER';
  amount: number;
  status: 'OPEN' | 'AWAITING_EVIDENCE' | 'UNDER_REVIEW' | 'RESOLVED' | 'ESCALATED';
  reason: string;
  createdAt: string;
  paymentMethod: 'BLOCKCHAIN_ESCROW' | 'PAYPAL_PLATFORM_MANAGED';
  outcome?: 'FREELANCER' | 'CLIENT' | 'PARTIAL';
}

export function useDisputeActions() {
  const [loading, setLoading] = useState(false);

  const raiseDispute = async (projectId: string, reason: string): Promise<boolean> => {
    setLoading(true);
    try {
      console.log(`Raising dispute for project ${projectId}: ${reason}`);
      // API call would go here
      return true;
    } finally {
      setLoading(false);
    }
  };

  const submitEvidence = async (disputeId: string, evidence: string): Promise<boolean> => {
    setLoading(true);
    try {
      console.log(`Submitting evidence for dispute ${disputeId}`);
      return true;
    } finally {
      setLoading(false);
    }
  };

  const resolveDispute = async (disputeId: string, outcome: 'FREELANCER' | 'CLIENT' | 'PARTIAL'): Promise<boolean> => {
    setLoading(true);
    try {
      console.log(`Resolving dispute ${disputeId} in favor of ${outcome}`);
      return true;
    } finally {
      setLoading(false);
    }
  };

  const releasePayPalPayout = async (disputeId: string, freelancerEmail: string): Promise<boolean> => {
    setLoading(true);
    try {
      console.log(`Releasing PayPal payout for dispute ${disputeId} to ${freelancerEmail}`);
      console.log('POST /paypal/payout - Platform → Freelancer transfer');
      return true;
    } finally {
      setLoading(false);
    }
  };

  const refundPayPalClient = async (disputeId: string, clientEmail: string): Promise<boolean> => {
    setLoading(true);
    try {
      console.log(`Refunding PayPal payment for dispute ${disputeId} to ${clientEmail}`);
      console.log('POST /paypal/refund - Platform → Client refund');
      return true;
    } finally {
      setLoading(false);
    }
  };

  const getDisputes = (): Dispute[] => {
    return [
      {
        id: 'DSP-001',
        projectId: 'PRJ-123',
        projectName: 'E-commerce Website Development',
        role: 'FREELANCER',
        amount: 1500,
        status: 'UNDER_REVIEW',
        reason: 'Client not responding to milestone submission',
        createdAt: '2024-01-15',
        paymentMethod: 'PAYPAL_PLATFORM_MANAGED',
        outcome: 'FREELANCER'
      },
      {
        id: 'DSP-002',
        projectId: 'PRJ-124',
        projectName: 'Mobile App Design',
        role: 'CLIENT',
        amount: 800,
        status: 'AWAITING_EVIDENCE',
        reason: 'Work quality does not match requirements',
        createdAt: '2024-01-12',
        paymentMethod: 'BLOCKCHAIN_ESCROW'
      }
    ];
  };

  const getDisputeById = (id: string): Dispute | null => {
    return getDisputes().find(d => d.id === id) || null;
  };

  return {
    loading,
    raiseDispute,
    submitEvidence,
    resolveDispute,
    releasePayPalPayout,
    refundPayPalClient,
    getDisputes,
    getDisputeById
  };
}