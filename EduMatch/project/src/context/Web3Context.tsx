import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import EduMatchABI from '../../contracts/abis/EduMatch.json';

interface Web3ContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  contract: ethers.Contract | null;
  connectWallet: () => Promise<void>;
  isConnected: boolean;
  chainId: string | null;
  balance: string | null;
}

const Web3Context = createContext<Web3ContextType>({
  account: null,
  provider: null,
  signer: null,
  contract: null,
  connectWallet: async () => {},
  isConnected: false,
  chainId: null,
  balance: null,
});

export const useWeb3 = () => useContext(Web3Context);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [chainId, setChainId] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  // Contract address would come from deployment
  const contractAddress = '0x0000000000000000000000000000000000000000';

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        console.log('Please install MetaMask');
        return;
      }

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);

      const accounts = await browserProvider.listAccounts();
      
      if (accounts.length > 0) {
        const account = accounts[0].address;
        setAccount(account);
        setIsConnected(true);
        
        // Get network and balance
        const network = await browserProvider.getNetwork();
        setChainId(network.chainId.toString());
        
        const accountSigner = await browserProvider.getSigner();
        setSigner(accountSigner);
        
        const accountBalance = await browserProvider.getBalance(account);
        setBalance(ethers.formatEther(accountBalance));
        
        // Initialize contract
        const eduMatchContract = new ethers.Contract(
          contractAddress, 
          EduMatchABI, 
          accountSigner
        );
        setContract(eduMatchContract);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask');
        return;
      }

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      await browserProvider.send('eth_requestAccounts', []);
      
      checkIfWalletIsConnected();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    
    // Setup listeners
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', checkIfWalletIsConnected);
      window.ethereum.on('chainChanged', checkIfWalletIsConnected);
    }
    
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', checkIfWalletIsConnected);
        window.ethereum.removeListener('chainChanged', checkIfWalletIsConnected);
      }
    };
  }, []);

  const value = {
    account,
    provider,
    signer,
    contract,
    connectWallet,
    isConnected,
    chainId,
    balance,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};