import { html } from 'hono/html'
import { styles } from './styles.js'
import { FILE_SERVER_URL } from './config.js'
import type { SearchResponse, SearchHit, BookDetail, TableOfContentsItem } from './types.js'

// サイト設定（編集しやすいように変数化）
export const siteConfig = {
   title: '暴れん坊会計士',
   placeholder: '検索キーワードを入力...',
   searchButtonText: '検索',
   noResultsMessage: '検索キーワードを入力して検索してください',
   emptyResultsMessage: '検索結果がありません',
   noTitleText: 'タイトルなし',
   noImageText: 'No Image',
   pdfButtonText: 'PDFを開く',
   backToSearchText: '← 検索に戻る',
   descriptionLabel: '概要',
   tocLabel: '目次',
   pageLabel: 'ページ',
}

// メタデータのラベル設定
export const metaLabels = {
   authors: '著者',
   publisher: '出版社',
   publication_date: '出版日',
   page_count: 'ページ数',
   isbn: 'ISBN',
   genre: 'ジャンル',
   language: '言語',
   ndc_class: 'NDC分類',
   subject: '主題',
}

// HTMLテンプレート
export const renderPage = (
   query: string = '',
   results: SearchResponse | null = null,
   error: string | null = null,
   currentPage: number = 1,
   limit: number = 20
) => {
   const totalHits = results?.estimatedTotalHits || 0
   const totalPages = Math.ceil(totalHits / limit)
   const hasPrev = currentPage > 1
   const hasNext = currentPage < totalPages

   return html`
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${siteConfig.title}</title>
  <style>${styles}</style>
</head>
<body>
  <div class="container">
    <header>
      <h1> ${siteConfig.title}</h1>
      <div>進む我らの確信ここに...</div>
      <form class="search-form" action="/" method="GET">
        <input
          type="text"
          name="q"
          class="search-input"
          placeholder="${siteConfig.placeholder}"
          value="${query}"
          autocomplete="off"
        />
        <button type="submit" class="search-button">${siteConfig.searchButtonText}</button>
      </form>
    </header>

    ${error ? html`<div class="error">${error}</div>` : ''}

    ${results ? html`
      <div class="results-info">
        ${results.estimatedTotalHits > 0
            ? html`「${results.query}」の検索結果: 約 ${results.estimatedTotalHits} 件 (${results.processingTimeMs}ms)`
            : html`「${results.query}」に一致する結果はありませんでした`
         }
      </div>

      ${results.hits.length > 0 ? html`
        <div class="results-list">
          ${results.hits.map((hit: SearchHit) => html`
            <a href="/book/${hit.id}" class="card-link">
              <div class="result-card">
                <div class="thumbnail-container">
                  <img
                    class="thumbnail"
                    src="${FILE_SERVER_URL}/thumbnail/${hit.id}.png"
                    alt="${hit.title || hit.id}"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                  />
                  <span class="thumbnail-placeholder" style="display: none;">${siteConfig.noImageText}</span>
                </div>
                <div class="card-content">
                  <div class="card-title">${hit.title || siteConfig.noTitleText}</div>
                  ${hit.authors ? html`<div class="card-meta">${hit.authors}</div>` : ''}
                  <div class="card-id">ID: ${hit.id}</div>
                </div>
              </div>
              <div class="card-description">
                ${hit.publisher ? html`<div class="description-meta">${hit.publisher}</div>` : ''}
                ${hit.description
               ? html`<div class="description-text">${hit.description}</div>`
               : html`<div class="description-none">説明がありません</div>`
            }
              </div>
            </a>
          `)}
        </div>

        ${totalPages > 1 ? html`
          <div class="pagination">
            <a href="/?q=${encodeURIComponent(query)}&page=${currentPage - 1}" class="${!hasPrev ? 'disabled' : ''}">← 前へ</a>
            <span class="page-info">${currentPage} / ${totalPages} ページ</span>
            <a href="/?q=${encodeURIComponent(query)}&page=${currentPage + 1}" class="${!hasNext ? 'disabled' : ''}">次へ →</a>
          </div>
        ` : ''}
      ` : html`
        <div class="no-results">${siteConfig.emptyResultsMessage}</div>
      `}
    ` : html`
      <div class="no-results">${siteConfig.noResultsMessage}</div>
    `}
  </div>
</body>
</html>
`}

