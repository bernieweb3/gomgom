/**
 * IPFS Service using native fetch (no axios / no fs) — Workers-compatible.
 */

export interface PinataFileResponse {
  IpfsHash: string
  PinSize: number
  Timestamp: string
  isDuplicate?: boolean
}

export interface PinataJSONResponse {
  IpfsHash: string
  PinSize: number
  Timestamp: string
}

export interface PinataPinListItem {
  id: string
  ipfs_pin_hash: string
  size: number
  user_id: string
  date_pinned: string
  date_unpinned?: string
  metadata: { name?: string; keyvalues?: Record<string, any> }
  regions: Array<{ regionId: string; currentReplicationCount: number; desiredReplicationCount: number }>
}

export interface PinataPinListResponse {
  count: number
  rows: PinataPinListItem[]
}

export interface IpfsConfig {
  apiKey: string
  secretApiKey: string
  gateway?: string
}

export class IpfsService {
  private static readonly BASE_URL = 'https://api.pinata.cloud'

  private static headers(cfg: IpfsConfig): Record<string, string> {
    if (!cfg.apiKey || !cfg.secretApiKey) throw new Error('Pinata API keys not configured')
    return { 'pinata_api_key': cfg.apiKey, 'pinata_secret_api_key': cfg.secretApiKey }
  }

  /**
   * Pin raw bytes (e.g. from request.arrayBuffer()) to IPFS via Pinata.
   */
  static async pinBytesToIPFS(
    cfg: IpfsConfig,
    bytes: ArrayBuffer,
    filename: string,
    options: { name?: string; metadata?: Record<string, any> } = {}
  ): Promise<string> {
    const formData = new FormData()
    formData.append('file', new Blob([bytes]), filename)
    if (options.name || options.metadata) {
      formData.append('pinataMetadata', JSON.stringify({
        name: options.name || filename,
        ...(options.metadata && { keyvalues: options.metadata })
      }))
    }
    const res = await fetch(`${this.BASE_URL}/pinning/pinFileToIPFS`, {
      method: 'POST',
      headers: this.headers(cfg),
      body: formData,
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Pinata upload failed (${res.status}): ${err}`)
    }
    const data = await res.json() as PinataFileResponse
    return data.IpfsHash
  }

  static async pinJSONToIPFS(
    cfg: IpfsConfig,
    jsonData: object,
    options: { name?: string; metadata?: Record<string, any> } = {}
  ): Promise<string> {
    const body = {
      pinataContent: jsonData,
      ...((options.name || options.metadata) && {
        pinataMetadata: {
          name: options.name || 'NFT Metadata',
          ...(options.metadata && { keyvalues: options.metadata })
        }
      })
    }
    const res = await fetch(`${this.BASE_URL}/pinning/pinJSONToIPFS`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...this.headers(cfg) },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Pinata JSON upload failed (${res.status}): ${err}`)
    }
    const data = await res.json() as PinataJSONResponse
    return data.IpfsHash
  }

  static async getPinList(
    cfg: IpfsConfig,
    filters: { status?: 'pinned' | 'unpinned' | 'all'; pageLimit?: number; pageOffset?: number; metadata?: Record<string, any> } = {}
  ): Promise<PinataPinListResponse> {
    const params = new URLSearchParams({
      status: filters.status || 'pinned',
      pageLimit: String(Math.min(filters.pageLimit || 10, 1000)),
      pageOffset: String(filters.pageOffset || 0),
    })
    if (filters.metadata) {
      Object.entries(filters.metadata).forEach(([k, v]) => params.set(`metadata[keyvalues][${k}]`, String(v)))
    }
    const res = await fetch(`${this.BASE_URL}/data/pinList?${params}`, {
      headers: this.headers(cfg),
    })
    if (!res.ok) throw new Error(`Pinata getPinList failed (${res.status})`)
    return res.json() as Promise<PinataPinListResponse>
  }

  static async testConnection(cfg: IpfsConfig): Promise<boolean> {
    try {
      const res = await fetch(`${this.BASE_URL}/data/testAuthentication`, { headers: this.headers(cfg) })
      return res.ok
    } catch {
      return false
    }
  }

  static getIPFSUrl(ipfsHash: string, gateway = 'https://gateway.pinata.cloud'): string {
    const clean = ipfsHash.replace(/^ipfs:\/\//, '')
    return `${gateway}/ipfs/${clean}`
  }

  static createNFTMetadata(params: { name: string; description: string; imageHash: string; attributes?: Array<{ trait_type: string; value: any }>; externalUrl?: string }) {
    return {
      name: params.name,
      description: params.description,
      image: `ipfs://${params.imageHash}`,
      ...(params.externalUrl && { external_url: params.externalUrl }),
      ...(params.attributes && { attributes: params.attributes }),
      created_by: 'GomGom Loyalty System',
      created_at: new Date().toISOString(),
    }
  }
}
