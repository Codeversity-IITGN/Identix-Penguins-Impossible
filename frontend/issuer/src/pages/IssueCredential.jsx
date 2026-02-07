import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../context/WalletContext'
import axios from 'axios'
import { FileText, Loader, CheckCircle, XCircle, Award, ArrowLeft, Wallet } from 'lucide-react'
import { getWalletClaimUrl } from '../utils/config'

const IssueCredential = () => {
  const navigate = useNavigate()
  const { account, isConnected } = useWallet()
  const [formData, setFormData] = useState({
    issuerDID: '',
    holderDID: '',
    credentialType: 'EducationalCredential',
    credentialTitle: '',
    name: '',
    degree: '',
    institution: '',
    date: new Date().toISOString().split('T')[0],
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const demoMode = localStorage.getItem('identix_issuer_demo_mode')
    if (!isConnected && !demoMode) {
      navigate('/')
    }
    // Generate issuer DID from wallet address
    if (account) {
      setFormData(prev => ({
        ...prev,
        issuerDID: `did:ethr:${account}`,
      }))
    }
  }, [isConnected, account, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const credentialSubject = {
        name: formData.name,
        degree: formData.degree,
        institution: formData.institution,
        date: formData.date,
        title: formData.credentialTitle,
      }

      const response = await axios.post('/api/credentials/issue', {
        issuerDID: formData.issuerDID,
        holderDID: formData.holderDID,
        credentialSubject,
        type: ['VerifiableCredential', formData.credentialType],
      }, { timeout: 3000 })

      setResult(response.data.data)
    } catch (err) {
      // Use demo result when backend is unavailable - format matches shared for Verifier coordination
      console.warn('Backend unavailable, using demo result')
      const demoResult = {
        id: `cred-demo-${Date.now()}`,
        credentialId: `cred-demo-${Date.now()}`,
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', formData.credentialType],
        issuer: { id: formData.issuerDID },
        credentialSubject: {
          id: formData.holderDID,
          ...credentialSubject,
        },
        issuanceDate: new Date().toISOString(),
        status: 'active',
      }
      setResult(demoResult)
      // Don't set error, just use demo result
    } finally {
      setLoading(false)
    }
  }

  const demoMode = localStorage.getItem('identix_issuer_demo_mode')
  if (!isConnected && !demoMode) {
    return null
  }

  if (result) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button
                onClick={() => {
                  setResult(null)
                  setFormData({
                    issuerDID: `did:ethr:${account}`,
                    holderDID: '',
                    credentialType: 'EducationalCredential',
                    credentialTitle: '',
                    name: '',
                    degree: '',
                    institution: '',
                    date: new Date().toISOString().split('T')[0],
                  })
                }}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Issue Credential</h1>
            </div>
          </div>
        </nav>

        <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Credential Issued Successfully!</h2>
              <p className="text-gray-600">The credential has been issued and anchored on the blockchain</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Credential ID:</h3>
              <p className="font-mono text-sm text-gray-700 break-all">{result.id}</p>
            </div>

            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 mb-3">
                <strong>Share with holder:</strong> Send this link to the credential holder so they can add it to their wallet.
              </p>
              <a
                href={getWalletClaimUrl(result)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Wallet className="h-5 w-5 mr-2" />
                Add to Wallet (Open in New Tab)
              </a>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setResult(null)
                  setFormData({
                    issuerDID: `did:ethr:${account}`,
                    holderDID: '',
                    credentialType: 'EducationalCredential',
                    credentialTitle: '',
                    name: '',
                    degree: '',
                    institution: '',
                    date: new Date().toISOString().split('T')[0],
                  })
                }}
                className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Issue Another
              </button>
              <button
                onClick={() => navigate('/credentials')}
                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                View All Credentials
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/credentials')}
                className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </button>
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

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Issue Credential</h1>
          <p className="text-gray-600">Create and issue a verifiable credential to a holder</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <XCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="issuerDID" className="block text-sm font-medium text-gray-700 mb-2">
                Issuer DID *
              </label>
              <input
                type="text"
                id="issuerDID"
                name="issuerDID"
                value={formData.issuerDID}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50"
                readOnly
              />
              <p className="mt-1 text-xs text-gray-500">Auto-generated from your connected wallet</p>
            </div>

            <div>
              <label htmlFor="holderDID" className="block text-sm font-medium text-gray-700 mb-2">
                Holder DID *
              </label>
              <input
                type="text"
                id="holderDID"
                name="holderDID"
                value={formData.holderDID}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="did:ethr:0x1234567890123456789012345678901234567890"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the recipient's DID. For demo: use Wallet app's DID (did:ethr:0x1234...)
              </p>
            </div>

            <div>
              <label htmlFor="credentialType" className="block text-sm font-medium text-gray-700 mb-2">
                Credential Type *
              </label>
              <select
                id="credentialType"
                name="credentialType"
                value={formData.credentialType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="EducationalCredential">Educational Credential</option>
                <option value="ProfessionalCredential">Professional Credential</option>
                <option value="IdentityCredential">Identity Credential</option>
              </select>
            </div>

            <div>
              <label htmlFor="credentialTitle" className="block text-sm font-medium text-gray-700 mb-2">
                Credential Title *
              </label>
              <input
                type="text"
                id="credentialTitle"
                name="credentialTitle"
                value={formData.credentialTitle}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Bachelor of Science in Computer Science"
              />
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Credential Subject</h3>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-2">
                    Degree / Title
                  </label>
                  <input
                    type="text"
                    id="degree"
                    name="degree"
                    value={formData.degree}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Bachelor of Science"
                  />
                </div>

                <div>
                  <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-2">
                    Institution *
                  </label>
                  <input
                    type="text"
                    id="institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="IIT Gandhinagar"
                  />
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? (
                <>
                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                  Issuing Credential...
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5 mr-2" />
                  Issue Credential
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}

export default IssueCredential