// 本の詳細ページテンプレート
export const renderBookDetail = (
   book: BookDetail,
   error: string | null = null
) => html`
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${book.title} - ${siteConfig.title}</title>
  <style>${styles}</style>
</head>
<body>
  <div class="container">
    <a href="/" class="back-link">${siteConfig.backToSearchText}</a>

    ${error ? html`<div class="error">${error}</div>` : ''}

    <div class="book-detail">
      <div class="book-thumbnail-wrapper">
        <img
          class="book-thumbnail"
          src="${FILE_SERVER_URL}/thumbnail/${book.content_id}.png"
          alt="${book.title}"
          onerror="this.style.display='none';"
        />
      </div>

      <div class="book-info">
        <h1 class="book-title">${book.title}</h1>

        <div class="book-meta">
          <div class="book-meta-item">
            <span class="book-meta-label">${metaLabels.authors}</span>
            <span>${book.authors || '-'}</span>
          </div>
          <div class="book-meta-item">
            <span class="book-meta-label">${metaLabels.publisher}</span>
            <span>${book.publisher || '-'}</span>
          </div>
          <div class="book-meta-item">
            <span class="book-meta-label">${metaLabels.publication_date}</span>
            <span>${book.publication_date || '-'}</span>
          </div>
          <div class="book-meta-item">
            <span class="book-meta-label">${metaLabels.page_count}</span>
            <span>${book.page_count || '-'}</span>
          </div>
          <div class="book-meta-item">
            <span class="book-meta-label">${metaLabels.isbn}</span>
            <span>${book.isbn || '-'}</span>
          </div>
          <div class="book-meta-item">
            <span class="book-meta-label">${metaLabels.genre}</span>
            <span>${book.genre || '-'}</span>
          </div>
          <div class="book-meta-item">
            <span class="book-meta-label">${metaLabels.language}</span>
            <span>${book.language || '-'}</span>
          </div>
          <div class="book-meta-item">
            <span class="book-meta-label">${metaLabels.ndc_class}</span>
            <span>${book.ndc_class || '-'}</span>
          </div>
        </div>

        ${book.description ? html`
          <div class="book-description">
            <h3>${siteConfig.descriptionLabel}</h3>
            <p>${book.description}</p>
          </div>
        ` : ''}

        <div class="book-actions">
          <a
            href="${FILE_SERVER_URL}/pdf/${book.content_id}.pdf"
            class="pdf-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            ${siteConfig.pdfButtonText}
          </a>
        </div>
      </div>
    </div>

    ${book.table_of_contents && book.table_of_contents.length > 0 ? html`
      <div class="toc-section">
        <h2>${siteConfig.tocLabel}</h2>
        <ul class="toc-list">
          ${book.table_of_contents.map((item: TableOfContentsItem) => html`
            <li class="toc-item">
              <span class="toc-chapter">${item.chapter}</span>
              <span class="toc-page">${siteConfig.pageLabel} ${item.page}</span>
            </li>
          `)}
        </ul>
      </div>
    ` : ''}
  </div>
</body>
</html>
`

// エラーページテンプレート
export const renderErrorPage = (
   title: string,
   message: string
) => html`
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - ${siteConfig.title}</title>
  <style>${styles}</style>
</head>
<body>
  <div class="container">
    <a href="/" class="back-link">${siteConfig.backToSearchText}</a>
    <div class="error">${message}</div>
  </div>
</body>
</html>
`
