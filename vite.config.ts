import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import postcss from './postcss.config.js'
import fs from 'fs'
import path from 'path'

let httpsConfig

if (process.env.MODE === "development") {
  httpsConfig = {
    key: fs.readFileSync(path.resolve(__dirname, '../certificates/localhost+2-key.pem')),
    cert: fs.readFileSync(path.resolve(__dirname, '../certificates/localhost+2.pem')),
  }
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  css: {
    postcss
  },
  server: {
    https: httpsConfig
  }
})
