import { useState } from 'react'
import { getWalletClaimUrl } from '../utils/config'

const Debug = () => {
  const [testCredential, setTestCredential] = useState({
    id: 'cred-debug-test-123',
    credentialId: 'cred-debug-test-123',
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiableCredential', 'EducationalCredential'],
    issuer: { id: 'did:ethr:0x9876543210987654321098765432109876543210' },
    credentialSubject: {
      id: 'did:ethr:0x1234567890123456789012345678901234567890',
      name: 'Test User',
      degree: 'Bachelor of Science',
      institution: 'Test University',
      date: '2024-01-15',
      title: 'Test Credential',
    },
    issuanceDate: new Date().toISOString(),
    status: 'active',
    proof: {
      type: 'DemoProof',
      created: new Date().toISOString(),
      proofPurpose: 'assertionMethod',
      verificationMethod: 'did:ethr:0x9876543210987654321098765432109876543210#key-1',
      jws: 'demo-signature-' + Date.now()
    }
  })

  const claimUrl = getWalletClaimUrl(testCredential)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Credential Flow</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Test Credential</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(testCredential, null, 2)}
            </pre>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Wallet Claim URL</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Generated URL:</p>
              <div className="bg-gray-100 p-3 rounded text-xs break-all">
                {claimUrl}
              </div>
            </div>
            
            <div className="space-y-4">
              <a
                href={claimUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-center"
              >
                Test Add to Wallet
              </a>
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(claimUrl)
                  alert('URL copied to clipboard!')
                }}
                className="block w-full px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Copy URL
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Testing Instructions</h3>
          <ol className="list-decimal list-inside text-yellow-700 space-y-2">
            <li>Click "Test Add to Wallet" to open the wallet with this test credential</li>
            <li>Check if the credential appears in the wallet's credentials list</li>
            <li>Verify the credential details match what's shown above</li>
            <li>Try using the credential in the verifier app</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default Debug