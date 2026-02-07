import { generateRandomDID, isDemoMode, DEMO_DID } from './src/utils/demoData.js';

try {
    console.log('Testing imports...');
    console.log('generateRandomDID:', typeof generateRandomDID);
    console.log('isDemoMode:', typeof isDemoMode);

    if (typeof generateRandomDID !== 'function') {
        throw new Error('generateRandomDID is not a function');
    }

    // Test generating a DID
    const did = generateRandomDID();
    console.log('Generated DID:', did);

    console.log('Imports successful!');
} catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
}
