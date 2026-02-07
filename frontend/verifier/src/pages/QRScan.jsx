import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Html5Qrcode } from 'html5-qrcode'
import axios from 'axios'
import { Scan, Upload, ArrowLeft, Loader, AlertCircle } from 'lucide-react'

const QRScan = () => {
  const navigate = useNavigate()
  const [method, setMethod] = useState('scan') // 'scan' or 'paste'
  const [scanning, setScanning] = useState(false)
  const [credentialJson, setCredentialJson] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const qrCodeRegionId = 'qr-reader'
  const html5QrCodeRef = useRef(null)

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {})
      }
    }
  }, [])

  const handleScan = async (decodedText) => {
    try {
      await stopScanning()
      const credential = JSON.parse(decodedText)
      await verifyCredential(credential)
    } catch (err) {
      setError('Invalid QR code data. Please try again.')
    }
  }

  const handlePasteVerification = async () => {
    if (!credentialJson.trim()) {
      setError('Please paste credential JSON')
      return
    }

    try {
      const credential = JSON.parse(credentialJson)
      await verifyCredential(credential)
    } catch (err) {
      setError('Invalid JSON format. Please check your credential data.')
    }
  }

  const verifyCredential = async (credential) => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post('/api/credentials/verify', {
        credential,
      }, { timeout: 3000 })

      sessionStorage.setItem('verificationResult', JSON.stringify(response.data.data))
      navigate('/result')
    } catch (err) {
      // Backend unavailable or verification failed - use local verification for demo credentials
      const { isDemoCredential, createDemoVerificationResult, DEMO_VERIFICATION_RESULT } = await import('../utils/demoData')
      
      let result
      try {
        if (isDemoCredential(credential)) {
          const isRevoked = credential.status === 'revoked'
          result = createDemoVerificationResult(credential, isRevoked)
        } else {
          result = {
            ...DEMO_VERIFICATION_RESULT,
            verified: false,
            credential,
            reason: 'Backend unavailable. This credential could not be verified. Try with backend running.',
          }
        }
      } catch (demoErr) {
        result = {
          verified: false,
          credential,
          reason: 'Verification failed. Please check the credential format.',
          errors: [],
        }
      }
      sessionStorage.setItem('verificationResult', JSON.stringify(result))
      navigate('/result')
    } finally {
      setLoading(false)
    }
  }

  const startScanning = async () => {
    try {
      setScanning(true)
      setError(null)
      
      const html5QrCode = new Html5Qrcode(qrCodeRegionId)
      html5QrCodeRef.current = html5QrCode
      
      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          handleScan(decodedText)
        },
        (errorMessage) => {
          // Ignore scanning errors
        }
      )
    } catch (err) {
      setError('Camera access denied or not available. Please use paste method.')
      setScanning(false)
    }
  }

  const stopScanning = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop()
        await html5QrCodeRef.current.clear()
        html5QrCodeRef.current = null
      } catch (err) {
        // Ignore stop errors
      }
    }
    setScanning(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Verify Credential</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Method Selection */}
            <div className="flex space-x-4 mb-6">
            <button
              onClick={() => {
                setMethod('scan')
                setError(null)
                if (scanning) {
                  stopScanning()
                }
              }}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${
                method === 'scan'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Scan className="h-5 w-5 mr-2" />
              Scan QR Code
            </button>
            <button
              onClick={async () => {
                if (scanning) {
                  await stopScanning()
                }
                setMethod('paste')
                setError(null)
              }}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-colors ${
                method === 'paste'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Upload className="h-5 w-5 mr-2" />
              Paste JSON
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* QR Scanner */}
          {method === 'scan' && (
            <div className="mb-6">
              {scanning ? (
                <div>
                  <div id={qrCodeRegionId} className="mb-4"></div>
                  <button
                    onClick={stopScanning}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Stop Scanning
                  </button>
                </div>
              ) : (
                <button
                  onClick={startScanning}
                  disabled={loading}
                  className="w-full flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  <Scan className="h-5 w-5 mr-2" />
                  Start Scanning
                </button>
              )}
            </div>
          )}

          {/* Paste JSON */}
          {method === 'paste' && (
            <div>
              <label htmlFor="credentialJson" className="block text-sm font-medium text-gray-700 mb-2">
                Credential JSON
              </label>
              <textarea
                id="credentialJson"
                value={credentialJson}
                onChange={(e) => setCredentialJson(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                placeholder="Paste credential JSON here (or use sample below)..."
              />
              <button
                type="button"
                onClick={async () => {
                  const { DEMO_CREDENTIAL_JSON } = await import('../utils/demoData')
                  setCredentialJson(DEMO_CREDENTIAL_JSON)
                  setError(null)
                }}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Load sample credential (from Wallet demo)
              </button>
              <button
                onClick={handlePasteVerification}
                disabled={loading || !credentialJson.trim()}
                className="mt-4 w-full flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? (
                  <>
                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Credential'
                )}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default QRScan
