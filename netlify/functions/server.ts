import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import type { Handler } from '@netlify/functions'
import { createMiddleware } from '@tanstack/start/middleware'
import { getManifestEntry } from '@tanstack/react-router/manifest'

declare const __STATIC_CONTENT_MANIFEST: string

const assetHandler = async (request: Request) => {
  try {
    return await getAssetFromKV(
      { request, waitUntil: (promise: Promise<any>) => Promise.resolve(promise) },
      {
        ASSET_NAMESPACE: '',
        ASSET_MANIFEST: JSON.parse(__STATIC_CONTENT_MANIFEST),
      }
    )
  } catch (error) {
    return null
  }
}

export const handler: Handler = async (event, context) => {
  const request = new Request(`http://${event.headers.host}${event.rawUrl}`, {
    method: event.httpMethod,
    headers: new Headers(event.headers as Record<string, string>),
    body: event.body ? Buffer.from(event.body, event.isBase64Encoded ? 'base64' : 'utf8') : undefined,
  })

  // Try to get static asset
  const assetResponse = await assetHandler(request)
  if (assetResponse) {
    return {
      statusCode: assetResponse.status,
      headers: Object.fromEntries(assetResponse.headers.entries()),
      body: await assetResponse.text(),
    }
  }

  // Handle SSR
  const manifest = getManifestEntry()
  const response = await createMiddleware({
    getRouterManifest: () => manifest,
  })(request)

  const responseHeaders = Object.fromEntries(response.headers.entries())
  const responseBody = await response.text()

  return {
    statusCode: response.status,
    headers: responseHeaders,
    body: responseBody,
  }
}
