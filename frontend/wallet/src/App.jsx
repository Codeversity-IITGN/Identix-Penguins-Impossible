import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Welcome from './pages/Welcome'
import CreateWallet from './pages/CreateWallet'
import RecoverWallet from './pages/RecoverWallet'
import CredentialsList from './pages/CredentialsList'
import CredentialDetail from './pages/CredentialDetail'
import ClaimCredential from './pages/ClaimCredential'
import { WalletProvider } from './context/WalletContext'

function App() {
  return (
    <WalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/create-wallet" element={<CreateWallet />} />
          <Route path="/recover-wallet" element={<RecoverWallet />} />
          <Route path="/credentials" element={<CredentialsList />} />
          <Route path="/credential/:credentialId" element={<CredentialDetail />} />
          <Route path="/claim" element={<ClaimCredential />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </WalletProvider>
  )
}

export default App
