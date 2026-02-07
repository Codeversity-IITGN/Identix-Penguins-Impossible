import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../context/WalletContext'
import axios from 'axios'
import { Award, ArrowRight, AlertCircle, Plus, ArrowLeft } from 'lucide-react'

const IssuedCredentials = () => {
  const navigate = useNavigate()
  const { account, isConnected } = useWallet()
  const [credentials, setCredentials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const demoMode = localStorage.getItem('identix_issuer_demo_mode')
    if (!isConnected && !demoMode) {
      navigate('/')
      return
    }
    loadCredentials()
  }, [isConnected, account, navigate])

  const loadCredentials = async () => {
    if (!account) return

    setLoading(true)
    setError(null)
    
    // Check if demo mode
    const demoMode = localStorage.getItem('identix_issuer_demo_mode')
    if (demoMode === 'true') {
      const { DEMO_ISSUED_CREDENTIALS } = await import('../utils/demoData')
      setCredentials(DEMO_ISSUED_CREDENTIALS)
      setLoading(false)
      return
    }

    try {
      // Note: Backend needs an endpoint to get credentials by issuer
      // For now, we'll show a message that this needs backend implementation
      // In production, this would be: GET /api/credentials/issuer/:issuerDID
      const issuerDID = `did:ethr:${account}`
      
      // Try to fetch from backend
      try {
        const response = await axios.get(`/api/credentials/issuer/${issuerDID}`, { timeout: 3000 })
        setCredentials(response.data.data || [])
      } catch (err) {
        // Use demo data when backend is unavailable
        console.warn('Backend unavailable, using demo credentials')
        const { DEMO_ISSUED_CREDENTIALS } = await import('../utils/demoData')
        setCredentials(DEMO_ISSUED_CREDENTIALS)
      }
    } catch (err) {
      setError('Failed to load credentials')
      console.error('Error loading credentials:', err)
      // Use demo data as fallback
      const { DEMO_ISSUED_CREDENTIALS } = await import('../utils/demoData')
      setCredentials(DEMO_ISSUED_CREDENTIALS)
    } finally {
      setLoading(false)
    }
  }

  const demoMode = localStorage.getItem('identix_issuer_demo_mode')
  if (!isConnected && !demoMode) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Award className="h-6 w-6 text-purple-600 mr-2" />
              <span className="text-lg font-semibold text-gray-900">IdentiX Issuer</span>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                {account?.slice(0, 10)}...{account?.slice(-8)}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Issued Credentials</h1>
            <p className="text-gray-600">View and manage credentials you've issued</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/debug')}
              className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Debug Flow
            </button>
            <button
              onClick={() => navigate('/issue')}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <Plus className="h-5 w-5 mr-2" />
              Issue New
            </button>
            <button
              onClick={() => navigate('/revoke')}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <AlertCircle className="h-5 w-5 mr-2" />
              Revoke
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading credentials...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : credentials.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Credentials Issued Yet</h3>
            <p className="text-gray-600 mb-6">
              Start issuing credentials to holders
            </p>
            <button
              onClick={() => navigate('/issue')}
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <Plus className="h-5 w-5 mr-2" />
              Issue Your First Credential
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {credentials.map((credential) => {
              const credentialId = credential.id || credential.credentialId
              const credentialType = Array.isArray(credential.type)
                ? credential.type[1] || credential.type[0]
                : credential.type || 'Credential'
              const holder = credential.holder || credential.credentialSubject?.id || 'Unknown'
              const issueDate = credential.issuanceDate || credential.createdAt
              const status = credential.status || 'active'

              return (
                <div
                  key={credentialId}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <Award className="h-6 w-6 text-purple-600" />
                      </div>
                      {status === 'revoked' ? (
                        <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                          Revoked
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                          Active
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2">{credentialType}</h3>

                    <div className="space-y-2 mb-4">
                      <div className="text-sm">
                        <span className="text-gray-500">Holder:</span>
                        <p className="text-gray-900 font-mono text-xs break-all">{holder}</p>
                      </div>
                      {issueDate && (
                        <div className="text-sm">
                          <span className="text-gray-500">Issued:</span>
                          <p className="text-gray-900">
                            {new Date(issueDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs font-mono text-gray-500 break-all">
                        ID: {credentialId?.slice(0, 20)}...
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default IssuedCredentials
