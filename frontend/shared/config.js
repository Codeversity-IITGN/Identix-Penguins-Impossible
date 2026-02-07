/**
 * Shared config for cross-app coordination.
 * In development: Wallet=3001, Issuer=3002, Verifier=3003
 * Override with VITE_WALLET_URL for production deployment.
 */
const getWalletUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WALLET_URL) {
    return import.meta.env.VITE_WALLET_URL.replace(/\/$/, '')
  }
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location
    if (port === '3002' || port === '3003') {
      return `${protocol}//${hostname}:3001`
    }
    if (port === '3001') {
      return `${protocol}//${hostname}:3001`
    }
    return `${protocol}//${hostname}${port ? ':' + port : ''}`
  }
  return 'http://localhost:3001'
}

export const WALLET_URL = getWalletUrl()
export const WALLET_CLAIM_PATH = '/claim'

export const getWalletClaimUrl = (credential) => {
  try {
    const json = JSON.stringify(credential)
    const encoded = btoa(unescape(encodeURIComponent(json)))
    return `${WALLET_URL}${WALLET_CLAIM_PATH}#${encodeURIComponent(encoded)}`
  } catch (e) {
    console.error('Failed to encode credential for claim URL:', e)
    return `${WALLET_URL}${WALLET_CLAIM_PATH}`
  }
}
