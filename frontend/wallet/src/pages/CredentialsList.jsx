import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../context/WalletContext'
import { CreditCard, Wallet, ArrowRight, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

const CredentialsList = () => {
  const navigate = useNavigate()
  const { did, credentials, refreshCredentials, loading, isInitialized } = useWallet()

  useEffect(() => {
    if (!isInitialized) return
    if (did) {
      refreshCredentials()
    } else {
      navigate('/')
    }
  }, [did, isInitialized, navigate])

  // Wait for initialization before deciding (fixes demo mode redirect loop)
  if (!isInitialized || !did) {
    if (!isInitialized) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Wallet className="h-6 w-6 text-primary-600 mr-2" />
              <span className="text-lg font-semibold text-gray-900">IdentiX Wallet</span>
            </div>
            <div className="flex items-center gap-3">
              {localStorage.getItem('identix_demo_mode') === 'true' && (
                <span className="text-xs font-medium bg-green-100 text-green-800 px-2 py-1 rounded">Demo Mode</span>
              )}
              <div className="bg-gray-100 px-3 py-2 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-0.5">Your DID</p>
                <p className="font-mono text-xs text-gray-900 break-all max-w-[180px] sm:max-w-xs" title={did}>
                  {did}
                </p>
                <button
                  onClick={() => navigator.clipboard.writeText(did)}
                  className="text-xs text-primary-600 hover:text-primary-700 mt-1 font-medium"
                >
                  Copy DID
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Credentials</h1>
          <p className="text-gray-600 mb-4">View and manage your verifiable credentials</p>
          {localStorage.getItem('identix_demo_mode') === 'true' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-blue-900 mb-1">Your DID (share with Issuer to receive credentials):</p>
              <p className="font-mono text-sm text-blue-800 break-all">{did}</p>
              <button
                onClick={() => navigator.clipboard.writeText(did)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Copy DID
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">Loading credentials...</p>
          </div>
        ) : credentials.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Credentials Yet</h3>
            <p className="text-gray-600 mb-4">
              Credentials issued to your DID will appear here
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
              <p className="text-sm text-blue-800">
                <strong>Your DID:</strong> <span className="font-mono text-xs break-all">{did}</span>
              </p>
              <p className="text-xs text-blue-700 mt-2">
                Share this DID with issuers to receive credentials
              </p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(did)
                  // Could add toast - for now just copy
                }}
                className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Copy DID
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {credentials.map((credential) => {
              const credentialId = credential.id || credential.credentialId
              const credentialType = Array.isArray(credential.type) 
                ? credential.type[1] || credential.type[0] 
                : credential.type || 'Credential'
              const issuer = credential.issuer?.id || credential.issuer || 'Unknown'
              const issueDate = credential.issuanceDate || credential.createdAt

              return (
                <div
                  key={credentialId}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/credential/${credentialId}`)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-primary-100 p-3 rounded-lg">
                        <CreditCard className="h-6 w-6 text-primary-600" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>

                    <h3 className="font-semibold text-gray-900 mb-2">{credentialType}</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="text-sm">
                        <span className="text-gray-500">Issuer:</span>
                        <p className="text-gray-900 font-medium truncate">{issuer}</p>
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

                    {credential.status === 'revoked' && (
                      <div className="flex items-center text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Revoked
                      </div>
                    )}
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

export default CredentialsList
