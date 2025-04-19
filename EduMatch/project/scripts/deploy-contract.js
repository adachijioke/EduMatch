import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  try {
    // Read the contract ABI and bytecode
    const contractPath = path.resolve('./contracts/abis/EduMatch.json');
    const contractArtifact = JSON.parse(fs.readFileSync(contractPath, 'utf8'));

    // Connect to the network
    const provider = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${process.env.VITE_INFURA_ID}`);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    
    console.log('Deploying contract...');
    
    // Deploy the contract
    const ContractFactory = new ethers.ContractFactory(
      contractArtifact,
      contractArtifact.bytecode,
      wallet
    );
    
    const contract = await ContractFactory.deploy();
    await contract.waitForDeployment();
    
    const contractAddress = await contract.getAddress();
    console.log('Contract deployed to:', contractAddress);
    
    // Update the .env file with the contract address
    const envPath = path.resolve('.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    envContent = envContent.replace(
      /VITE_CONTRACT_ADDRESS=.*/,
      `VITE_CONTRACT_ADDRESS=${contractAddress}`
    );
    fs.writeFileSync(envPath, envContent);
    
    console.log('Contract address saved to .env file');
    
    // Verify the contract on Etherscan
    console.log('\nVerify on Etherscan with:');
    console.log(`npx hardhat verify --network sepolia ${contractAddress}`);
    
  } catch (error) {
    console.error('Error deploying contract:', error);
    process.exit(1);
  }
}

main();