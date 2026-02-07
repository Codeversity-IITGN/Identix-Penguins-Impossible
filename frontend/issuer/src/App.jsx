import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import IssueCredential from './pages/IssueCredential'
import IssuedCredentials from './pages/IssuedCredentials'
import RevokeCredential from './pages/RevokeCredential'
import Debug from './pages/Debug'
import { WalletProvider } from './context/WalletContext'

function App() {
  return (
    <WalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/issue" element={<IssueCredential />} />
          <Route path="/credentials" element={<IssuedCredentials />} />
          <Route path="/revoke" element={<RevokeCredential />} />
          <Route path="/debug" element={<Debug />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </WalletProvider>
  )
}

export default App
