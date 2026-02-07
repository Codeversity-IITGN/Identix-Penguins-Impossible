const { generateRandomDID, isDemoMode, DEMO_DID } = require('./src/utils/demoData.js');

try {
    console.log('Testing imports...');
    console.log('generateRandomDID:', typeof generateRandomDID);
    console.log('isDemoMode:', typeof isDemoMode);
    console.log('DEMO_DID:', DEMO_DID);

    if (typeof generateRandomDID !== 'function') {
        throw new Error('generateRandomDID is not a function');
    }

    const did = generateRandomDID();
    console.log('Generated DID:', did);

    console.log('Imports successful!');
} catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
}
