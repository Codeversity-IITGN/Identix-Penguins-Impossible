import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/context/WalletContext";
import { IssuerProvider } from "@/context/IssuerContext";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Wallet
import WalletWelcome from "./pages/wallet/WalletWelcome";
import CreateWallet from "./pages/wallet/CreateWallet";
import RecoverWallet from "./pages/wallet/RecoverWallet";
import CredentialsList from "./pages/wallet/CredentialsList";
import CredentialDetail from "./pages/wallet/CredentialDetail";
import ClaimCredential from "./pages/wallet/ClaimCredential";

// Issuer
import IssuerLogin from "./pages/issuer/IssuerLogin";
import IssueCredential from "./pages/issuer/IssueCredential";
import IssuedCredentials from "./pages/issuer/IssuedCredentials";
import RevokeCredential from "./pages/issuer/RevokeCredential";

// Verifier
import VerifierLanding from "./pages/verifier/VerifierLanding";
import VerifyCredential from "./pages/verifier/VerifyCredential";
import VerificationResult from "./pages/verifier/VerificationResult";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <WalletProvider>
        <IssuerProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />

              {/* Wallet */}
              <Route path="/wallet" element={<WalletWelcome />} />
              <Route path="/wallet/create" element={<CreateWallet />} />
              <Route path="/wallet/recover" element={<RecoverWallet />} />
              <Route path="/wallet/credentials" element={<CredentialsList />} />
              <Route path="/wallet/credential/:credentialId" element={<CredentialDetail />} />
              <Route path="/wallet/claim" element={<ClaimCredential />} />

              {/* Issuer */}
              <Route path="/issuer" element={<IssuerLogin />} />
              <Route path="/issuer/issue" element={<IssueCredential />} />
              <Route path="/issuer/credentials" element={<IssuedCredentials />} />
              <Route path="/issuer/revoke" element={<RevokeCredential />} />

              {/* Verifier */}
              <Route path="/verifier" element={<VerifierLanding />} />
              <Route path="/verifier/verify" element={<VerifyCredential />} />
              <Route path="/verifier/result" element={<VerificationResult />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </IssuerProvider>
      </WalletProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
