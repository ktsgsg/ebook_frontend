import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { BACKEND_API_URL, FILE_SERVER_URL, PORT } from './config.js'
import { renderPage, renderBookDetail, renderErrorPage } from './templates.js'
import type { SearchResponse, BookDetail } from './types.js'

const app = new Hono()

// メインページ（検索フォーム + 結果表示）
app.get('/', async (c) => {
  const query = c.req.query('q') || ''
  const limit = parseInt(c.req.query('limit') || '20', 10)
  const page = parseInt(c.req.query('page') || '1', 10)
  const offset = (page - 1) * limit

  if (!query) {
    return c.html(renderPage())
  }

  try {
    const searchUrl = new URL('/search', BACKEND_API_URL)
    searchUrl.searchParams.set('q', query)
    searchUrl.searchParams.set('limit', limit.toString())
    searchUrl.searchParams.set('offset', offset.toString())

    const response = await fetch(searchUrl.toString())

    if (!response.ok) {
      throw new Error(`検索APIエラー: ${response.status}`)
    }

    const results: SearchResponse = await response.json()
    return c.html(renderPage(query, results, null, page, limit))
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '検索中にエラーが発生しました'
    return c.html(renderPage(query, null, errorMessage, page, limit))
  }
})

// 本の詳細ページ
app.get('/book/:id', async (c) => {
  const id = c.req.param('id')

  try {
    // ファイルサーバーからメタデータを取得
    const metadataUrl = `${FILE_SERVER_URL}/files/metadata/${id}.json`

    const response = await fetch(metadataUrl)

    if (!response.ok) {
      if (response.status === 404) {
        return c.html(renderErrorPage('本が見つかりません', `ID: ${id} の本は見つかりませんでした。`), 404)
      }
      throw new Error(`APIエラー: ${response.status}`)
    }

    const book: BookDetail = await response.json()

    // content_idが無い場合はidを使用
    if (!book.content_id) {
      book.content_id = id
    }

    return c.html(renderBookDetail(book))
  } catch (error) {
    console.error('エラー発生:', error)
    const errorMessage = error instanceof Error ? error.message : '本の情報を取得できませんでした'
    return c.html(renderErrorPage('エラー', errorMessage), 500)
  }
})

// ヘルスチェック
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    backendApiUrl: BACKEND_API_URL,
    fileServerUrl: FILE_SERVER_URL
  })
})

serve({
  fetch: app.fetch,
  port: PORT
}, (info) => {
  console.log(`Frontend server is running on http://localhost:${info.port}`)
  console.log(`Backend API: ${BACKEND_API_URL}`)
  console.log(`File Server: ${FILE_SERVER_URL}`)
})
