/**
 * API client for IdentiX backend. All requests use relative /api (Vite proxy to backend).
 */
import type { Credential } from "./types";

const API = "/api";
const TIMEOUT = 10000;

async function fetchApi<T>(
  path: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data: T }> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), TIMEOUT);
  const res = await fetch(`${API}${path}`, {
    ...options,
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  clearTimeout(id);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error?.message || res.statusText || "Request failed");
  return json;
}

/** Backend credential shape (from API) */
interface BackendCredential {
  id?: string;
  credentialId?: string;
  type?: string | string[];
  issuer?: string | { id: string };
  credentialSubject?: { id?: string; name?: string; [k: string]: unknown };
  issuanceDate?: string;
  status?: string;
  [k: string]: unknown;
}

/** Map backend credential to frontend Credential type */
export function mapBackendCredentialToFrontend(b: BackendCredential): Credential {
  const id = b.id || (b as { credentialId?: string }).credentialId || "";
  const type = Array.isArray(b.type) ? b.type[1] || b.type[0] : b.type;
  const credType =
    type === "EducationalCredential" || type === "Educational"
      ? "Educational"
      : type === "ProfessionalCredential" || type === "Professional"
        ? "Professional"
        : "Identity";
  const issuerDID = typeof b.issuer === "string" ? b.issuer : b.issuer?.id || "";
  const sub = b.credentialSubject || {};
  const { id: holderId, name: holderName, ...subjectFields } = sub as {
    id?: string;
    name?: string;
    [k: string]: unknown;
  };
  const subject: Record<string, string> = {};
  for (const [k, v] of Object.entries(subjectFields)) {
    if (v != null && typeof v === "string") subject[k] = v;
    else if (v != null) subject[k] = String(v);
  }
  return {
    id,
    type: credType,
    issuerDID,
    issuerName: "Issuer",
    holderDID: holderId || "",
    holderName: (holderName as string) || "",
    issuedAt: b.issuanceDate || new Date().toISOString(),
    status: (b.status === "revoked" ? "revoked" : "active") as "active" | "revoked",
    subject,
    signature: (b as { signature?: string }).signature,
  };
}

export const api = {
  async createDID(): Promise<{ did: string; keys?: unknown[]; services?: unknown[] }> {
    const out = await fetchApi<{ did: string; keys?: unknown[]; services?: unknown[] }>(
      "/did/create",
      { method: "POST", body: JSON.stringify({ method: "ethr" }) }
    );
    return out.data;
  },

  async recoverDID(seedPhrase: string): Promise<{ did: string }> {
    const out = await fetchApi<{ did: string }>("/did/recover", {
      method: "POST",
      body: JSON.stringify({ seedPhrase }),
    });
    return out.data;
  },

  async getCredentialsByHolder(did: string): Promise<Credential[]> {
    const out = await fetchApi<BackendCredential[]>(`/credentials/holder/${encodeURIComponent(did)}`);
    const list = Array.isArray(out.data) ? out.data : [];
    return list.map(mapBackendCredentialToFrontend);
  },

  async getCredentialsByIssuer(did: string): Promise<Credential[]> {
    const out = await fetchApi<BackendCredential[]>(`/credentials/issuer/${encodeURIComponent(did)}`);
    const list = Array.isArray(out.data) ? out.data : [];
    return list.map(mapBackendCredentialToFrontend);
  },

  async getCredential(credentialId: string): Promise<Credential | null> {
    try {
      const out = await fetchApi<BackendCredential>(
        `/credentials/${encodeURIComponent(credentialId)}`
      );
      return mapBackendCredentialToFrontend(out.data);
    } catch {
      return null;
    }
  },

  async issueCredential(payload: {
    issuerDID: string;
    holderDID: string;
    credentialSubject: Record<string, unknown>;
    type: string | string[];
  }): Promise<BackendCredential> {
    const out = await fetchApi<BackendCredential>("/credentials/issue", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return out.data;
  },

  async revokeCredential(credentialId: string, reason?: string): Promise<{ status: string }> {
    const out = await fetchApi<{ status: string }>("/credentials/revoke", {
      method: "POST",
      body: JSON.stringify({ credentialId, reason }),
    });
    return out.data;
  },

  async verifyCredential(credential: unknown): Promise<{
    verified: boolean;
    credential?: unknown;
    reason?: string;
    status?: string;
  }> {
    const out = await fetchApi<{
      verified: boolean;
      credential?: unknown;
      reason?: string;
      status?: string;
    }>("/credentials/verify", {
      method: "POST",
      body: JSON.stringify({ credential }),
    });
    return out.data;
  },
};

/** Check if backend is reachable */
export async function isBackendAvailable(): Promise<boolean> {
  try {
    const res = await fetch("/health", { method: "GET" });
    return res.ok;
  } catch {
    return false;
  }
}
