import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react'

const VerificationResult = () => {
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const hasLoadedRef = useRef(false)

  useEffect(() => {
    const storedResult = sessionStorage.getItem('verificationResult')
    if (storedResult) {
      hasLoadedRef.current = true
      setResult(JSON.parse(storedResult))
      sessionStorage.removeItem('verificationResult')
    } else if (!hasLoadedRef.current) {
      navigate('/verify')
    }
  }, [navigate])

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Loading verification result...</p>
        </div>
      </div>
    )
  }

  const isVerified = result.verified === true
  const isRevoked = result.reason?.toLowerCase().includes('revoked') || 
                    result.status === 'revoked'
  const credentialType = result.credential?.type 
    ? (Array.isArray(result.credential.type) 
        ? result.credential.type[1] || result.credential.type[0] 
        : result.credential.type)
    : 'Credential'
  const issuer = result.credential?.issuer?.id || result.credential?.issuer || result.issuer || 'Unknown'
  const issueDate = result.credential?.issuanceDate || result.issuanceDate

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/verify')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Verification Result</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Status Header */}
          <div className={`px-6 py-12 text-center ${
            isVerified && !isRevoked 
              ? 'bg-green-50' 
              : isRevoked 
                ? 'bg-yellow-50' 
                : 'bg-red-50'
          }`}>
            {isVerified && !isRevoked ? (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-green-900 mb-2">✅ VERIFIED</h2>
                <p className="text-green-700">This credential is authentic and valid</p>
              </>
            ) : isRevoked ? (
              <>
                <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-yellow-900 mb-2">⚠️ REVOKED</h2>
                <p className="text-yellow-700">This credential has been revoked by the issuer</p>
              </>
            ) : (
              <>
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-red-900 mb-2">❌ INVALID</h2>
                <p className="text-red-700">
                  {result.reason || 'This credential could not be verified'}
                </p>
              </>
            )}
          </div>

          {/* Credential Details */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Credential Details</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Credential Type</label>
                <p className="mt-1 text-gray-900 font-semibold">{credentialType}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Issuer</label>
                <p className="mt-1 text-gray-900 font-mono text-sm break-all">{issuer}</p>
              </div>
              
              {issueDate && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Issue Date</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(issueDate).toLocaleString()}
                  </p>
                </div>
              )}

              {result.credential?.credentialSubject && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Subject</label>
                  <div className="mt-1 space-y-1">
                    {Object.entries(result.credential.credentialSubject).map(([key, value]) => {
                      if (key === 'id') return null
                      return (
                        <p key={key} className="text-gray-900">
                          <span className="capitalize font-medium">{key}:</span> {String(value)}
                        </p>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Verification Details */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Verification Checks</h4>
              <ul className="space-y-2 text-sm">
                <li className={`flex items-center ${
                  isVerified ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isVerified ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Signature Verification
                </li>
                <li className={`flex items-center ${
                  !isRevoked ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {!isRevoked ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 mr-2" />
                  )}
                  Revocation Status
                </li>
                <li className={`flex items-center ${
                  issuer !== 'Unknown' ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {issuer !== 'Unknown' ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Issuer Trust
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="mt-6 flex space-x-4">
              <button
                onClick={() => navigate('/verify')}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Verify Another
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default VerificationResult
