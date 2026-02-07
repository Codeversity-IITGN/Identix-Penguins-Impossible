import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useWallet } from '../context/WalletContext'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

const ClaimCredential = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { addCredential, did } = useWallet()
  const [status, setStatus] = useState('loading') // loading | success | error
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Credential can be in hash (#) or query param (credential=)
    const hashCredential = window.location.hash?.slice(1) // Remove #
    const queryCredential = searchParams.get('credential')
    const encoded = hashCredential || queryCredential

    if (!encoded) {
      setStatus('error')
      setMessage('No credential data found in URL')
      return
    }

    try {
      const base64 = encoded.includes('%') ? decodeURIComponent(encoded) : encoded
      let jsonStr
      try {
        jsonStr = decodeURIComponent(escape(atob(base64)))
      } catch {
        jsonStr = atob(base64) // Fallback for ASCII-only
      }
      const credential = JSON.parse(jsonStr)
      
      if (!credential || (!credential.id && !credential.credentialId)) {
        setStatus('error')
        setMessage('Invalid credential format')
        return
      }

      addCredential(credential)
      // If user doesn't have a wallet yet, set DID from credential's holder so they can view it
      const holderDid = credential.credentialSubject?.id
      const needsReload = holderDid && !localStorage.getItem('identix_did')
      if (needsReload) {
        localStorage.setItem('identix_did', holderDid)
        localStorage.setItem('identix_demo_mode', 'true')
      }
      setStatus('success')
      setMessage('Credential added to your wallet!')
      // Clear the URL for privacy
      window.history.replaceState({}, document.title, window.location.pathname)
      // Reload to pick up new DID if we just set it
      if (needsReload) {
        setTimeout(() => window.location.href = '/credentials', 1500)
      }
    } catch (err) {
      console.error('Claim credential error:', err)
      setStatus('error')
      setMessage('Failed to parse credential. The link may be invalid or expired.')
    }
  }, [addCredential, searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {status === 'loading' && (
          <div className="text-center">
            <Loader className="h-12 w-12 text-primary-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Adding Credential...</h2>
            <p className="text-gray-600">Please wait while we add the credential to your wallet</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Credential Added!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => (window.location.href = '/credentials')}
              className="w-full px-6 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              View My Credentials
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Could Not Add Credential</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
              onClick={() => navigate('/')}
              className="w-full px-6 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Back to Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ClaimCredential
