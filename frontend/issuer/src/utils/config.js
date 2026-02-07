/**
 * Config for Issuer - Wallet URL for "Add to Wallet" link.
 * Wallet=3001, Issuer=3002 in development.
 */
const getWalletUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_WALLET_URL) {
    return import.meta.env.VITE_WALLET_URL.replace(/\/$/, '')
  }
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location
    if (port === '3002' || port === '3003') return `${protocol}//${hostname}:3001`
    return `${protocol}//${hostname}${port ? ':' + port : ''}`
  }
  return 'http://localhost:3001'
}

export const getWalletClaimUrl = (credential) => {
  try {
    const json = JSON.stringify(credential)
    const encoded = btoa(unescape(encodeURIComponent(json)))
    return `${getWalletUrl()}/claim#${encodeURIComponent(encoded)}`
  } catch (e) {
    return `${getWalletUrl()}/claim`
  }
}
