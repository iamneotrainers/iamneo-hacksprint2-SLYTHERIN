'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  walletAddress: string;
  defaultRole: 'CLIENT' | 'FREELANCER';
  email?: string;
  name?: string;
}

interface Project {
  id: string;
  clientWallet: string;
  freelancerWallet: string;
  paymentType: 'BLOCKCHAIN_ESCROW' | 'EXTERNAL_PAYMENT';
  contractAddress?: string;
}

interface WalletContextType {
  user: User | null;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchRole: (projectId: string, role: 'CLIENT' | 'FREELANCER') => boolean;
  canActAsRole: (projectId: string, role: 'CLIENT' | 'FREELANCER') => boolean;
  projects: Project[];
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [projects] = useState<Project[]>([
    {
      id: '1',
      clientWallet: '0x742d35Cc6634C0532925a3b8D404fddF4f780EAD',
      freelancerWallet: '0x8ba1f109551bD432803012645Hac136c',
      paymentType: 'BLOCKCHAIN_ESCROW',
      contractAddress: '0x1234567890123456789012345678901234567890'
    }
  ]);

  const connectWallet = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        // MetaMask connection
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        const walletAddress = accounts[0];
        
        // Generate nonce and verify signature (simplified)
        const nonce = Math.random().toString(36);
        const message = `Sign this message to authenticate: ${nonce}`;
        
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, walletAddress]
        });

        // Mock user creation/retrieval
        const userData: User = {
          id: `user_${walletAddress.slice(-8)}`,
          walletAddress,
          defaultRole: 'FREELANCER',
          name: 'John Doe'
        };

        setUser(userData);
        setIsConnected(true);
        
        localStorage.setItem('walletAddress', walletAddress);
      } else {
        // Fallback for demo - simulate wallet connection
        const mockWallet = '0x742d35Cc6634C0532925a3b8D404fddF4f780EAD';
        const userData: User = {
          id: 'user_demo',
          walletAddress: mockWallet,
          defaultRole: 'CLIENT',
          name: 'Demo User'
        };
        
        setUser(userData);
        setIsConnected(true);
        localStorage.setItem('walletAddress', mockWallet);
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  const disconnectWallet = () => {
    setUser(null);
    setIsConnected(false);
    localStorage.removeItem('walletAddress');
  };

  const canActAsRole = (projectId: string, role: 'CLIENT' | 'FREELANCER'): boolean => {
    if (!user) return false;
    
    const project = projects.find(p => p.id === projectId);
    if (!project) return true; // New project, can select role
    
    // Role locking logic - critical rule
    if (role === 'CLIENT') {
      return project.clientWallet === user.walletAddress;
    } else {
      return project.freelancerWallet === user.walletAddress;
    }
  };

  const switchRole = (projectId: string, role: 'CLIENT' | 'FREELANCER'): boolean => {
    return canActAsRole(projectId, role);
  };

  // Auto-connect on page load
  useEffect(() => {
    const savedWallet = localStorage.getItem('walletAddress');
    if (savedWallet) {
      const userData: User = {
        id: 'user_demo',
        walletAddress: savedWallet,
        defaultRole: 'CLIENT',
        name: 'Demo User'
      };
      setUser(userData);
      setIsConnected(true);
    }
  }, []);

  return (
    <WalletContext.Provider value={{
      user,
      isConnected,
      connectWallet,
      disconnectWallet,
      switchRole,
      canActAsRole,
      projects
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}