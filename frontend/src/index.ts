import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { BACKEND_API_URL, FILE_SERVER_URL, PORT } from './config.js'
import { renderPage, renderBookDetail, renderErrorPage, renderAdvancedSearchPage } from './templates.js'
import type { SearchResponse, BookDetail, AdvancedSearchParams } from './types.js'
import * as fs from "node:fs/promises";
const app = new Hono()

// faviconの提供
app.get('/ico.svg', serveStatic({ path: './ico.svg' }))

// assetsフォルダへの直接アクセス用
app.use('/assets/*', serveStatic({ root: './static' }))

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

// 詳細検索ページ
app.get('/advanced-search', async (c) => {
  const limit = parseInt(c.req.query('limit') || '20', 10)
  const page = parseInt(c.req.query('page') || '1', 10)
  const offset = (page - 1) * limit

  // 検索パラメータを取得
  const params: AdvancedSearchParams = {
    keyword: c.req.query('keyword') || '',
    title: c.req.query('title') || '',
    authors: c.req.query('authors') || '',
    publisher: c.req.query('publisher') || '',
    genre: c.req.query('genre') || '',
    language: c.req.query('language') || '',
    publication_date_from: c.req.query('publication_date_from') || '',
    publication_date_to: c.req.query('publication_date_to') || '',
    ndc_class: c.req.query('ndc_class') || '',
    subject: c.req.query('subject') || '',
  }

  // 検索条件が何もなければフォームのみ表示
  const hasSearchParams = Object.values(params).some(v => v && v.trim() !== '')
  if (!hasSearchParams) {
    return c.html(renderAdvancedSearchPage())
  }

  try {
    // テキスト検索用のクエリを構築（Meilisearchはフィルターで部分一致検索をサポートしていない）
    const queryParts: string[] = []
    if (params.keyword) queryParts.push(params.keyword)
    if (params.title) queryParts.push(params.title)
    if (params.authors) queryParts.push(params.authors)
    if (params.publisher) queryParts.push(params.publisher)
    if (params.genre) queryParts.push(params.genre)
    if (params.ndc_class) queryParts.push(params.ndc_class)
    if (params.subject) queryParts.push(params.subject)

    // フィルター条件を構築（完全一致や範囲検索のみ）
    const filters: string[] = []
    if (params.language) {
      filters.push(`language = "${params.language}"`)
    }
    if (params.publication_date_from) {
      filters.push(`publication_date >= ${params.publication_date_from}`)
    }
    if (params.publication_date_to) {
      filters.push(`publication_date <= ${params.publication_date_to}`)
    }

    // POST APIを使用して検索
    const searchUrl = new URL('/search', BACKEND_API_URL)
    const requestBody: {
      query: string
      limit: number
      offset: number
      filter?: string
    } = {
      query: queryParts.join(' '),
      limit,
      offset,
    }

    if (filters.length > 0) {
      requestBody.filter = filters.join(' AND ')
    }

    const response = await fetch(searchUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
    console.log(await response.text())
    if (!response.ok) {
      throw new Error(`検索APIエラー: ${response.status}`)
    }

    const results: SearchResponse = await response.json()
    return c.html(renderAdvancedSearchPage(params, results, null, page, limit))
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '検索中にエラーが発生しました'
    return c.html(renderAdvancedSearchPage(params, null, errorMessage, page, limit))
  }
})

app.get('/book/view', async (c) => {
  const file = await fs.readFile("static/index.html")
  return c.html(file.toString())
})

// 本の詳細ページ
app.get('/book/:id', async (c) => {
  const id = c.req.param('id')

  try {
    // ファイルサーバーからメタデータを取得
    const metadataUrl = `${FILE_SERVER_URL}/files/${id}.json`

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
