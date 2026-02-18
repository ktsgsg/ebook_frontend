import { html } from 'hono/html'
import { styles } from './styles.js'
import { FILE_SERVER_URL, CLIENT_API_URL } from './config.js'
import type { SearchResponse, SearchHit, BookDetail, TableOfContentsItem, AdvancedSearchParams } from './types.js'

// サイト設定（編集しやすいように変数化）
export const siteConfig = {
  title: '暴れん坊会計士',
  placeholder: '検索キーワードを入力...',
  searchButtonText: '検索',
  advancedSearchText: '詳細検索',
  simpleSearchText: '簡易検索',
  noResultsMessage: '検索キーワードを入力して検索してください',
  emptyResultsMessage: '検索結果がありません',
  noTitleText: 'タイトルなし',
  noImageText: 'No Image',
  pdfDownloadButtonText: 'PDFをダウンロード',
  viewerButtonText: 'ビューアで読む',
  backToSearchText: '← 検索に戻る',
  descriptionLabel: '概要',
  tocLabel: '目次',
  pageLabel: 'ページ',
  clearButtonText: 'クリア',
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
  <link rel="icon" type="image/svg+xml" href="/ico.svg">
  <title>${siteConfig.title}</title>
  <style>${styles}</style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${siteConfig.title}</h1>
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
      <a href="/advanced-search" class="advanced-search-link">${siteConfig.advancedSearchText}</a>
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
                  ${hit.publisher ? html`<div class="card-meta">${hit.publisher}</div>` : ''}
                  <div class="card-id">ID: ${hit.id}</div>
                  <div class="card-description">
                    ${hit.description
          ? html`<div class="description-text">${hit.description}</div>`
          : html`<div class="description-none">説明がありません</div>`
        }
                  </div>
                </div>
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
      <div class="no-results" id="no-results-message">${siteConfig.noResultsMessage}</div>
    `}
  </div>

  <script>
    const API_URL = '${CLIENT_API_URL}';
    const FILE_SERVER = '${FILE_SERVER_URL}';
    const config = {
      noImageText: '${siteConfig.noImageText}',
      noTitleText: '${siteConfig.noTitleText}',
      emptyResultsMessage: '${siteConfig.emptyResultsMessage}'
    };

    let currentPage = 1;
    let currentLimit = 20;
    let currentQuery = '';

    function escapeHtml(text) {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    function renderSearchResults(results, query, page, limit) {
      const totalHits = results.estimatedTotalHits || 0;
      const totalPages = Math.ceil(totalHits / limit);
      const hasPrev = page > 1;
      const hasNext = page < totalPages;

      let html = '';

      if (totalHits > 0) {
        html += '<div class="results-info">「' + escapeHtml(query) + '」の検索結果: 約 ' + totalHits + ' 件 (' + results.processingTimeMs + 'ms)</div>';
      } else {
        html += '<div class="results-info">「' + escapeHtml(query) + '」に一致する結果はありませんでした</div>';
      }

      if (results.hits && results.hits.length > 0) {
        html += '<div class="results-list">';
        results.hits.forEach(function(hit) {
          html += '<a href="/book/' + escapeHtml(hit.id) + '" class="card-link">';
          html += '<div class="result-card">';
          html += '<div class="thumbnail-container">';
          html += '<img class="thumbnail" src="' + FILE_SERVER + '/thumbnail/' + escapeHtml(hit.id) + '.png" alt="' + escapeHtml(hit.title || hit.id) + '" onerror="this.style.display=\\'none\\'; this.nextElementSibling.style.display=\\'block\\';">';
          html += '<span class="thumbnail-placeholder" style="display: none;">' + config.noImageText + '</span>';
          html += '</div>';
          html += '<div class="card-content">';
          html += '<div class="card-title">' + escapeHtml(hit.title || config.noTitleText) + '</div>';
          if (hit.authors) html += '<div class="card-meta">' + escapeHtml(hit.authors) + '</div>';
          if (hit.publisher) html += '<div class="card-meta">' + escapeHtml(hit.publisher) + '</div>';
          html += '<div class="card-id">ID: ' + escapeHtml(hit.id) + '</div>';
          html += '<div class="card-description">';
          if (hit.description) {
            html += '<div class="description-text">' + escapeHtml(hit.description) + '</div>';
          } else {
            html += '<div class="description-none">説明がありません</div>';
          }
          html += '</div></div></div></a>';
        });
        html += '</div>';

        if (totalPages > 1) {
          html += '<div class="pagination">';
          html += '<a href="#" class="' + (!hasPrev ? 'disabled' : '') + '" onclick="if(' + hasPrev + '){changePage(' + (page - 1) + ')};return false;">← 前へ</a>';
          html += '<span class="page-info">' + page + ' / ' + totalPages + ' ページ</span>';
          html += '<a href="#" class="' + (!hasNext ? 'disabled' : '') + '" onclick="if(' + hasNext + '){changePage(' + (page + 1) + ')};return false;">次へ →</a>';
          html += '</div>';
        }
      } else if (totalHits === 0) {
        html += '<div class="no-results">' + config.emptyResultsMessage + '</div>';
      }

      return html;
    }

    function updateResults(results) {
      const resultsContainer = document.getElementById('results-container');
      if (!resultsContainer) {
        // 結果コンテナがない場合は作成
        const container = document.querySelector('.container');
        const noResultsMsg = document.getElementById('no-results-message');
        if (noResultsMsg) noResultsMsg.remove();

        const existingResults = container.querySelector('.results-info');
        if (existingResults) {
          // 既存の結果を削除
          const toRemove = container.querySelectorAll('.results-info, .results-list, .pagination, .no-results');
          toRemove.forEach(function(el) { el.remove(); });
        }

        const newContainer = document.createElement('div');
        newContainer.id = 'results-container';
        container.appendChild(newContainer);
      }

      const targetContainer = document.getElementById('results-container') || document.querySelector('.container');
      if (targetContainer.id === 'results-container') {
        targetContainer.innerHTML = renderSearchResults(results, currentQuery, currentPage, currentLimit);
      } else {
        // 既存の結果を削除
        const toRemove = targetContainer.querySelectorAll('.results-info, .results-list, .pagination, .no-results, #no-results-message');
        toRemove.forEach(function(el) { el.remove(); });
        targetContainer.insertAdjacentHTML('beforeend', '<div id="results-container">' + renderSearchResults(results, currentQuery, currentPage, currentLimit) + '</div>');
      }
    }

    async function performSearch(query, page, limit) {
      currentQuery = query;
      currentPage = page;
      currentLimit = limit;
      const offset = (page - 1) * limit;

      // URLを更新
      const newUrl = '/?q=' + encodeURIComponent(query) + '&page=' + page;
      window.history.pushState({ query: query, page: page }, '', newUrl);

      try {
        const searchUrl = new URL('/search', API_URL);
        searchUrl.searchParams.set('q', query);
        searchUrl.searchParams.set('limit', limit.toString());
        searchUrl.searchParams.set('offset', offset.toString());

        const response = await fetch(searchUrl.toString());
        if (!response.ok) {
          throw new Error('検索APIエラー: ' + response.status);
        }
        const results = await response.json();
        updateResults(results);
      } catch (error) {
        const container = document.querySelector('.container');
        const existingError = container.querySelector('.error');
        if (existingError) existingError.remove();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = error.message || '検索中にエラーが発生しました';
        container.querySelector('header').after(errorDiv);
      }
    }

    function changePage(page) {
      performSearch(currentQuery, page, currentLimit);
    }

    document.addEventListener('DOMContentLoaded', function() {
      const form = document.querySelector('.search-form');
      const input = form.querySelector('.search-input');

      // URLパラメータから初期値を設定
      const urlParams = new URLSearchParams(window.location.search);
      currentQuery = urlParams.get('q') || '';
      currentPage = parseInt(urlParams.get('page') || '1', 10);

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const query = input.value.trim();
        if (query) {
          performSearch(query, 1, currentLimit);
        }
      });

      // ブラウザの戻る/進むボタン対応
      window.addEventListener('popstate', function(e) {
        if (e.state) {
          currentQuery = e.state.query || '';
          currentPage = e.state.page || 1;
          input.value = currentQuery;
          if (currentQuery) {
            performSearch(currentQuery, currentPage, currentLimit);
          }
        }
      });
    });
  </script>
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
  <link rel="icon" type="image/svg+xml" href="/ico.svg">
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
            download
          >
            ${siteConfig.pdfDownloadButtonText}
          </a>
          <a
            href="/book/view?id=${book.content_id}"
            class="pdf-link"
          >
            ${siteConfig.viewerButtonText}
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

// 詳細検索ページテンプレート
export const renderAdvancedSearchPage = (
  params: AdvancedSearchParams = {},
  results: SearchResponse | null = null,
  error: string | null = null,
  currentPage: number = 1,
  limit: number = 20
) => {
  const totalHits = results?.estimatedTotalHits || 0
  const totalPages = Math.ceil(totalHits / limit)
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

  // URLパラメータを構築
  const buildPaginationUrl = (page: number) => {
    const urlParams = new URLSearchParams()
    if (params.keyword) urlParams.set('keyword', params.keyword)
    if (params.title) urlParams.set('title', params.title)
    if (params.authors) urlParams.set('authors', params.authors)
    if (params.publisher) urlParams.set('publisher', params.publisher)
    if (params.genre) urlParams.set('genre', params.genre)
    if (params.language) urlParams.set('language', params.language)
    if (params.publication_date_from) urlParams.set('publication_date_from', params.publication_date_from)
    if (params.publication_date_to) urlParams.set('publication_date_to', params.publication_date_to)
    if (params.ndc_class) urlParams.set('ndc_class', params.ndc_class)
    if (params.subject) urlParams.set('subject', params.subject)
    urlParams.set('page', page.toString())
    return `/advanced-search?${urlParams.toString()}`
  }

  return html`
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/svg+xml" href="/ico.svg">
  <title>${siteConfig.advancedSearchText} - ${siteConfig.title}</title>
  <style>${styles}</style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${siteConfig.title}</h1>
      <a href="/" class="simple-search-link">${siteConfig.simpleSearchText}</a>
    </header>

    <div class="advanced-search-section">
      <h2>${siteConfig.advancedSearchText}</h2>
      <form class="advanced-search-form" action="/advanced-search" method="GET">
        <div class="form-row">
          <label for="keyword">キーワード</label>
          <input type="text" id="keyword" name="keyword" value="${params.keyword || ''}" placeholder="全文検索...">
        </div>
        <div class="form-row">
          <label for="title">タイトル</label>
          <input type="text" id="title" name="title" value="${params.title || ''}" placeholder="タイトルを入力...">
        </div>
        <div class="form-row">
          <label for="authors">${metaLabels.authors}</label>
          <input type="text" id="authors" name="authors" value="${params.authors || ''}" placeholder="著者名を入力...">
        </div>
        <div class="form-row">
          <label for="publisher">${metaLabels.publisher}</label>
          <input type="text" id="publisher" name="publisher" value="${params.publisher || ''}" placeholder="出版社を入力...">
        </div>
        <div class="form-row">
          <label for="genre">${metaLabels.genre}</label>
          <input type="text" id="genre" name="genre" value="${params.genre || ''}" placeholder="例: 人文科学 > 心理学">
        </div>
        <div class="form-row">
          <label for="language">${metaLabels.language}</label>
          <input type="text" id="language" name="language" value="${params.language || ''}" placeholder="例: 日本語">
        </div>
        <div class="form-row">
          <label for="publication_date_from">${metaLabels.publication_date}</label>
          <div class="date-range">
            <input type="text" id="publication_date_from" name="publication_date_from" value="${params.publication_date_from || ''}" placeholder="開始 (例: 2000)">
            <span>〜</span>
            <input type="text" id="publication_date_to" name="publication_date_to" value="${params.publication_date_to || ''}" placeholder="終了 (例: 2024)">
          </div>
        </div>
        <div class="form-row">
          <label for="ndc_class">${metaLabels.ndc_class}</label>
          <input type="text" id="ndc_class" name="ndc_class" value="${params.ndc_class || ''}" placeholder="例: 141.21">
        </div>
        <div class="form-row">
          <label for="subject">${metaLabels.subject}</label>
          <input type="text" id="subject" name="subject" value="${params.subject || ''}" placeholder="主題を入力...">
        </div>
        <div class="form-actions">
          <button type="submit" class="search-button">${siteConfig.searchButtonText}</button>
          <a href="/advanced-search" class="clear-button">${siteConfig.clearButtonText}</a>
        </div>
      </form>
    </div>

    ${error ? html`<div class="error">${error}</div>` : ''}

    ${results ? html`
      <div class="results-info">
        ${results.estimatedTotalHits > 0
        ? html`検索結果: 約 ${results.estimatedTotalHits} 件 (${results.processingTimeMs}ms)`
        : html`条件に一致する結果はありませんでした`
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
                  ${hit.publisher ? html`<div class="card-meta">${hit.publisher}</div>` : ''}
                  <div class="card-id">ID: ${hit.id}</div>
                  <div class="card-description">
                    ${hit.description
          ? html`<div class="description-text">${hit.description}</div>`
          : html`<div class="description-none">説明がありません</div>`
        }
                  </div>
                </div>
              </div>
            </a>
          `)}
        </div>

        ${totalPages > 1 ? html`
          <div class="pagination">
            <a href="${buildPaginationUrl(currentPage - 1)}" class="${!hasPrev ? 'disabled' : ''}">← 前へ</a>
            <span class="page-info">${currentPage} / ${totalPages} ページ</span>
            <a href="${buildPaginationUrl(currentPage + 1)}" class="${!hasNext ? 'disabled' : ''}">次へ →</a>
          </div>
        ` : ''}
      ` : html`
        <div class="no-results" id="empty-results-message">${siteConfig.emptyResultsMessage}</div>
      `}
    ` : ''}
  </div>

  <script>
    const API_URL = '${CLIENT_API_URL}';
    const FILE_SERVER = '${FILE_SERVER_URL}';
    const advConfig = {
      noImageText: '${siteConfig.noImageText}',
      noTitleText: '${siteConfig.noTitleText}',
      emptyResultsMessage: '${siteConfig.emptyResultsMessage}'
    };

    let advCurrentPage = 1;
    let advCurrentLimit = 20;
    let advCurrentParams = {};

    function escapeHtmlAdv(text) {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    function renderAdvSearchResults(results, page, limit) {
      const totalHits = results.estimatedTotalHits || 0;
      const totalPages = Math.ceil(totalHits / limit);
      const hasPrev = page > 1;
      const hasNext = page < totalPages;

      let html = '';

      if (totalHits > 0) {
        html += '<div class="results-info">検索結果: 約 ' + totalHits + ' 件 (' + results.processingTimeMs + 'ms)</div>';
      } else {
        html += '<div class="results-info">条件に一致する結果はありませんでした</div>';
      }

      if (results.hits && results.hits.length > 0) {
        html += '<div class="results-list">';
        results.hits.forEach(function(hit) {
          html += '<a href="/book/' + escapeHtmlAdv(hit.id) + '" class="card-link">';
          html += '<div class="result-card">';
          html += '<div class="thumbnail-container">';
          html += '<img class="thumbnail" src="' + FILE_SERVER + '/thumbnail/' + escapeHtmlAdv(hit.id) + '.png" alt="' + escapeHtmlAdv(hit.title || hit.id) + '" onerror="this.style.display=\\'none\\'; this.nextElementSibling.style.display=\\'block\\';">';
          html += '<span class="thumbnail-placeholder" style="display: none;">' + advConfig.noImageText + '</span>';
          html += '</div>';
          html += '<div class="card-content">';
          html += '<div class="card-title">' + escapeHtmlAdv(hit.title || advConfig.noTitleText) + '</div>';
          if (hit.authors) html += '<div class="card-meta">' + escapeHtmlAdv(hit.authors) + '</div>';
          if (hit.publisher) html += '<div class="card-meta">' + escapeHtmlAdv(hit.publisher) + '</div>';
          html += '<div class="card-id">ID: ' + escapeHtmlAdv(hit.id) + '</div>';
          html += '<div class="card-description">';
          if (hit.description) {
            html += '<div class="description-text">' + escapeHtmlAdv(hit.description) + '</div>';
          } else {
            html += '<div class="description-none">説明がありません</div>';
          }
          html += '</div></div></div></a>';
        });
        html += '</div>';

        if (totalPages > 1) {
          html += '<div class="pagination">';
          html += '<a href="#" class="' + (!hasPrev ? 'disabled' : '') + '" onclick="if(' + hasPrev + '){changeAdvPage(' + (page - 1) + ')};return false;">← 前へ</a>';
          html += '<span class="page-info">' + page + ' / ' + totalPages + ' ページ</span>';
          html += '<a href="#" class="' + (!hasNext ? 'disabled' : '') + '" onclick="if(' + hasNext + '){changeAdvPage(' + (page + 1) + ')};return false;">次へ →</a>';
          html += '</div>';
        }
      } else if (totalHits === 0) {
        html += '<div class="no-results">' + advConfig.emptyResultsMessage + '</div>';
      }

      return html;
    }

    function updateAdvResults(results) {
      let resultsContainer = document.getElementById('adv-results-container');
      if (!resultsContainer) {
        const container = document.querySelector('.container');
        const emptyMsg = document.getElementById('empty-results-message');
        if (emptyMsg) emptyMsg.remove();

        const toRemove = container.querySelectorAll('.results-info, .results-list, .pagination, .no-results:not(.advanced-search-section .no-results)');
        toRemove.forEach(function(el) { el.remove(); });

        const newContainer = document.createElement('div');
        newContainer.id = 'adv-results-container';
        container.appendChild(newContainer);
        resultsContainer = newContainer;
      }

      resultsContainer.innerHTML = renderAdvSearchResults(results, advCurrentPage, advCurrentLimit);
    }

    function buildAdvPaginationUrl(params, page) {
      const urlParams = new URLSearchParams();
      Object.keys(params).forEach(function(key) {
        if (params[key]) urlParams.set(key, params[key]);
      });
      urlParams.set('page', page.toString());
      return '/advanced-search?' + urlParams.toString();
    }

    async function performAdvSearch(params, page, limit) {
      advCurrentParams = params;
      advCurrentPage = page;
      advCurrentLimit = limit;
      const offset = (page - 1) * limit;

      // URLを更新
      const newUrl = buildAdvPaginationUrl(params, page);
      window.history.pushState({ params: params, page: page }, '', newUrl);

      // テキスト検索用のクエリを構築（Meilisearchはフィルターで部分一致検索をサポートしていない）
      const queryParts = [];
      if (params.keyword) queryParts.push(params.keyword);
      if (params.title) queryParts.push(params.title);
      if (params.authors) queryParts.push(params.authors);
      if (params.publisher) queryParts.push(params.publisher);
      if (params.genre) queryParts.push(params.genre);
      if (params.ndc_class) queryParts.push(params.ndc_class);
      if (params.subject) queryParts.push(params.subject);

      // フィルター条件を構築（完全一致や範囲検索のみ）
      const filters = [];
      if (params.language) filters.push('language = "' + params.language + '"');
      if (params.publication_date_from) filters.push('publication_date >= ' + params.publication_date_from);
      if (params.publication_date_to) filters.push('publication_date <= ' + params.publication_date_to);

      try {
        const searchUrl = new URL('/search', API_URL);
        const requestBody = {
          query: queryParts.join(' '),
          limit: limit,
          offset: offset
        };

        if (filters.length > 0) {
          requestBody.filter = filters.join(' AND ');
        }

        const response = await fetch(searchUrl.toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          throw new Error('検索APIエラー: ' + response.status);
        }

        const results = await response.json();
        updateAdvResults(results);
      } catch (error) {
        const container = document.querySelector('.container');
        const existingError = container.querySelector('.error');
        if (existingError) existingError.remove();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = error.message || '検索中にエラーが発生しました';
        const advSection = container.querySelector('.advanced-search-section');
        if (advSection) {
          advSection.after(errorDiv);
        } else {
          container.querySelector('header').after(errorDiv);
        }
      }
    }

    function changeAdvPage(page) {
      performAdvSearch(advCurrentParams, page, advCurrentLimit);
    }

    function getFormParams() {
      return {
        keyword: document.getElementById('keyword').value.trim(),
        title: document.getElementById('title').value.trim(),
        authors: document.getElementById('authors').value.trim(),
        publisher: document.getElementById('publisher').value.trim(),
        genre: document.getElementById('genre').value.trim(),
        language: document.getElementById('language').value.trim(),
        publication_date_from: document.getElementById('publication_date_from').value.trim(),
        publication_date_to: document.getElementById('publication_date_to').value.trim(),
        ndc_class: document.getElementById('ndc_class').value.trim(),
        subject: document.getElementById('subject').value.trim()
      };
    }

    function hasAnyParam(params) {
      return Object.values(params).some(function(v) { return v && v.length > 0; });
    }

    document.addEventListener('DOMContentLoaded', function() {
      const form = document.querySelector('.advanced-search-form');

      // URLパラメータから初期値を設定
      const urlParams = new URLSearchParams(window.location.search);
      advCurrentPage = parseInt(urlParams.get('page') || '1', 10);
      advCurrentParams = getFormParams();

      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const params = getFormParams();
        if (hasAnyParam(params)) {
          performAdvSearch(params, 1, advCurrentLimit);
        }
      });

      // ブラウザの戻る/進むボタン対応
      window.addEventListener('popstate', function(e) {
        if (e.state) {
          advCurrentParams = e.state.params || {};
          advCurrentPage = e.state.page || 1;
          // フォームに値を復元
          Object.keys(advCurrentParams).forEach(function(key) {
            const el = document.getElementById(key);
            if (el) el.value = advCurrentParams[key] || '';
          });
          if (hasAnyParam(advCurrentParams)) {
            performAdvSearch(advCurrentParams, advCurrentPage, advCurrentLimit);
          }
        }
      });
    });
  </script>
</body>
</html>
`}

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
  <link rel="icon" type="image/svg+xml" href="/ico.svg">
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
