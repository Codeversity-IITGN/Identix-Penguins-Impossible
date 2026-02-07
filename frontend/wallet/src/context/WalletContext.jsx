import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { DEMO_DID, DEMO_SEED_PHRASE, DEMO_CREDENTIALS, isDemoMode, enableDemoMode } from '../utils/demoData'

const WalletContext = createContext()

const API_BASE_URL = '/api'

// Initialize from localStorage synchronously so CredentialsList has did on first render
const getInitialDid = () => {
  const savedDID = localStorage.getItem('identix_did')
  if (savedDID) return savedDID
  if (localStorage.getItem('identix_demo_mode') === 'true') return DEMO_DID
  return null
}

const getInitialSeedPhrase = () => {
  const saved = localStorage.getItem('identix_seed_phrase')
  if (saved) return saved
  if (localStorage.getItem('identix_demo_mode') === 'true') return DEMO_SEED_PHRASE
  return null
}

export const WalletProvider = ({ children }) => {
  const [did, setDid] = useState(getInitialDid)
  const [seedPhrase, setSeedPhrase] = useState(getInitialSeedPhrase)
  const [credentials, setCredentials] = useState([])
  const [loading, setLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const savedDID = localStorage.getItem('identix_did')
    const savedSeedPhrase = localStorage.getItem('identix_seed_phrase')
    
    if (savedDID) {
      setDid(savedDID)
      if (savedSeedPhrase) setSeedPhrase(savedSeedPhrase)
      loadCredentials(savedDID)
    } else if (isDemoMode()) {
      setDid(DEMO_DID)
      setSeedPhrase(DEMO_SEED_PHRASE)
      loadCredentials(DEMO_DID)
    }
    setIsInitialized(true)
  }, [])

  const loadCredentials = async (didAddress) => {
    let baseCredentials = []
    
    if (isDemoMode()) {
      baseCredentials = DEMO_CREDENTIALS
    } else {
      try {
        const response = await axios.get(`${API_BASE_URL}/credentials/holder/${didAddress}`, {
          timeout: 3000,
        })
        baseCredentials = response.data.data || []
      } catch (error) {
        console.warn('Backend unavailable, using demo data:', error.message)
        baseCredentials = DEMO_CREDENTIALS
      }
    }
    
    // Merge claimed credentials from localStorage (from Issuer's "Add to Wallet")
    try {
      const claimed = JSON.parse(localStorage.getItem('identix_claimed_credentials') || '[]')
      const existingIds = new Set(baseCredentials.map(c => c.id || c.credentialId))
      const newClaimed = claimed.filter(c => {
        const id = c.id || c.credentialId
        return id && !existingIds.has(id)
      })
      if (newClaimed.length > 0) {
        baseCredentials = [...baseCredentials, ...newClaimed]
      }
    } catch (e) { /* ignore */ }
    
    setCredentials(baseCredentials)
  }

  const createDID = async () => {
    setLoading(true)
    try {
      const response = await axios.post(`${API_BASE_URL}/did/create`, {
        method: 'ethr',
      }, { timeout: 3000 })
      const newDID = response.data.data.did
      setDid(newDID)
      localStorage.setItem('identix_did', newDID)
      
      // Generate a mock seed phrase (in production, this would come from backend)
      const mockSeedPhrase = generateMockSeedPhrase()
      setSeedPhrase(mockSeedPhrase)
      localStorage.setItem('identix_seed_phrase', mockSeedPhrase)
      
      await loadCredentials(newDID)
      return { did: newDID, seedPhrase: mockSeedPhrase }
    } catch (error) {
      console.warn('Backend unavailable, using demo mode:', error.message)
      // Use demo data when backend is unavailable
      enableDemoMode()
      setDid(DEMO_DID)
      setSeedPhrase(DEMO_SEED_PHRASE)
      await loadCredentials(DEMO_DID)
      return { did: DEMO_DID, seedPhrase: DEMO_SEED_PHRASE }
    } finally {
      setLoading(false)
    }
  }

  const recoverDID = async (seedPhrase) => {
    setLoading(true)
    try {
      // Note: Backend endpoint /api/did/recover needs to be implemented
      const response = await axios.post(`${API_BASE_URL}/did/recover`, {
        seedPhrase,
      })
      const recoveredDID = response.data.data.did
      setDid(recoveredDID)
      setSeedPhrase(seedPhrase)
      localStorage.setItem('identix_did', recoveredDID)
      localStorage.setItem('identix_seed_phrase', seedPhrase)
      await loadCredentials(recoveredDID)
      return recoveredDID
    } catch (error) {
      console.error('Failed to recover DID:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getCredential = (credentialId) => {
    return credentials.find(c => c.id === credentialId || c.credentialId === credentialId)
  }

  const refreshCredentials = () => {
    if (did) {
      loadCredentials(did)
    }
  }

  // Add a claimed credential (from Issuer's "Add to Wallet" flow)
  const addCredential = (credential) => {
    if (!credential) return
    const credId = credential.id || credential.credentialId
    if (credentials.some(c => (c.id || c.credentialId) === credId)) return
    setCredentials(prev => [...prev, { ...credential, status: credential.status || 'active' }])
    // Persist to localStorage for demo mode (survives refresh)
    try {
      const stored = JSON.parse(localStorage.getItem('identix_claimed_credentials') || '[]')
      if (!stored.some(c => (c.id || c.credentialId) === credId)) {
        stored.push({ ...credential, status: credential.status || 'active' })
        localStorage.setItem('identix_claimed_credentials', JSON.stringify(stored))
      }
    } catch (e) { /* ignore */ }
  }

  return (
    <WalletContext.Provider
      value={{
        did,
        seedPhrase,
        credentials,
        loading,
        isInitialized,
        createDID,
        recoverDID,
        getCredential,
        refreshCredentials,
        addCredential,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  return context
}

// Mock seed phrase generator (for demo purposes)
function generateMockSeedPhrase() {
  const words = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
    'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
    'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actual', 'adapt',
    'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance', 'advice'
  ]
  const seedPhrase = []
  for (let i = 0; i < 12; i++) {
    seedPhrase.push(words[Math.floor(Math.random() * words.length)])
  }
  return seedPhrase.join(' ')
}
