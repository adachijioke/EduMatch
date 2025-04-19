import fs from 'fs';
import path from 'path';
import solc from 'solc';

const contractsDir = path.resolve('./contracts');
const buildDir = path.resolve('./contracts/abis');

// Make sure the build directory exists
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Helper function to create the solc compiler input
function createInput(sources) {
  return {
    language: 'Solidity',
    sources,
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode.object']
        }
      }
    }
  };
}

// Compile the contracts
function compile() {
  const sources = {};
  
  // Read the contract file
  const contractPath = path.resolve(contractsDir, 'EduMatch.sol');
  sources['EduMatch.sol'] = {
    content: fs.readFileSync(contractPath, 'utf8')
  };
  
  // Compile the contract
  const input = createInput(sources);
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  
  // Check for errors
  if (output.errors) {
    console.error('Compilation errors:');
    output.errors.forEach(error => {
      console.error(error.formattedMessage);
    });
    return false;
  }
  
  // Write the ABI and bytecode to file
  for (const contractFileName in output.contracts) {
    const contract = output.contracts[contractFileName]['EduMatch'];
    
    fs.writeFileSync(
      path.resolve(buildDir, 'EduMatch.json'),
      JSON.stringify(contract.abi, null, 2)
    );
    
    console.log(`Compiled EduMatch contract and saved ABI to ${path.relative('.', path.resolve(buildDir, 'EduMatch.json'))}`);
  }
  
  return true;
}

if (compile()) {
  console.log('Compilation successful!');
} else {
  console.error('Compilation failed!');
  process.exit(1);
}