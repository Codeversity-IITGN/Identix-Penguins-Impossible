import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../context/WalletContext'
import { Wallet, Copy, Check, Loader, AlertCircle } from 'lucide-react'

const CreateWallet = () => {
  const navigate = useNavigate()
  const { createDID, loading } = useWallet()
  const [step, setStep] = useState(1) // 1: Creating, 2: Show seed phrase, 3: Confirm, 4: Success
  const [did, setDid] = useState(null)
  const [seedPhrase, setSeedPhrase] = useState(null)
  const [seedPhraseCopied, setSeedPhraseCopied] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState(null)

  const handleCreateWallet = async () => {
    setError(null)
    setStep(1)
    try {
      // Force a slight delay to show loading state for better UX
      await new Promise(r => setTimeout(r, 800))

      const result = await createDID()

      if (!result || !result.did) {
        throw new Error('Failed to generate DID')
      }

      setDid(result.did)
      setSeedPhrase(result.seedPhrase)
      setStep(2)
    } catch (err) {
      console.error('Wallet creation error:', err)
      setError(err.response?.data?.error?.message || err.message || 'Failed to create wallet. Please try again.')
      setStep(1)
    }
  }

  const handleCopySeedPhrase = () => {
    navigator.clipboard.writeText(seedPhrase)
    setSeedPhraseCopied(true)
    setTimeout(() => setSeedPhraseCopied(false), 2000)
  }

  const handleContinue = () => {
    if (confirmed) {
      navigate('/credentials')
    }
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="bg-primary-100 p-4 rounded-full inline-block mb-4">
              <Wallet className="h-12 w-12 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Wallet</h2>
            <p className="text-gray-600">
              We'll generate a secure decentralized identity for you
            </p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            onClick={handleCreateWallet}
            disabled={loading}
            className="w-full flex items-center justify-center px-6 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? (
              <>
                <Loader className="h-5 w-5 mr-2 animate-spin" />
                Creating Wallet...
              </>
            ) : (
              <>
                <Wallet className="h-5 w-5 mr-2" />
                Create Wallet
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Save Your Seed Phrase</h2>
            <p className="text-gray-600">
              Write down these 12 words in order. You'll need them to recover your wallet.
            </p>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800 font-medium mb-2">⚠️ Important:</p>
            <p className="text-sm text-yellow-700">
              Store this seed phrase securely. If you lose it, you won't be able to recover your wallet.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {seedPhrase.split(' ').map((word, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-xs text-gray-500 mr-2 w-6">{index + 1}.</span>
                  <span className="font-mono text-sm font-semibold text-gray-900">{word}</span>
                </div>
              ))}
            </div>
            <button
              onClick={handleCopySeedPhrase}
              className="w-full flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              {seedPhraseCopied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Seed Phrase
                </>
              )}
            </button>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-blue-900 mb-2">Your Decentralized Identifier (DID):</p>
            <p className="font-mono text-xs text-blue-800 break-all bg-white p-2 rounded">
              {did}
            </p>
          </div>

          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="confirm"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="confirm" className="ml-2 text-sm text-gray-700">
              I have saved my seed phrase securely
            </label>
          </div>

          <button
            onClick={handleContinue}
            disabled={!confirmed}
            className="w-full px-6 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Continue to Wallet
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default CreateWallet
