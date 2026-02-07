// Veramo agent configuration - Simplified for demo
const { createAgent } = require('@veramo/core');
const { CredentialPlugin } = require('@veramo/credential-w3c');

let agent;

const initVeramo = async () => {
    try {
        // Simplified agent for demo purposes
        agent = createAgent({
            plugins: [
                new CredentialPlugin(),
            ],
        });

        console.log('✅ Veramo agent initialized (demo mode)');
        return agent;
    } catch (error) {
        console.error('❌ Veramo initialization error:', error);
        // Don't throw error, just log it and continue
        console.log('⚠️ Continuing without Veramo agent');
        agent = null;
    }
};

const getAgent = () => agent;

module.exports = {
    initVeramo,
    getAgent,
};
