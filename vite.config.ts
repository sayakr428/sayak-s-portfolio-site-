import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { existsSync, readFileSync } from 'node:fs'

/**
 * Heavy media lives on Cloudinary. The source keeps plain paths ("/live/webgrow.mp4"); at build time every
 * quoted path listed in cdn-manifest.json is swapped for its Cloudinary delivery URL (auto format and quality).
 * Upload or update the media with `node scripts/cdn-upload.mjs` (see the README). Delete the manifest to serve
 * everything from public/ again.
 */
function cdn(): Plugin {
  const file = path.resolve(import.meta.dirname, 'cdn-manifest.json')
  const assets: Record<string, { url: string }> = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')).assets : {}
  const keys = Object.keys(assets).sort((a, b) => b.length - a.length)
  const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  // a path counts only when it is a whole quoted string: "…", '…' or `…`
  const re = keys.length ? new RegExp(`(["'\`])(${keys.map(esc).join('|')})\\1`, 'g') : null
  const swap = (code: string) => (re ? code.replace(re, (_m, q: string, p: string) => q + assets[p].url + q) : code)
  return {
    name: 'cloudinary-assets',
    enforce: 'pre',
    transform(code, id) { return re && /\/src\/.*\.(t|j)sx?$/.test(id.replaceAll('\\', '/')) ? { code: swap(code), map: null } : null },
    transformIndexHtml: (html) => swap(html),
  }
}

export default defineConfig({
  plugins: [cdn(), react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
})
