import { TransactionBaseService } from "@medusajs/medusa";
import fetch from 'cross-fetch';

class PrintfulRequestService extends TransactionBaseService {
  private options: any
  private token: any
  private headers: any
  constructor(container: any) {
    super(arguments[0]);
    this.options = {
      baseUrl: 'https://api.printful.com'
    }
  }

  async init(token: string, storeId, options: any = {}) {
    if (!token)
      throw new Error('No API key provided')

    const { headers } = options

    this.token = token

    this.options = {
      baseUrl: 'https://api.printful.com',
      ...options,
    }

    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'X-PF-Store-Id': storeId,
      ...headers
    }
  }

  async request({ method, endpoint, data, params = {} }: any) {
    const { baseUrl } = this.options
    const headers = this.headers

    const queryString = Object.keys(params).length
      ? `?${Object.keys(params)
        .map(
          k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`,
        )
        .join('&')}`
      : ''

    const url = `${baseUrl}/${endpoint}${queryString}`

    const response = await fetch(url, {
      headers,
      ...(method && { method }),
      ...(data && { body: JSON.stringify(data) }),
    })

    const json = await response.json()

    if (!response.ok)
      throw json

    return json
  }

  get(endpoint?: string, params?: any) {
    return this.request({ endpoint, params })
  }

  post(endpoint?: string, data?: any) {
    return this.request({ method: 'POST', endpoint, data })
  }

  put(endpoint?: string, data?: any) {
    return this.request({ method: 'PUT', endpoint, data })
  }

  delete(endpoint?: string, data?: any) {
    return this.request({ method: 'DELETE', endpoint, data })
  }

}

export default PrintfulRequestService;
