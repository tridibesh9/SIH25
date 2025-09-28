const { ethers } = require('hardhat');

async function testContract() {
    try {
        console.log('🔗 Testing contract deployment...');
        
        // Get the deployed contract address
        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        
        // Get a signer
        const [signer] = await ethers.getSigners();
        console.log('🔗 Using signer:', await signer.getAddress());
        
        // Get the contract factory
        const CarbonMarketplace = await ethers.getContractFactory("CarbonMarketplace");
        
        // Attach to the deployed contract
        const contract = CarbonMarketplace.attach(contractAddress);
        
        // Test basic contract functions
        console.log('🔗 Testing nextProjectId...');
        const nextId = await contract.nextProjectId();
        console.log('✅ nextProjectId:', nextId.toString());
        
        console.log('🔗 Testing getListedProjects for signer address...');
        const signerAddress = await signer.getAddress();
        const listedProjects = await contract.getListedProjects(signerAddress);
        console.log('✅ getListedProjects result:', listedProjects);
        console.log('✅ Number of listed projects:', listedProjects.length);
        
        console.log('🔗 Testing getOwnedProjects...');
        const ownedProjects = await contract.getOwnedProjects(signerAddress);
        console.log('✅ getOwnedProjects result:', ownedProjects);
        console.log('✅ Number of owned projects:', ownedProjects.length);
        
        console.log('🔗 Testing marketplace...');
        const marketplace = await contract.getMarketplace();
        console.log('✅ getMarketplace result:', marketplace);
        console.log('✅ Number of marketplace projects:', marketplace.length);
        
        console.log('🎉 All tests passed! Contract is working correctly.');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        if (error.code) {
            console.error('❌ Error code:', error.code);
        }
        if (error.data) {
            console.error('❌ Error data:', error.data);
        }
    }
}

testContract()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });